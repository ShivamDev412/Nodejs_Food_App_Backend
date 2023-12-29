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
exports.getRestaurantById = exports.searchFood = exports.foodIn30Min = exports.topRestaurants = exports.findFoodInArea = void 0;
const Vendor_1 = __importDefault(require("../models/Vendor"));
const findFoodInArea = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = request.params.pincode;
    const page = parseInt(request.query.page) || 1;
    const pageSize = parseInt(request.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;
    try {
        const foods = yield Vendor_1.default.find({
            pincode,
            serviceAvailable: true,
        })
            .sort({ rating: -1 })
            .populate("foods")
            .skip(skip)
            .limit(pageSize);
        if (foods.length > 0) {
            return response.status(200).json({
                success: true,
                message: "Foods found successfully",
                data: foods,
            });
        }
        else {
            return response.status(400).json({
                success: false,
                message: "Foods not found",
            });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.findFoodInArea = findFoodInArea;
const topRestaurants = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = request.params.pincode;
    const page = parseInt(request.query.page) || 1;
    const pageSize = parseInt(request.query.pageSize) || 10;
    try {
        const skip = (page - 1) * pageSize;
        const restaurants = yield Vendor_1.default.find({
            pincode,
            serviceAvailable: true,
        })
            .sort({ rating: -1 })
            .skip(skip)
            .limit(pageSize);
        if (restaurants.length > 0) {
            return response.status(200).json({
                success: true,
                message: "Restaurants found successfully",
                data: restaurants,
            });
        }
        else {
            return response.status(404).json({
                success: false,
                message: "Restaurants not found",
            });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.topRestaurants = topRestaurants;
const foodIn30Min = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = request.params.pincode;
    const page = parseInt(request.query.page) || 1;
    const pageSize = parseInt(request.query.pageSize) || 10;
    try {
        const skip = (page - 1) * pageSize;
        const restaurants = yield Vendor_1.default.find({
            pincode,
            serviceAvailable: true,
        })
            .populate("foods")
            .skip(skip)
            .limit(pageSize);
        if (restaurants.length > 0) {
            const foodResults = restaurants.flatMap((restaurant) => restaurant.foods
                .filter((food) => food.readyTime <= 30)
                .map((food) => (Object.assign({ restaurant: restaurant.name }, food.toObject()))));
            return response.status(200).json({
                success: true,
                message: "Foods found successfully",
                data: foodResults,
            });
        }
        else {
            return response.status(404).json({
                success: false,
                message: "Foods not found",
            });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.foodIn30Min = foodIn30Min;
const searchFood = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = request.params.pincode;
    try {
        const restaurants = yield Vendor_1.default.find({
            pincode,
            serviceAvailable: true,
        }).populate("foods");
        if (restaurants.length > 0) {
            const foodResults = restaurants.flatMap((restaurant) => restaurant.foods.map((food) => (Object.assign({ restaurant: restaurant.name }, food.toObject()))));
            return response.status(200).json({
                success: true,
                message: "Foods found successfully",
                data: foodResults,
            });
        }
        else {
            return response.status(404).json({
                success: false,
                message: "Foods not found",
            });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.searchFood = searchFood;
const getRestaurantById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = request.params.id;
    try {
        const restaurant = yield Vendor_1.default.findById(id).populate("foods");
        if (restaurant) {
            return response.status(200).json({
                success: true,
                message: "Restaurant found successfully",
                data: restaurant,
            });
        }
        else {
            return response.status(404).json({
                success: false,
                message: "Restaurant not found",
            });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.getRestaurantById = getRestaurantById;
//# sourceMappingURL=ShoppingController.js.map