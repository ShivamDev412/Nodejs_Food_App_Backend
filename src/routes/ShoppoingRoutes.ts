import express from "express";
import { ENDPOINTS } from "../utility/endpoints";
import {
  findFoodInArea,
  topRestaurants,
  foodIn30Min,
  searchFood,
  getRestaurantById,
} from "../controllers/ShoppingController";
import { errorHandler } from "../middlewares/errorHandeler";
/**
 * @swagger
 * tags:
 *   name: Shopping
 *   description: User Shopping Management
 */
const router = express.Router();
router.use(errorHandler);
router.get(ENDPOINTS.FOOD_IN_AREA, findFoodInArea);
router.get(ENDPOINTS.TOP_RESTAURANTS, topRestaurants);
router.get(ENDPOINTS.FOOD_IN_30_MINUTE, foodIn30Min);
router.get(ENDPOINTS.SEARCH_FOOD, searchFood);
router.get(ENDPOINTS.RESTAURANT_BY_ID, getRestaurantById);

export { router as ShoppingRoute };
