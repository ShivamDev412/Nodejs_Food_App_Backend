"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const Database_1 = __importDefault(require("./services/Database"));
const ExpressApp_1 = __importDefault(require("./services/ExpressApp"));
dotenv_1.default.config();
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const swaggerOptions = {
        apis: ["./routes/*.ts"],
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Food Delivery API",
                version: "1.0.0",
                description: "Food Delivery backend API using Express",
            },
            servers: [
                {
                    url: "https://food-app-y9ra.onrender.com",
                },
                {
                    url: "http://localhost:4002",
                },
            ],
        },
    };
    const specs = (0, swagger_jsdoc_1.default)(swaggerOptions);
    const app = (0, express_1.default)();
    const PORT = process.env.DEV_PORT || 4002;
    yield (0, ExpressApp_1.default)(app);
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
    (0, Database_1.default)();
    app.listen(PORT, () => {
        console.clear();
        console.log(`listening on port:${PORT}`);
    });
});
startServer();
//# sourceMappingURL=index.js.map