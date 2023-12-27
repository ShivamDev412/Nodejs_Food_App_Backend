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
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const AdminRoutes_1 = require("../routes/AdminRoutes");
const VendorRoutes_1 = require("../routes/VendorRoutes");
const ShoppoingRoutes_1 = require("../routes/ShoppoingRoutes");
const endpoints_1 = require("../utility/endpoints");
exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(endpoints_1.BASE_ROUTE.ADMIN, AdminRoutes_1.AdminRoute);
    app.use(endpoints_1.BASE_ROUTE.VENDOR, VendorRoutes_1.VendorRoute);
    app.use(endpoints_1.BASE_ROUTE.SHOPPING, ShoppoingRoutes_1.ShoppingRoute);
    return app;
});
