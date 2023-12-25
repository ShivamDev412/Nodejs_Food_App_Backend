import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto/Vendor.dto";
import VendorModel from "../models/Vendor";
import { GenerateSalt, GeneratePassword } from "../utility/PasswordUtility";
export const createVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      name,
      address,
      pincode,
      foodType,
      email,
      password,
      ownerName,
      phone,
    } = req.body as CreateVendorInput;

    const isVendorExists = await VendorModel.findOne({ email });

    if (isVendorExists) {
      return res.status(409).json({
        success: false,
        message: "Vendor already exists with that email id",
      });
    }

    const salt = await GenerateSalt();
    const hashedPassword = await GeneratePassword(password, salt);

    const createVendorData = {
      name,
      address,
      pincode,
      foodType,
      email,
      password: hashedPassword,
      ownerName,
      phone,
      rating: 0,
      serviceAvailable: false,
      salt,
      coverImages: [],
    };

    const createdVendor = await VendorModel.create(createVendorData);

    res.status(201).json({
      success: true,
      data: createdVendor,
    });
  } catch (error) {
    // Pass the error to the next middleware
    next(error);
  }
};
export const getVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vendors = await VendorModel.find();

    if (vendors !== null) {
      return res.json({
        success: true,
        data: vendors,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Vendors data not available",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getVendorsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const vendor = await VendorModel.findById(id);

    if (vendor) {
      return res.json({
        success: true,
        data: vendor,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No vendor exists with that id",
      });
    }
  } catch (error) {
    next(error);
  }
};
