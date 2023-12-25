"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const express_1 = __importDefault(require("express"));
const endpoints_1 = require("../utility/endpoints");
const AdminController_1 = require("../controllers/AdminController");
const errorHandeler_1 = require("../middlewares/errorHandeler");
const router = (0, express_1.default)();
exports.AdminRoute = router;
router.post(endpoints_1.ENDPOINTS.VENDOR, AdminController_1.createVendor);
router.get(endpoints_1.ENDPOINTS.VENDORS, AdminController_1.getVendors);
router.get(endpoints_1.ENDPOINTS.VENDOR_BY_ID, AdminController_1.getVendorsById);
router.use(errorHandeler_1.errorHandler);
