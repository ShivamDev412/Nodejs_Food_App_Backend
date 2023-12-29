"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
const express_1 = __importDefault(require("express"));
const endpoints_1 = require("../utility/endpoints");
const UserController_1 = require("../controllers/UserController");
const errorHandeler_1 = require("../middlewares/errorHandeler");
const commonAuth_1 = require("../middlewares/commonAuth");
const router = express_1.default.Router();
exports.UserRoute = router;
router.use(errorHandeler_1.errorHandler);
router.post(endpoints_1.ENDPOINTS.SIGNUP, UserController_1.signup);
router.post(endpoints_1.ENDPOINTS.LOGIN, UserController_1.login);
router.use(commonAuth_1.authUser);
router.put(endpoints_1.ENDPOINTS.VERIFY_ACCOUNT_LOGIN, UserController_1.verifyAccount);
router.post(endpoints_1.ENDPOINTS.RESEND_OTP, UserController_1.resendOtp);
router.get(endpoints_1.ENDPOINTS.USER_PROFILE, UserController_1.userProfile);
router.put(endpoints_1.ENDPOINTS.USER_PROFILE, UserController_1.editUserProfile);
//# sourceMappingURL=UserRoutes.js.map