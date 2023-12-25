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
exports.getVendorsById = exports.getVendors = exports.createVendor = void 0;
const Vendor_1 = __importDefault(require("../models/Vendor"));
const PasswordUtility_1 = require("../utility/PasswordUtility");
const createVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, address, pincode, foodType, email, password, ownerName, phone, } = req.body;
        const isVendorExists = yield Vendor_1.default.findOne({ email });
        if (isVendorExists) {
            return res.status(409).json({
                success: false,
                message: "Vendor already exists with that email id",
            });
        }
        const salt = yield (0, PasswordUtility_1.GenerateSalt)();
        const hashedPassword = yield (0, PasswordUtility_1.GeneratePassword)(password, salt);
        const createVendorData = {
            name,
            address,
            pincode,
            foodType,
            email,
            password: hashedPassword,
            ownerName,
            phone,
            rating: 0,
            serviceAvailable: false,
            salt,
            coverImages: [],
        };
        const createdVendor = yield Vendor_1.default.create(createVendorData);
        res.status(201).json({
            success: true,
            data: createdVendor,
        });
    }
    catch (error) {
        // Pass the error to the next middleware
        next(error);
    }
});
exports.createVendor = createVendor;
const getVendors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendors = yield Vendor_1.default.find();
        if (vendors !== null) {
            return res.json({
                success: true,
                data: vendors,
            });
        }
        else {
            return res.status(404).json({
                success: false,
                message: "Vendors data not available",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getVendors = getVendors;
const getVendorsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const vendor = yield Vendor_1.default.findById(id);
        if (vendor) {
            return res.json({
                success: true,
                data: vendor,
            });
        }
        else {
            return res.status(404).json({
                success: false,
                message: "No vendor exists with that id",
            });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getVendorsById = getVendorsById;
