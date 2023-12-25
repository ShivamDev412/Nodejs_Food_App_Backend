"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = require("./routes");
const Database_1 = __importDefault(require("./services/Database"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.DEV_PORT || 4002;
(0, Database_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/admin", routes_1.AdminRoute);
app.use("/vendor", routes_1.VendorRoute);
app.listen(PORT, () => {
    console.clear();
    console.log(`listening on port:${PORT}`);
});
