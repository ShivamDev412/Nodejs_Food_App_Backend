"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRoute = void 0;
const express_1 = __importDefault(require("express"));
const endpoints_1 = require("../utility/endpoints");
const ShoppingController_1 = require("../controllers/ShoppingController");
const errorHandeler_1 = require("../middlewares/errorHandeler");
/**
 * @swagger
 * tags:
 *   name: Shopping
 *   description: User Shopping Management
 */
const router = express_1.default.Router();
exports.ShoppingRoute = router;
router.use(errorHandeler_1.errorHandler);
router.get(endpoints_1.ENDPOINTS.FOOD_IN_AREA, ShoppingController_1.findFoodInArea);
router.get(endpoints_1.ENDPOINTS.TOP_RESTAURANTS, ShoppingController_1.topRestaurants);
router.get(endpoints_1.ENDPOINTS.FOOD_IN_30_MINUTE, ShoppingController_1.foodIn30Min);
router.get(endpoints_1.ENDPOINTS.SEARCH_FOOD, ShoppingController_1.searchFood);
router.get(endpoints_1.ENDPOINTS.RESTAURANT_BY_ID, ShoppingController_1.getRestaurantById);
