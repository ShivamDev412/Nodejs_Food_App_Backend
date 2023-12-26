import express, { Application } from "express";
import cookieParser from "cookie-parser";
import { AdminRoute } from "../routes/AdminRoutes";
import { VendorRoute } from "../routes/VendorRoutes";
import { ShoppingRoute } from "../routes/ShoppoingRoutes";
import { BASE_ROUTE } from "../utility/endpoints";
export default async (app: Application) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(BASE_ROUTE.ADMIN, AdminRoute);
  app.use(BASE_ROUTE.SHOPPING, VendorRoute);
  app.use(BASE_ROUTE.SHOPPING, ShoppingRoute);
  return app;
};
