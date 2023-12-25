"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    console.error(error);
    if (error.name === 'ValidationError') {
        const errors = {};
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
exports.errorHandler = errorHandler;
