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
exports.deleteCart = exports.getCart = exports.addToCart = exports.getOrderById = exports.getOrders = exports.createOrder = exports.editUserProfile = exports.userProfile = exports.verifyAccount = exports.login = exports.resendOtp = exports.signup = void 0;
const class_transformer_1 = require("class-transformer");
const User_dto_1 = require("../dto/User.dto");
const class_validator_1 = require("class-validator");
const User_1 = __importDefault(require("../models/User"));
const PasswordUtility_1 = require("../utility/PasswordUtility");
const NotificationUtility_1 = require("../utility/NotificationUtility");
const Vendor_1 = __importDefault(require("../models/Vendor"));
const Food_1 = __importDefault(require("../models/Food"));
const Order_1 = __importDefault(require("../models/Order"));
const mongoose_1 = __importDefault(require("mongoose"));
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
            orders: [],
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
const createOrder = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = request.user;
        const cart = request.body;
        const user = yield User_1.default.findById(userId);
        if (user) {
            const orderId = new mongoose_1.default.Types.ObjectId();
            const foodIdsInCart = cart.map((item) => item._id);
            const foods = yield Food_1.default.find({
                _id: { $in: foodIdsInCart },
            }).exec();
            let cartItems = foods.map((food) => {
                var _a;
                return (Object.assign(Object.assign({}, food.toObject()), { food: food._id, unit: ((_a = cart.find((item) => item._id === food._id.toString())) === null || _a === void 0 ? void 0 : _a.unit) || 0 }));
            });
            const netAmount = cartItems.reduce((total, item) => total + item.price * item.unit, 0);
            if (cartItems.length > 0) {
                const currentOrder = yield Order_1.default.create({
                    orderId,
                    items: cartItems,
                    totalAmount: netAmount,
                    paidThrough: "COD",
                    paymentResponse: "",
                    orderStatus: "pending",
                    orderDate: new Date(),
                });
                if (currentOrder) {
                    user.orders.push(currentOrder);
                    yield user.save();
                    return response.status(200).json({
                        success: true,
                        message: "Order created successfully",
                        data: currentOrder,
                    });
                }
            }
        }
    }
    catch (error) {
        next(error);
    }
});
exports.createOrder = createOrder;
const getOrders = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = request.user;
        const user = yield User_1.default.findById(userId).populate("orders");
        if (user) {
            return response.status(200).json({
                success: true,
                message: "Orders fetched successfully",
                data: user.orders,
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
exports.getOrders = getOrders;
const getOrderById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = request.params.id;
        const order = yield Order_1.default.findById(orderId).populate("items.food");
        return response.status(200).json({
            success: true,
            message: "Order fetched successfully",
            data: order,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getOrderById = getOrderById;
const addToCart = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = request.user;
        const { _id, unit } = request.body;
        if (unit <= 0) {
            return response.status(400).json({
                success: false,
                message: "Unit should be greater than 0",
            });
        }
        let cartItems = [];
        const food = yield Food_1.default.findById(_id);
        if (food) {
            const user = yield User_1.default.findById(userId).populate("cart.food");
            if (user) {
                cartItems = user.cart || [];
                // Check if food already exists in the cart for the user. If it does, update the unit.
                const existingFoodItemIndex = cartItems.findIndex((item) => { var _a; return ((_a = item.food) === null || _a === void 0 ? void 0 : _a._id.toString()) === _id; });
                if (existingFoodItemIndex !== -1) {
                    cartItems[existingFoodItemIndex] = {
                        food,
                        unit,
                    };
                }
                else {
                    // If food does not exist in the cart, add it.
                    cartItems.push({
                        food,
                        unit,
                    });
                }
                user.cart = cartItems;
                const cartResult = yield user.save();
                return response.status(200).json({
                    success: true,
                    message: "Item added to cart successfully",
                    data: cartResult.cart,
                });
            }
            else {
                return response.status(400).json({
                    success: false,
                    message: "Unauthorized user",
                });
            }
        }
        else {
            return response.status(404).json({
                success: false,
                message: "Food not found",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.addToCart = addToCart;
const getCart = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = request.user;
        const user = yield User_1.default.findById(userId).populate("cart.food");
        if (user) {
            return response.status(200).json({
                success: true,
                message: "Cart fetched successfully",
                data: user.cart,
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
exports.getCart = getCart;
const deleteCart = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = request.user;
        const user = yield User_1.default.findById(userId);
        if (user) {
            if (user.cart.length) {
                user.cart = [];
                yield user.save();
                return response.status(200).json({
                    success: true,
                    message: "Cart cleared successfully",
                });
            }
            else {
                return response.status(400).json({
                    success: false,
                    message: "Cart is already empty",
                });
            }
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
exports.deleteCart = deleteCart;
//# sourceMappingURL=UserController.js.map