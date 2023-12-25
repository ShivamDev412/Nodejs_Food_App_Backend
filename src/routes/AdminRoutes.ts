import express from "express";
import { ENDPOINTS } from "../utility/endpoints";
import {
  createVendor,
  getVendors,
  getVendorsById,
} from "../controllers/AdminController";
import { errorHandler } from "../middlewares/errorHandeler";
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
   *     CreateVendorInput:
   *       type: object
   *       properties:
   *         name:
   *           type: string
   *         address:
   *           type: string
   *         pincode:
   *           type: string
   *         foodType:
   *           type: string
   *         email:
   *           type: string
   *         password:
   *           type: string
   *         ownerName:
   *           type: string
   *         phone:
   *           type: string
   *       example:
   *         name: "Sample Vendor"
   *         address: "123 Main St"
   *         pincode: "12345"
   *         foodType: "Fast Food"
   *         email: "sample@example.com"
   *         password: "password123"
   *         ownerName: "John Doe"
   *         phone: "123-456-7890"
   */
  /**
   * @swagger
   * /vendor/create:
   *   post:
   *     summary: Create a new vendor
   *     tags: [Vendor]
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/CreateVendorInput"
   *     responses:
   *       201:
   *         description: Vendor created successfully
   *         content:
   *           application/json:
   *             example:
   *               success: true
   *               data: { /* Replace with actual vendor data * / }
   *       409:
   *         description: Vendor already exists with that email id
   *         content:
   *           application/json:
   *             example:
   *               success: false
   *               message: Vendor already exists with that email id
   */
  /**
   * @swagger
   * /vendor/getVendors:
   *   get:
   *     summary: Get all vendors
   *     tags: [Vendor]
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             example:
   *               success: true
   *               data: [{ /* Replace with actual array of vendors * / }]
   *       404:
   *         description: Vendors data not available
   *         content:
   *           application/json:
   *             example:
   *               success: false
   *               message: Vendors data not available
   */
  /**
   * @swagger
   * /vendor/getVendorsById/{id}:
   *   get:
   *     summary: Get vendor by ID
   *     tags: [Vendor]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: Vendor ID
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             example:
   *               success: true
   *               data: { /* Replace with actual vendor data by ID * / }
   *       404:
   *         description: No vendor exists with that ID
   *         content:
   *           application/json:
   *             example:
   *               success: false
   *               message: No vendor exists with that ID
   */

const router = express();

router.post(ENDPOINTS.VENDOR, createVendor);
router.get(ENDPOINTS.VENDORS, getVendors);
router.get(ENDPOINTS.VENDOR_BY_ID, getVendorsById);
router.use(errorHandler);

export { router as AdminRoute };
