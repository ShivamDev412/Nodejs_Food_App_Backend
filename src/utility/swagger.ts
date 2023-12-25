import swaggerJsDoc from "swagger-jsdoc";
const options = {
  apis: ["./src/routes/*.ts"],
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Food Delivery API",
      version: "1.0.0",
      description: "Food Delivery backend Api using express",
    },
    servers: [
      {
        url: "https://food-app-y9ra.onrender.com",
      },
      {
        url:"http://localhost:4002"
      }
    ],
  },
};
// 
export default swaggerJsDoc(options);
