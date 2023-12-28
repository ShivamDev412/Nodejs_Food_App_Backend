"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUserProfile = exports.userProfile = exports.verifyAccount = exports.login = exports.resendOtp = exports.signup = void 0;
const class_transformer_1 = require("class-transformer");
const User_dto_1 = require("../dto/User.dto");
const class_validator_1 = require("class-validator");
const User_1 = __importDefault(require("../models/User"));
const PasswordUtility_1 = require("../utility/PasswordUtility");
const NotificationUtility_1 = require("../utility/NotificationUtility");
const Vendor_1 = __importDefault(require("../models/Vendor"));
const signup = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = (0, class_transformer_1.plainToClass)(User_dto_1.CreateCustomerInput, request.body);
        const inputErrors = yield (0, class_validator_1.validate)(customer, {
            validationError: { target: false, value: false },
        });
        if (inputErrors.length > 0) {
            throw inputErrors;
        }
        const { email, password, phone, firstName, lastName } = customer;
        const userExist = yield User_1.default.findOne({ email });
        const vendorExist = yield Vendor_1.default.findOne({ email });
        if (userExist || vendorExist) {
            return response.status(409).json({
                success: false,
                message: "User already exist with that email",
            });
        }
        const salt = yield (0, PasswordUtility_1.GenerateSalt)();
        const hashedPassword = yield (0, PasswordUtility_1.GeneratePassword)(password, salt);
        const { otp, expiry } = (0, NotificationUtility_1.generateOtp)();
        const user = yield User_1.default.create({
            email,
            password: hashedPassword,
            phone,
            salt,
            otp,
            otp_expiry: expiry,
            firstName,
            lastName,
            address: "",
            verified: false,
            lat: 0,
            lng: 0,
        });
        if (user) {
            yield (0, NotificationUtility_1.onRequestOtp)(otp, phone);
            const signature = yield (0, PasswordUtility_1.generateSignature)({
                _id: user._id,
                email: user.email,
                verified: user.verified,
            });
            const oneMonthInMillis = 30 * 24 * 60 * 60 * 1000;
            response.cookie("auth-token", signature, {
                maxAge: oneMonthInMillis,
                httpOnly: true,
            });
            return response.status(201).json({
                success: true,
                data: user,
                message: "User created successfully",
            });
        }
        else {
            throw new Error("Failed to create user");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.signup = signup;
const resendOtp = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phone } = request.body;
        const user = yield User_1.default.findOne({ email: email });
        if (user) {
            const { otp, expiry } = (0, NotificationUtility_1.generateOtp)();
            user.otp = otp;
            user.otp_expiry = expiry;
            yield user.save();
            yield (0, NotificationUtility_1.onRequestOtp)(otp, phone);
            return response.status(200).json({
                success: true,
                message: "OTP resent successfully",
            });
        }
        return response.status(400).json({
            success: false,
            message: "User not found",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.resendOtp = resendOtp;
const login = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = (0, class_transformer_1.plainToClass)(User_dto_1.LoginCustomerInput, request.body);
        const inputErrors = yield (0, class_validator_1.validate)(customer, {
            validationError: { target: false, value: false },
        });
        if (inputErrors.length > 0) {
            throw inputErrors;
        }
        const { email, password } = customer;
        const user = yield User_1.default.findOne({ email: email });
        if (user) {
            const validation = yield (0, PasswordUtility_1.ValidatePassword)(password, user.password, user.salt);
            if (validation) {
                const signature = yield (0, PasswordUtility_1.generateSignature)({
                    _id: user._id,
                    email: user.email,
                    verified: user.verified,
                });
                const oneMonthInMillisecond = 30 * 24 * 60 * 60 * 1000;
                response.cookie("auth-token", signature, {
                    maxAge: oneMonthInMillisecond,
                    httpOnly: true,
                });
                return response.status(200).json({
                    success: true,
                    message: "User logged in successfully",
                    data: user,
                });
            }
        }
        return response.status(400).json({
            success: false,
            message: "Invalid credentials",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const verifyAccount = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { otp } = request.body;
        const useId = request.user;
        const user = yield User_1.default.findById(useId);
        if (user) {
            const isValid = user.otp === +otp && user.otp_expiry >= new Date();
            if (isValid) {
                user.verified = true;
                yield user.save();
                const signature = yield (0, PasswordUtility_1.generateSignature)({
                    _id: user._id,
                    email: user.email,
                    verified: user.verified,
                });
                const oneMonthInMillis = 30 * 24 * 60 * 60 * 1000;
                response.cookie("auth-token", signature, {
                    maxAge: oneMonthInMillis,
                    httpOnly: true,
                });
                return response.status(200).json({
                    success: true,
                    message: "Account verified successfully",
                });
            }
            return response.status(400).json({
                success: false,
                message: "Invalid OTP or OTP expired",
            });
        }
        else {
            return response.status(400).json({
                success: false,
                message: "Unauthorized user",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.verifyAccount = verifyAccount;
const userProfile = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = request.user;
        return response.status(200).json({
            success: true,
            message: "User profile fetched successfully",
            data: user,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.userProfile = userProfile;
const editUserProfile = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, address } = request.body;
        const useId = request.user;
        const user = yield User_1.default.findById(useId);
        if (user) {
            user.firstName = firstName;
            user.lastName = lastName;
            user.address = address;
            yield user.save();
            return response.status(200).json({
                success: true,
                message: "User profile updated successfully",
                data: user,
            });
        }
        else {
            return response.status(400).json({
                success: false,
                message: "Unauthorized user",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.editUserProfile = editUserProfile;
