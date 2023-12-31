import express, { Application } from "express";
import cookieParser from "cookie-parser";
import { AdminRoute } from "../routes/AdminRoutes";
import { VendorRoute } from "../routes/VendorRoutes";
import { ShoppingRoute } from "../routes/ShoppoingRoutes";
import { UserRoute } from "../routes/UserRoutes";

import { BASE_ROUTE } from "../utility/endpoints";
export default async (app: Application) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));

  app.use(BASE_ROUTE.ADMIN, AdminRoute);
  app.use(BASE_ROUTE.VENDOR, VendorRoute);
  app.use(BASE_ROUTE.SHOPPING, ShoppingRoute);
  app.use(BASE_ROUTE.USER, UserRoute);
  return app;
};
