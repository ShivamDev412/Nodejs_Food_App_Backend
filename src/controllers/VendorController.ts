import { Request, Response, NextFunction } from "express";
import { EditVendorInput, VendorLoginInput } from "../dto/Vendor.dto";
import VendorModel from "../models/Vendor";
import {
  ValidatePassword,
  generateSignature,
} from "../utility/PasswordUtility";
import { CreateFoodInputs } from "../dto/Food.dto";
import FoodModel from "../models/Food";

export const Login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body as VendorLoginInput;
    const isVendorExist = await VendorModel.findOne({ email });

    if (isVendorExist) {
      const validation = await ValidatePassword(
        password,
        isVendorExist.password,
        isVendorExist.salt
      );

      if (validation) {
        const signature = await generateSignature({ _id: isVendorExist._id });
        const oneMonthInMillis = 30 * 24 * 60 * 60 * 1000;

        res.cookie("auth-token", signature, {
          maxAge: oneMonthInMillis,
          httpOnly: true,
        });

        res.status(200).json({
          success: true,
          message: "Logged in successfully",
          data: isVendorExist,
        });
      } else {
        res.status(400).json({ success: false, message: "Password did not match" });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "Vendor with that email does not exist",
      });
    }
  } catch (error) {
    console.error("Error in Login:", error);
    next(error);
  }
};

export const getVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const existingVendor = await VendorModel.findById(user._id);

      if (existingVendor) {
        res.status(200).json({
          success: true,
          data: existingVendor,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, address, foodType, phone } = req.body as EditVendorInput;
    const user = req.user;

    if (user) {
      const updatedVendor = await VendorModel.findByIdAndUpdate(
        user._id,
        { name, address, foodType, phone },
        { new: true }
      );

      if (updatedVendor) {
        res.status(200).json({
          success: true,
          message: "Vendor profile updated successfully",
          data: updatedVendor,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateVendorServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { serviceAvailable } = req.body as { serviceAvailable: boolean };
    const user = req.user;

    if (user) {
      const updatedVendor = await VendorModel.findByIdAndUpdate(
        user._id,
        { serviceAvailable },
        { new: true }
      );

      if (updatedVendor) {
        res.status(200).json({
          success: true,
          message: updatedVendor.serviceAvailable
            ? "You are online"
            : "You are offline",
          data: updatedVendor,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const addFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const {
        name,
        description,
        category,
        foodType,
        readyTime,
        price,
        images,
      } = req.body as CreateFoodInputs;

      const vendor = await VendorModel.findById(user._id);

      if (vendor) {
        const newFoods = await FoodModel.create({
          vendorId: vendor._id,
          name,
          description,
          category,
          foodType,
          readyTime,
          price,
          rating: 0,
          // * Expects array of url of images uploaded on aws or firebase servers
          images,
        });
        vendor.foods.push(newFoods);
        await vendor.save();

        if (newFoods) {
          res.status(200).json({
            success: true,
            message: "Food added successfully",
            data: newFoods,
          });
        } else {
          res.status(500).json({
            success: false,
            message: "Internal server error",
          });
        }
      } else {
        res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getFoods = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (user) {
      const foods = await FoodModel.find({ vendorId: user._id });

      if (foods) {
        res.status(200).json({
          success: true,
          data: foods,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Food not found",
        });
      }
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateVendorProfilePic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { coverImages } = req.body as { coverImages: string[] };
    if (user) {
      const updatedVendor = await VendorModel.findByIdAndUpdate(
        user._id,
        // * Expects array of url of image uploaded on aws or firebase servers
        { coverImages: coverImages },
        { new: true }
      );
      if (updatedVendor) {
        res.status(200).json({
          success: true,
          message: "Profile picture updated successfully",
          data: updatedVendor,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Profile picture not updated",
        });
      }
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const editFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { name, description, category, foodType, readyTime, price, images } =
      req.body as CreateFoodInputs;
    if (user) {
      const updatedFood = await FoodModel.findByIdAndUpdate(
        id,
        { name, description, category, foodType, readyTime, price, images },
        { new: true }
      );
      if (updatedFood) {
        res.status(200).json({
          success: true,
          message: "Food updated successfully",
          data: updatedFood,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Food not found",
        });
      }
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
  } catch (error) {
    next(error);
  }
};
