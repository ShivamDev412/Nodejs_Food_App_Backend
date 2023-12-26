import express from "express";
import dotenv from "dotenv";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import connectDB from "./services/Database";
import App from "./services/ExpressApp";
dotenv.config();


const startServer = async () => {
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
  const specs = swaggerJsDoc(swaggerOptions);
  const app = express();
  const PORT = process.env.DEV_PORT || 4002;
  await App(app);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

  connectDB();
  app.listen(PORT, () => {
    console.clear();
    console.log(`listening on port:${PORT}`);
  });
};
startServer();
