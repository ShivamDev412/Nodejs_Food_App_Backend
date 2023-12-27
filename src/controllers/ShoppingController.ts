import { Request, Response, NextFunction } from "express";
import VendorModel from "../models/Vendor";
import { FoodDoc } from "../models/Food";
export const findFoodInArea = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const pincode = request.params.pincode;
  const page = parseInt(request.query.page as string) || 1;
  const pageSize = parseInt(request.query.pageSize as string) || 10;
  const skip = (page - 1) * pageSize;
  try {
    const foods = await VendorModel.find({
      pincode,
      serviceAvailable: true,
    })
      .sort({ rating: -1 })
      .populate("foods")
      .skip(skip)
      .limit(pageSize);
    if (foods.length > 0) {
      return response.status(200).json({
        success: true,
        message: "Foods found successfully",
        data: foods,
      });
    } else {
      return response.status(400).json({
        success: false,
        message: "Foods not found",
      });
    }
  } catch (err) {
    next(err);
  }
};
export const topRestaurants = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const pincode = request.params.pincode;
  const page = parseInt(request.query.page as string) || 1;
  const pageSize = parseInt(request.query.pageSize as string) || 10;

  try {
    const skip = (page - 1) * pageSize;

    const restaurants = await VendorModel.find({
      pincode,
      serviceAvailable: true,
    })
      .sort({ rating: -1 })
      .skip(skip)
      .limit(pageSize);

    if (restaurants.length > 0) {
      return response.status(200).json({
        success: true,
        message: "Restaurants found successfully",
        data: restaurants,
      });
    } else {
      return response.status(404).json({
        success: false,
        message: "Restaurants not found",
      });
    }
  } catch (err) {
    next(err);
  }
};

export const foodIn30Min = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const pincode = request.params.pincode;
  const page = parseInt(request.query.page as string) || 1;
  const pageSize = parseInt(request.query.pageSize as string) || 10;

  try {
    const skip = (page - 1) * pageSize;

    const restaurants = await VendorModel.find({
      pincode,
      serviceAvailable: true,
    })
      .populate("foods")
      .skip(skip)
      .limit(pageSize);

    if (restaurants.length > 0) {
      const foodResults = restaurants.flatMap((restaurant) =>
        restaurant.foods
          .filter((food: FoodDoc) => food.readyTime <= 30)
          .map((food: FoodDoc) => ({
            restaurant: restaurant.name,
            ...food.toObject(),
          }))
      );
      return response.status(200).json({
        success: true,
        message: "Foods found successfully",
        data: foodResults,
      });
    } else {
      return response.status(404).json({
        success: false,
        message: "Foods not found",
      });
    }
  } catch (err) {
    next(err);
  }
};
export const searchFood = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const pincode = request.params.pincode;

  try {
    const restaurants = await VendorModel.find({
      pincode,
      serviceAvailable: true,
    }).populate("foods");

    if (restaurants.length > 0) {
      const foodResults = restaurants.flatMap((restaurant) =>
        restaurant.foods.map((food: FoodDoc) => ({
          restaurant: restaurant.name,
          ...food.toObject(),
        }))
      );
      return response.status(200).json({
        success: true,
        message: "Foods found successfully",
        data: foodResults,
      });
    } else {
      return response.status(404).json({
        success: false,
        message: "Foods not found",
      });
    }
  } catch (err) {
    next(err);
  }
};
export const getRestaurantById = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const id = request.params.id;
  try {
    const restaurant = await VendorModel.findById(id).populate("foods");
    if (restaurant) {
      return response.status(200).json({
        success: true,
        message: "Restaurant found successfully",
        data: restaurant,
      });
    } else {
      return response.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }
  } catch (err) {
    next(err);
  }
};
