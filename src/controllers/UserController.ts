import { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import {
  CreateCustomerInput,
  EditCustomerInput,
  LoginCustomerInput,
  OrderInputs,
  ResendOtpInput,
} from "../dto/User.dto";
import { validate } from "class-validator";
import UserModel from "../models/User";
import {
  GeneratePassword,
  GenerateSalt,
  generateSignature,
  ValidatePassword,
} from "../utility/PasswordUtility";
import { generateOtp, onRequestOtp } from "../utility/NotificationUtility";
import VendorModel from "../models/Vendor";
import FoodModel from "../models/Food";
import OrderModel from "../models/Order";
import mongoose from "mongoose";

export const signup = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const customer = plainToClass(CreateCustomerInput, request.body);
    const inputErrors = await validate(customer, {
      validationError: { target: false, value: false },
    });

    if (inputErrors.length > 0) {
      throw inputErrors;
    }

    const { email, password, phone, firstName, lastName } = customer;
    const userExist = await UserModel.findOne({ email });
    const vendorExist = await VendorModel.findOne({ email });
    if (userExist || vendorExist) {
      return response.status(409).json({
        success: false,
        message: "User already exist with that email",
      });
    }
    const salt = await GenerateSalt();
    const hashedPassword = await GeneratePassword(password, salt);
    const { otp, expiry } = generateOtp();

    const user = await UserModel.create({
      email,
      password: hashedPassword,
      phone,
      salt,
      otp,
      otp_expiry: expiry,
      firstName,
      lastName,
      address: "",
      verified: false,
      lat: 0,
      lng: 0,
      orders: [],
    });

    if (user) {
      await onRequestOtp(otp, phone);
      const signature = await generateSignature({
        _id: user._id,
        email: user.email,
        verified: user.verified,
      });
      const oneMonthInMillis = 30 * 24 * 60 * 60 * 1000;

      response.cookie("auth-token", signature, {
        maxAge: oneMonthInMillis,
        httpOnly: true,
      });

      return response.status(201).json({
        success: true,
        data: user,
        message: "User created successfully",
      });
    } else {
      throw new Error("Failed to create user");
    }
  } catch (error) {
    next(error);
  }
};
export const resendOtp = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { email, phone } = request.body as ResendOtpInput;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      const { otp, expiry } = generateOtp();
      user.otp = otp;
      user.otp_expiry = expiry;
      await user.save();
      await onRequestOtp(otp, phone);
      return response.status(200).json({
        success: true,
        message: "OTP resent successfully",
      });
    }
    return response.status(400).json({
      success: false,
      message: "User not found",
    });
  } catch (error) {
    next(error);
  }
};
export const login = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const customer = plainToClass(LoginCustomerInput, request.body);
    const inputErrors = await validate(customer, {
      validationError: { target: false, value: false },
    });

    if (inputErrors.length > 0) {
      throw inputErrors;
    }

    const { email, password } = customer;
    const user = await UserModel.findOne({ email: email });
    if (user) {
      const validation = await ValidatePassword(
        password,
        user.password,
        user.salt
      );
      if (validation) {
        const signature = await generateSignature({
          _id: user._id,
          email: user.email,
          verified: user.verified,
        });
        const oneMonthInMillisecond = 30 * 24 * 60 * 60 * 1000;

        response.cookie("auth-token", signature, {
          maxAge: oneMonthInMillisecond,
          httpOnly: true,
        });
        return response.status(200).json({
          success: true,
          message: "User logged in successfully",
          data: user,
        });
      }
    }
    return response.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  } catch (error) {
    next(error);
  }
};
export const verifyAccount = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { otp } = request.body;
    const useId = request.user;
    const user = await UserModel.findById(useId);
    if (user) {
      const isValid = user.otp === +otp && user.otp_expiry >= new Date();

      if (isValid) {
        user.verified = true;
        await user.save();
        const signature = await generateSignature({
          _id: user._id,
          email: user.email,
          verified: user.verified,
        });
        const oneMonthInMillis = 30 * 24 * 60 * 60 * 1000;

        response.cookie("auth-token", signature, {
          maxAge: oneMonthInMillis,
          httpOnly: true,
        });
        return response.status(200).json({
          success: true,
          message: "Account verified successfully",
        });
      }
      return response.status(400).json({
        success: false,
        message: "Invalid OTP or OTP expired",
      });
    } else {
      return response.status(400).json({
        success: false,
        message: "Unauthorized user",
      });
    }
  } catch (error) {
    next(error);
  }
};
export const userProfile = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const user = request.user;
    return response.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
export const editUserProfile = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, address } = request.body as EditCustomerInput;
    const useId = request.user;
    const user = await UserModel.findById(useId);
    if (user) {
      user.firstName = firstName;
      user.lastName = lastName;
      user.address = address;
      await user.save();
      return response.status(200).json({
        success: true,
        message: "User profile updated successfully",
        data: user,
      });
    } else {
      return response.status(400).json({
        success: false,
        message: "Unauthorized user",
      });
    }
  } catch (error) {
    next(error);
  }
};
export const createOrder = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request.user;
    const cart = request.body as OrderInputs[];
    const user = await UserModel.findById(userId);

    if (user) {
      const orderId = new mongoose.Types.ObjectId();

      const foodIdsInCart = cart.map((item) => item._id);
      const foods = await FoodModel.find({
        _id: { $in: foodIdsInCart },
      }).exec();

      let cartItems = foods.map((food) => ({
        ...food.toObject(),
        food: food._id,
        unit: cart.find((item) => item._id === food._id.toString())?.unit || 0,
      }));

      const netAmount = cartItems.reduce(
        (total, item) => total + item.price * item.unit,
        0
      );

      if (cartItems.length > 0) {
        const currentOrder = await OrderModel.create({
          orderId,
          items: cartItems,
          totalAmount: netAmount,
          paidThrough: "COD",
          paymentResponse: "",
          orderStatus: "pending",
          orderDate: new Date(),
        });

        if (currentOrder) {
          user.orders.push(currentOrder);
          await user.save();

          return response.status(200).json({
            success: true,
            message: "Order created successfully",
            data: currentOrder,
          });
        }
      }
    }
  } catch (error) {
    next(error);
  }
};
export const getOrders = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request.user;
    const user = await UserModel.findById(userId).populate("orders");
    if (user) {
      return response.status(200).json({
        success: true,
        message: "Orders fetched successfully",
        data: user.orders,
      });
    } else {
      return response.status(400).json({
        success: false,
        message: "Unauthorized user",
      });
    }
  } catch (error) {
    next(error);
  }
};
export const getOrderById = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const orderId = request.params.id;
    const order = await OrderModel.findById(orderId).populate("items.food");
    return response.status(200).json({
      success: true,
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
export const addToCart = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request.user;
    const { _id, unit } = request.body as OrderInputs;

    if (unit <= 0) {
      return response.status(400).json({
        success: false,
        message: "Unit should be greater than 0",
      });
    }

    let cartItems = [];
    const food = await FoodModel.findById(_id);

    if (food) {
      const user = await UserModel.findById(userId).populate("cart.food");

      if (user) {
        cartItems = user.cart || [];

        // Check if food already exists in the cart for the user. If it does, update the unit.
        const existingFoodItemIndex = cartItems.findIndex(
          (item) => item.food?._id.toString() === _id
        );

        if (existingFoodItemIndex !== -1) {
          cartItems[existingFoodItemIndex] = {
            food,
            unit,
          };
        } else {
          // If food does not exist in the cart, add it.
          cartItems.push({
            food,
            unit,
          });
        }

        user.cart = cartItems;
        const cartResult = await user.save();

        return response.status(200).json({
          success: true,
          message: "Item added to cart successfully",
          data: cartResult.cart,
        });
      } else {
        return response.status(400).json({
          success: false,
          message: "Unauthorized user",
        });
      }
    } else {
      return response.status(404).json({
        success: false,
        message: "Food not found",
      });
    }
  } catch (error) {
    next(error);
  }
};
export const getCart = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request.user;
    const user = await UserModel.findById(userId).populate("cart.food");
    if (user) {
      return response.status(200).json({
        success: true,
        message: "Cart fetched successfully",
        data: user.cart,
      });
    } else {
      return response.status(400).json({
        success: false,
        message: "Unauthorized user",
      });
    }
  } catch (error) {
    next(error);
  }
};
export const deleteCart = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const userId = request.user;
    const user = await UserModel.findById(userId);
    if (user) {
      if (user.cart.length) {
        user.cart = [] as any;
        await user.save();
        return response.status(200).json({
          success: true,
          message: "Cart cleared successfully",
        });
      } else {
        return response.status(400).json({
          success: false,
          message: "Cart is already empty",
        });
      }
    } else {
      return response.status(400).json({
        success: false,
        message: "Unauthorized user",
      });
    }
  } catch (error) {
    next(error);
  }
};
