import express from "express";
import {
  Login,
  getVendorProfile,
  updateVendorProfile,
  updateVendorServices,
  addFood,
  getFoods,
  updateVendorProfilePic,
  editFood,
} from "../controllers/VendorController";
import { ENDPOINTS } from "../utility/endpoints";
import { errorHandler } from "../middlewares/errorHandeler";
import { authUser } from "../middlewares/commonAuth";
const router = express();
router.use(errorHandler);
router.post(ENDPOINTS.LOGIN, Login);
router.get(ENDPOINTS.VENDOR_PROFILE, authUser, getVendorProfile);
router.put(ENDPOINTS.VENDOR_PROFILE, authUser, updateVendorProfile);
router.put(ENDPOINTS.UPDATE_SERVICES, authUser, updateVendorServices);
router.put(ENDPOINTS.UPDATE_VENDOR_PROFILE, authUser, updateVendorProfilePic);
router.post(ENDPOINTS.FOOD, authUser, addFood);
router.get(ENDPOINTS.FOODS, authUser, getFoods);
router.put(ENDPOINTS.FOOD_BY_ID, authUser, editFood);

export { router as VendorRoute };
