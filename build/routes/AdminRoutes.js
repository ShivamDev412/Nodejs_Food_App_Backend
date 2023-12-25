"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const express_1 = __importDefault(require("express"));
const endpoints_1 = require("../utility/endpoints");
const AdminController_1 = require("../controllers/AdminController");
const errorHandeler_1 = require("../middlewares/errorHandeler");
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
const router = (0, express_1.default)();
exports.AdminRoute = router;
router.post(endpoints_1.ENDPOINTS.VENDOR, AdminController_1.createVendor);
router.get(endpoints_1.ENDPOINTS.VENDORS, AdminController_1.getVendors);
router.get(endpoints_1.ENDPOINTS.VENDOR_BY_ID, AdminController_1.getVendorsById);
router.use(errorHandeler_1.errorHandler);
