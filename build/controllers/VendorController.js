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
exports.updateVendorServices = exports.updateVendorProfile = exports.getVendorProfile = exports.Login = void 0;
const Vendor_1 = __importDefault(require("../models/Vendor"));
const PasswordUtility_1 = require("../utility/PasswordUtility");
const Login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const isVendorExist = yield Vendor_1.default.findOne({ email });
    if (isVendorExist !== null) {
        const validation = yield (0, PasswordUtility_1.ValidatePassword)(password, isVendorExist.password, isVendorExist.salt);
        if (validation) {
            const signature = yield (0, PasswordUtility_1.generateSignature)({ _id: isVendorExist._id });
            const oneMonthInMillis = 30 * 24 * 60 * 60 * 1000;
            res.cookie("auth-token", signature, {
                maxAge: oneMonthInMillis,
                httpOnly: true,
            });
            return res.json({
                success: true,
                message: "Logged in successfully",
                data: isVendorExist,
            });
        }
        else {
            res
                .status(400)
                .json({ success: false, message: "Password did not match" });
        }
    }
    else {
        return res.json({
            success: false,
            message: "Vendor with that email does not exist",
        });
    }
});
exports.Login = Login;
const getVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user) {
        const existingVendor = yield Vendor_1.default.findById(user._id);
        if (existingVendor) {
            return res.json({
                success: true,
                data: existingVendor,
            });
        }
    }
    return res.json({
        success: false,
        message: "Vendor not found",
    });
});
exports.getVendorProfile = getVendorProfile;
const updateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, foodType, phone } = req.body;
    const user = req.user;
    if (user) {
        const updatedVendor = yield Vendor_1.default.findByIdAndUpdate(user._id, {
            name,
            address,
            foodType,
            phone,
        }, { new: true });
        if (updatedVendor) {
            return res.json({
                success: true,
                message: "Vendor profile updated successfully",
                data: updatedVendor,
            });
        }
    }
    return res.json({
        success: false,
        message: "Vendor not found",
    });
});
exports.updateVendorProfile = updateVendorProfile;
const updateVendorServices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { serviceAvailable } = req.body;
    const user = req.user;
    if (user) {
        const updatedVendor = yield Vendor_1.default.findByIdAndUpdate(user._id, {
            serviceAvailable,
        }, { new: true });
        if (updatedVendor) {
            return res.json({
                success: true,
                message: updatedVendor.serviceAvailable
                    ? "You are online"
                    : "You are offline",
                data: updatedVendor,
            });
        }
    }
    return res.json({
        success: false,
        message: "Vendor not found",
    });
});
exports.updateVendorServices = updateVendorServices;
