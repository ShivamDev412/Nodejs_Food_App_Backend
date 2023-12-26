"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_ROUTE = exports.ENDPOINTS = void 0;
exports.ENDPOINTS = {
    //* Admin
    VENDOR: "/create-vendor",
    VENDORS: "/vendors",
    VENDOR_BY_ID: "/vendor/:id",
    //* Vendor
    LOGIN: "/login",
    VENDOR_PROFILE: "/profile",
    UPDATE_SERVICES: "/update-service",
    UPDATE_VENDOR_PROFILE: "/update-profile",
    FOOD: "/food",
    FOOD_BY_ID: "/food/:id",
    FOODS: "/foods"
};
exports.BASE_ROUTE = {
    VENDOR: "/api/vendor",
    ADMIN: "/api/admin",
    SHOPPING: "/api/shopping"
};
