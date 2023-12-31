import express from "express";
import { ENDPOINTS } from "../utility/endpoints";
import {
  addToCart,
  createOrder,
  editUserProfile,
  getCart,
  getOrderById,
  getOrders,
  login,
  deleteCart,
  resendOtp,
  signup,
  userProfile,
  verifyAccount,
} from "../controllers/UserController";
import { errorHandler } from "../middlewares/errorHandeler";
import { authUser } from "../middlewares/commonAuth";
const router = express.Router();

router.post(ENDPOINTS.SIGNUP, signup);
router.post(ENDPOINTS.LOGIN, login);
router.use(authUser);
router.put(ENDPOINTS.VERIFY_ACCOUNT_LOGIN, verifyAccount);
router.post(ENDPOINTS.RESEND_OTP, resendOtp);
router.get(ENDPOINTS.USER_PROFILE, userProfile);
router.put(ENDPOINTS.USER_PROFILE, editUserProfile);
router.post(ENDPOINTS.CREATE_ORDER, createOrder);
router.get(ENDPOINTS.ORDER_BY_ID, getOrderById);
router.get(ENDPOINTS.ORDERS, getOrders);
router.get(ENDPOINTS.CART, getCart);
router.post(ENDPOINTS.CART, addToCart);
router.delete(ENDPOINTS.CART, deleteCart);
router.use(errorHandler);
export { router as UserRoute };
