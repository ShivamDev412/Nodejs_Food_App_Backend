import { Request, Response, NextFunction } from "express";
import { plainToClass } from "class-transformer";
import {
  CreateCustomerInput,
  EditCustomerInput,
  LoginCustomerInput,
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
