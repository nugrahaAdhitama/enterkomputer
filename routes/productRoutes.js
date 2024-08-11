const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The product ID.
 *         name:
 *           type: string
 *           description: The product name.
 *         price:
 *           type: number
 *           description: The product price.
 *         category:
 *           type: string
 *           description: The product category.
 *         variant:
 *           type: string
 *           description: The product variant.
 *         station:
 *           type: string
 *           description: The product station.
 *       required:
 *         - id
 *         - name
 *         - price
 *         - category
 *         - variant
 *         - station
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve a list of products
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", productController.getAllProducts);

/**
 * @swagger
 * /products?id={id}:
 *   get:
 *     summary: Retrieve a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: A single product.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.get("/", productController.getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: The product was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.post("/", productController.addProduct);

/**
 * @swagger
 * /products?id={id}:
 *   put:
 *     summary: Update a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: The product was successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.put("/", productController.updateProductById);

/**
 * @swagger
 * /products?id={id}:
 *   delete:
 *     summary: Delete a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: The product was successfully deleted.
 */
router.delete("/", productController.deleteProductById);

module.exports = router;
