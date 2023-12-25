"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
const express_1 = __importDefault(require("express"));
const VendorController_1 = require("../controllers/VendorController");
const endpoints_1 = require("../utility/endpoints");
const errorHandeler_1 = require("../middlewares/errorHandeler");
const commonAuth_1 = require("../middlewares/commonAuth");
const router = (0, express_1.default)();
exports.VendorRoute = router;
router.use(errorHandeler_1.errorHandler);
router.post(endpoints_1.ENDPOINTS.LOGIN, VendorController_1.Login);
router.use(commonAuth_1.authUser);
router.get(endpoints_1.ENDPOINTS.VENDOR_PROFILE, VendorController_1.getVendorProfile);
router.put(endpoints_1.ENDPOINTS.VENDOR_PROFILE, VendorController_1.updateVendorProfile);
router.put(endpoints_1.ENDPOINTS.UPDATE_SERVICES, VendorController_1.updateVendorServices);
