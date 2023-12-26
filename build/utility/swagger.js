"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    apis: ["./routes/*.ts"],
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Food Delivery API",
            version: "1.0.0",
            description: "Food Delivery backend Api using express",
        },
        servers: [
            {
                url: "https://food-app-y9ra.onrender.com/api",
            },
            {
                url: "http://localhost:4002/api"
            }
        ],
    },
};
// 
exports.default = (0, swagger_jsdoc_1.default)(options);
