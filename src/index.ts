import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { AdminRoute, VendorRoute } from "./routes";
import connectDB from "./services/Database";
dotenv.config();
const app = express();
const PORT = process.env.DEV_PORT || 4002;
connectDB();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/admin", AdminRoute);
app.use("/vendor", VendorRoute);
app.listen(PORT, () => {
  console.clear();
  console.log(`listening on port:${PORT}`);
});
