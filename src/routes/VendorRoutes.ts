import express from "express";
import {
  Login,
  getVendorProfile,
  updateVendorProfile,
  updateVendorServices,
} from "../controllers/VendorController";
import { ENDPOINTS } from "../utility/endpoints";
import { errorHandler } from "../middlewares/errorHandeler";
import { authUser } from "../middlewares/commonAuth";
const router = express();
router.use(errorHandler);
router.post(ENDPOINTS.LOGIN, Login);
router.use(authUser);
router.get(ENDPOINTS.VENDOR_PROFILE, getVendorProfile);
router.put(ENDPOINTS.VENDOR_PROFILE, updateVendorProfile);
router.put(ENDPOINTS.UPDATE_SERVICES, updateVendorServices);

export { router as VendorRoute };
