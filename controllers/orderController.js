const {
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  addOrderWithItems,
  getOrderWithItemsById,
} = require("../services/orderService");

const logger = require("../utils/logger");
const { sendResponse } = require("../utils/response");

exports.addOrder = async (req, res) => {
  const { table_number, items } = req.body;

  try {
    const orderData = { table_number };
    const result = await addOrderWithItems(orderData, items);

    if (result) {
      return sendResponse(res, 201, "Success Add Order with Items", result);
    } else {
      return res.status(500).json({ error: "Failed to add order with items." });
    }
  } catch (error) {
    console.error("Add Error: Failed Add Order", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    if (req.query.id) {
      return next();
    }

    const orders = await getAllOrders();
    logger.info("Successfully Get All Order");
    return sendResponse(res, 200, "Successfully Get All Order", orders);
  } catch (error) {
    logger.error("Error Get All Order");
    return sendResponse(res, 500, "Failed to Get All Order");
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await getOrderWithItemsById(orderId);

    if (!order) {
      logger.error(`Order with id ${orderId} not found`);
      return sendResponse(res, 404, "Order not found");
    }

    logger.info(`Successfully Get Order with id ${orderId}`);
    return sendResponse(res, 200, "Successfully Get Order", order);
  } catch (error) {
    logger.error("Failed to Get Order");
    return sendResponse(res, 500, error.message);
  }
};

exports.updateOrderById = async (req, res) => {
  try {
    const { id } = req.query;
    const order = await getOrderById(id);

    if (!order) {
      logger.error(`Order with id ${id} not found`);
      return sendResponse(res, 404, "Order not found");
    }

    const updatedOrder = await updateOrder(id, req.body);

    logger.info(`Successfully Update Order with id ${id}`);
    return sendResponse(res, 200, "Sucessfully Update Order", updatedOrder);
  } catch (error) {
    logger.error("Failed to Update Order");
    return sendResponse(res, 500, error.message);
  }
};

exports.deleteOrderById = async (req, res) => {
  try {
    const { id } = req.query;
    const order = await getOrderById(id);

    if (!order) {
      logger.error(`Order with id ${id} not found`);
      return sendResponse(res, 404, "Order not found");
    }

    await deleteOrder(id);
    logger.info(`Successfully Delete Order with id ${id}`);
    return sendResponse(res, 200, "Successfully Delete Order");
  } catch (error) {
    logger.error("Failed to Delete Order");
    return sendResponse(res, 500, error.message);
  }
};
