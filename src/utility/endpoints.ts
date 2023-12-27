export const ENDPOINTS = {
  //* Admin
  VENDOR: "/create-vendor",
  VENDORS: "/vendors",
  VENDOR_BY_ID: "/vendor/:id",

  //* Vendor
  LOGIN: "/login",
  VENDOR_PROFILE: "/profile",
  CHANGE_PASSWORD: "/change-password",
  UPDATE_SERVICES: "/update-service",
  UPDATE_VENDOR_PROFILE: "/update-profile",
  FOOD: "/food",
  FOOD_BY_ID: "/food/:id",
  FOODS: "/foods",

  // * Shopping
  FOOD_IN_AREA: "/:pincode",
  TOP_RESTAURANTS: "/top-restaurants/:pincode",
  FOOD_IN_30_MINUTE: "/food-in-30-min/:pincode",
  SEARCH_FOOD: "/search/:pincode",
  RESTAURANT_BY_ID: "/restaurant/:id",
};
export const BASE_ROUTE = {
  VENDOR: "/api/vendor",
  ADMIN: "/api/admin",
  SHOPPING: "/api/shopping",
};
