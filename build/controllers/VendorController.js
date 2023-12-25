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
exports.editFood = exports.updateVendorProfilePic = exports.getFoods = exports.addFood = exports.updateVendorServices = exports.updateVendorProfile = exports.getVendorProfile = exports.Login = void 0;
const Vendor_1 = __importDefault(require("../models/Vendor"));
const PasswordUtility_1 = require("../utility/PasswordUtility");
const Food_1 = __importDefault(require("../models/Food"));
const Login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const isVendorExist = yield Vendor_1.default.findOne({ email });
        if (isVendorExist) {
            const validation = yield (0, PasswordUtility_1.ValidatePassword)(password, isVendorExist.password, isVendorExist.salt);
            if (validation) {
                const signature = yield (0, PasswordUtility_1.generateSignature)({ _id: isVendorExist._id });
                const oneMonthInMillis = 30 * 24 * 60 * 60 * 1000;
                res.cookie("auth-token", signature, {
                    maxAge: oneMonthInMillis,
                    httpOnly: true,
                });
                res.status(200).json({
                    success: true,
                    message: "Logged in successfully",
                    data: isVendorExist,
                });
            }
            else {
                res.status(400).json({ success: false, message: "Password did not match" });
            }
        }
        else {
            res.status(404).json({
                success: false,
                message: "Vendor with that email does not exist",
            });
        }
    }
    catch (error) {
        console.error("Error in Login:", error);
        next(error);
    }
});
exports.Login = Login;
const getVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (user) {
            const existingVendor = yield Vendor_1.default.findById(user._id);
            if (existingVendor) {
                res.status(200).json({
                    success: true,
                    data: existingVendor,
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    message: "Vendor not found",
                });
            }
        }
        else {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getVendorProfile = getVendorProfile;
const updateVendorProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, address, foodType, phone } = req.body;
        const user = req.user;
        if (user) {
            const updatedVendor = yield Vendor_1.default.findByIdAndUpdate(user._id, { name, address, foodType, phone }, { new: true });
            if (updatedVendor) {
                res.status(200).json({
                    success: true,
                    message: "Vendor profile updated successfully",
                    data: updatedVendor,
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    message: "Vendor not found",
                });
            }
        }
        else {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.updateVendorProfile = updateVendorProfile;
const updateVendorServices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serviceAvailable } = req.body;
        const user = req.user;
        if (user) {
            const updatedVendor = yield Vendor_1.default.findByIdAndUpdate(user._id, { serviceAvailable }, { new: true });
            if (updatedVendor) {
                res.status(200).json({
                    success: true,
                    message: updatedVendor.serviceAvailable
                        ? "You are online"
                        : "You are offline",
                    data: updatedVendor,
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    message: "Vendor not found",
                });
            }
        }
        else {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.updateVendorServices = updateVendorServices;
const addFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (user) {
            const { name, description, category, foodType, readyTime, price, images, } = req.body;
            const vendor = yield Vendor_1.default.findById(user._id);
            if (vendor) {
                const newFoods = yield Food_1.default.create({
                    vendorId: vendor._id,
                    name,
                    description,
                    category,
                    foodType,
                    readyTime,
                    price,
                    rating: 0,
                    // * Expects array of url of images uploaded on aws or firebase servers
                    images,
                });
                vendor.foods.push(newFoods);
                yield vendor.save();
                if (newFoods) {
                    res.status(200).json({
                        success: true,
                        message: "Food added successfully",
                        data: newFoods,
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: "Internal server error",
                    });
                }
            }
            else {
                res.status(404).json({
                    success: false,
                    message: "Vendor not found",
                });
            }
        }
        else {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.addFood = addFood;
const getFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (user) {
            const foods = yield Food_1.default.find({ vendorId: user._id });
            if (foods) {
                res.status(200).json({
                    success: true,
                    data: foods,
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    message: "Food not found",
                });
            }
        }
        else {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getFoods = getFoods;
const updateVendorProfilePic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { coverImages } = req.body;
        if (user) {
            const updatedVendor = yield Vendor_1.default.findByIdAndUpdate(user._id, 
            // * Expects array of url of image uploaded on aws or firebase servers
            { coverImages: coverImages }, { new: true });
            if (updatedVendor) {
                res.status(200).json({
                    success: true,
                    message: "Profile picture updated successfully",
                    data: updatedVendor,
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    message: "Profile picture not updated",
                });
            }
        }
        else {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.updateVendorProfilePic = updateVendorProfilePic;
const editFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { id } = req.params;
        const { name, description, category, foodType, readyTime, price, images } = req.body;
        if (user) {
            const updatedFood = yield Food_1.default.findByIdAndUpdate(id, { name, description, category, foodType, readyTime, price, images }, { new: true });
            if (updatedFood) {
                res.status(200).json({
                    success: true,
                    message: "Food updated successfully",
                    data: updatedFood,
                });
            }
            else {
                res.status(404).json({
                    success: false,
                    message: "Food not found",
                });
            }
        }
        else {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.editFood = editFood;
