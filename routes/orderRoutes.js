const express = require("express");
const orderController = require("../controllers/orderController");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The order ID.
 *         table_number:
 *           type: integer
 *           description: The table number for the order.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The creation date and time of the order.
 *       required:
 *         - id
 *         - table_number
 *         - created_at
 *
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The order item ID.
 *         order_id:
 *           type: integer
 *           description: The ID of the associated order.
 *         product_id:
 *           type: integer
 *           description: The ID of the associated product.
 *         quantity:
 *           type: integer
 *           description: The quantity of the product.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The creation date and time of the order item.
 *       required:
 *         - id
 *         - order_id
 *         - product_id
 *         - quantity
 *         - created_at
 *
 *     OrderWithItems:
 *       type: object
 *       properties:
 *         order_id:
 *           type: integer
 *           description: The order ID.
 *         table_number:
 *           type: integer
 *           description: The table number for the order.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The creation date and time of the order.
 *         total_price:
 *           type: number
 *           description: The total price of the order.
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product.
 *               variant:
 *                 type: string
 *                 description: The variant of the product.
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product.
 *               price:
 *                 type: number
 *                 description: The price of the product.
 *       required:
 *         - order_id
 *         - table_number
 *         - created_at
 *         - total_price
 *         - items
 *
 *     OrderInput:
 *       type: object
 *       properties:
 *         table_number:
 *           type: integer
 *           description: The table number for the order.
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: integer
 *                 description: The ID of the product.
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product.
 *       required:
 *         - table_number
 *         - items
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retrieve a list of orders or a single order by ID
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: The order ID (optional)
 *     responses:
 *       200:
 *         description: A list of orders or a single order.
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *                 - $ref: '#/components/schemas/Order'
 */
router.get("/", orderController.getAllOrders, orderController.getOrderById);

/**
 * @swagger
 * /orders/{orderId}/bill:
 *   get:
 *     summary: Retrieve an order with items by ID
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: A single order with items.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderWithItems'
 */
router.get("/:orderId/bill", orderController.getOrderById);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Add a new order with items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       201:
 *         description: The order was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order_id:
 *                   type: integer
 *                   description: The ID of the created order.
 *                 printers:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The list of printers for the order items.
 */
router.post("/", orderController.addOrder);

/**
 * @swagger
 * /orders:
 *   put:
 *     summary: Update an order by ID
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: The order was successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 */
router.put("/", orderController.updateOrderById);

/**
 * @swagger
 * /orders:
 *   delete:
 *     summary: Delete an order by ID
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: The order was successfully deleted.
 */
router.delete("/", orderController.deleteOrderById);

module.exports = router;
