import express from "express";
import {
  Login,
  getVendorProfile,
  updateVendorProfile,
  updateVendorServices,
  addFood,
  getFoods,
  updateVendorProfilePic,
  editFood,
  changeVendorPassword,
} from "../controllers/VendorController";
import { ENDPOINTS } from "../utility/endpoints";
import { errorHandler } from "../middlewares/errorHandeler";
import { authUser } from "../middlewares/commonAuth";
/**
 * @swagger
 * tags:
 *   name: Vendor
 *   description: Vendor management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     VendorLoginInput:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *       example:
 *         email: "vendor@example.com"
 *         password: "password123"
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in as a vendor
 *     tags: [Vendor]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/VendorLoginInput"
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Logged in successfully"
 *               data: { /* vendor data here * / }
 *       400:
 *         description: Password did not match
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Password did not match"
 *       404:
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Vendor with that email does not exist"
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get vendor profile
 *     tags: [Vendor]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: { /* vendor data here * / }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *       404:
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Vendor not found"
 */

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update vendor profile
 *     tags: [Vendor]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/EditVendorInput"
 *     responses:
 *       200:
 *         description: Vendor profile updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Vendor profile updated successfully"
 *               data: { /* updated vendor data here * / }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *       404:
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Vendor not found"
 */

/**
 * @swagger
 * /services:
 *   put:
 *     summary: Update vendor services availability
 *     tags: [Vendor]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceAvailable:
 *                 type: boolean
 *             example:
 *               serviceAvailable: true
 *     responses:
 *       200:
 *         description: Vendor services updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "You are online"
 *               data: { /* updated vendor data here * / }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *       404:
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Vendor not found"
 */

/**
 * @swagger
 * /add-food:
 *   post:
 *     summary: Add a new food item
 *     tags: [Vendor]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateFoodInputs"
 *     responses:
 *       200:
 *         description: Food added successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Food added successfully"
 *               data: { /* new food data here * / }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *       404:
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Vendor not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal server error"
 */

/**
 * @swagger
 * /foods:
 *   get:
 *     summary: Get all food items for the vendor
 *     tags: [Vendor]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data: [{ /* food data here * / }]
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *       404:
 *         description: Food not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Food not found"
 */

/**
 * @swagger
 * /profile-pic:
 *   put:
 *     summary: Update vendor profile picture
 *     tags: [Vendor]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coverImages:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               coverImages: ["url1", "url2"]
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Profile picture updated successfully"
 *               data: { /* updated vendor data here * / }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *       404:
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Vendor not found"
 */

/**
 * @swagger
 * /edit-food/{id}:
 *   put:
 *     summary: Update food item by ID
 *     tags: [Vendor]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Food ID
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateFoodInputs"
 *     responses:
 *       200:
 *         description: Food updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Food updated successfully"
 *               data: { /* updated food data here * / }
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *       404:
 *         description: Food not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Food not found"
 */


const router = express();
router.use(errorHandler);
router.post(ENDPOINTS.LOGIN, Login);
router.use(authUser);
router.get(ENDPOINTS.VENDOR_PROFILE, getVendorProfile);
router.put(ENDPOINTS.VENDOR_PROFILE, updateVendorProfile);
router.put(ENDPOINTS.CHANGE_PASSWORD, changeVendorPassword);
router.put(ENDPOINTS.UPDATE_SERVICES, updateVendorServices);
router.put(ENDPOINTS.UPDATE_VENDOR_PROFILE, updateVendorProfilePic);
router.post(ENDPOINTS.FOOD, addFood);
router.get(ENDPOINTS.FOODS, getFoods);
router.put(ENDPOINTS.FOOD_BY_ID, editFood);

export { router as VendorRoute };
