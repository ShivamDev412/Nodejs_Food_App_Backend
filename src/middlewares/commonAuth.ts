import { Request, Response, NextFunction } from "express";
import { AuthPayload } from "../dto/Vendor.dto";
import { validateSignature } from "../utility/PasswordUtility";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validate = await validateSignature(req);
  if (validate) next();
  else {
    return res
      .status(400)
      .json({ success: false, message: "User not authenticated" });
  }
};
