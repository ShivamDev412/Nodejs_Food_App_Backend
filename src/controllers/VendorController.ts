import { Request, Response, NextFunction } from "express";
import { EditVendorInput, VendorLoginInput } from "../dto/Vendor.dto";
import VendorModel from "../models/Vendor";
import {
  ValidatePassword,
  generateSignature,
} from "../utility/PasswordUtility";
export const Login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as VendorLoginInput;
  const isVendorExist = await VendorModel.findOne({ email });
  if (isVendorExist !== null) {
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
      return res.json({
        success: true,
        message: "Logged in successfully",
        data: isVendorExist,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Password did not match" });
    }
  } else {
    return res.json({
      success: false,
      message: "Vendor with that email does not exist",
    });
  }
};
export const getVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user) {
    const existingVendor = await VendorModel.findById(user._id);
    if (existingVendor) {
      return res.json({
        success: true,
        data: existingVendor,
      });
    }
  }
  return res.json({
    success: false,
    message: "Vendor not found",
  });
};
export const updateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, address, foodType, phone } = req.body as EditVendorInput;
  const user = req.user;
  if (user) {
    const updatedVendor = await VendorModel.findByIdAndUpdate(
      user._id,
      {
        name,
        address,
        foodType,
        phone,
      },
      { new: true }
    );
    if (updatedVendor) {
      return res.json({
        success: true,
        message: "Vendor profile updated successfully",
        data: updatedVendor,
      });
    }
  }
  return res.json({
    success: false,
    message: "Vendor not found",
  });
};
export const updateVendorServices = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { serviceAvailable } = req.body as { serviceAvailable: boolean };
  const user = req.user;
  if (user) {
    const updatedVendor = await VendorModel.findByIdAndUpdate(
      user._id,
      {
        serviceAvailable,
      },
      { new: true }
    );
    if (updatedVendor) {
      return res.json({
        success: true,
        message: updatedVendor.serviceAvailable
          ? "You are online"
          : "You are offline",
        data: updatedVendor,
      });
    }
  }
  return res.json({
    success: false,
    message: "Vendor not found",
  });
};
