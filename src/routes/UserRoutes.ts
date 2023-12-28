import express from "express";
import { ENDPOINTS } from "../utility/endpoints";
import {
  editUserProfile,
  login,
  resendOtp,
  signup,
  userProfile,
  verifyAccount,
} from "../controllers/UserController";
import { errorHandler } from "../middlewares/errorHandeler";
import { authUser } from "../middlewares/commonAuth";
const router = express.Router();

router.use(errorHandler);
router.post(ENDPOINTS.SIGNUP, signup);
router.post(ENDPOINTS.LOGIN, login);
router.use(authUser);
router.put(ENDPOINTS.VERIFY_ACCOUNT_LOGIN, verifyAccount);
router.post(ENDPOINTS.RESEND_OTP, resendOtp);
router.get(ENDPOINTS.USER_PROFILE, userProfile);
router.put(ENDPOINTS.USER_PROFILE, editUserProfile);
export { router as UserRoute };
