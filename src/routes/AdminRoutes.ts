import express from "express";
import { ENDPOINTS } from "../utility/endpoints";
import {
  createVendor,
  getVendors,
  getVendorsById,
} from "../controllers/AdminController";
import { errorHandler } from "../middlewares/errorHandeler";
const router = express();

router.post(ENDPOINTS.VENDOR, createVendor);
router.get(ENDPOINTS.VENDORS, getVendors);
router.get(ENDPOINTS.VENDOR_BY_ID, getVendorsById);
router.use(errorHandler);
export { router as AdminRoute };
