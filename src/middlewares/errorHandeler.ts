import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error); 
  if (error.name === 'ValidationError') {
    const errors: Record<string, string> = {};
    for (const field in error.errors) {
      errors[field] = error.errors[field].message;
    }
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors,
    });
  }
  if (error.name === 'MongoError' && error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate key error',
    });
  }
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
