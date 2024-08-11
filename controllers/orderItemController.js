const {
  addOrderItems,
  getAllOrderItems,
  getOrderItem,
  updateOrderItem,
  deleteOrderItem,
} = require("../services/orderItemService");

const logger = require("../utils/logger");
const { sendResponse } = require("../utils/response");

exports.addOrderItems = async (req, res) => {
  try {
    const result = await addOrderItems(req.body);
    logger.info("Add Success: Success Add Order Item");
    return sendResponse(res, 201, "Success Add Order Item", result);
  } catch (error) {
    logger.error("Add Error: Failed Add Order Item");
    return sendResponse(res, 500, error.message);
  }
};

exports.getAllOrderItems = async (req, res, next) => {
  try {
    if (req.query.id) {
      return next();
    }

    const orders = await getAllOrderItems();
    logger.info("Successfully Get All Order Items");
    return sendResponse(res, 200, "Successfully Get All Order Items", orders);
  } catch (error) {
    logger.error("Error Get All Order");
    return sendResponse(res, 500, "Failed to Get All Order Items");
  }
};

exports.getOrderItem = async (req, res) => {
  try {
    const { id } = req.query;
    const orderItem = await getOrderItem(id);

    if (!orderItem) {
      logger.error(`Order with id ${id} not found`);
      return sendResponse(res, 404, "Order not found");
    }

    logger.info(`Successfully Get Order with id ${id}`);
    return sendResponse(res, 200, "Successfully Get Order", orderItem);
  } catch (error) {
    logger.error("Failed to Get Order");
    return sendResponse(res, 500, error.message);
  }
};

exports.updateOrderItemById = async (req, res) => {
  try {
    const { id } = req.query;
    const orderItem = await getOrderItem(id);

    if (!orderItem) {
      logger.error(`Order with id ${id} not found`);
      return sendResponse(res, 404, "Order not found");
    }

    const updatedOrder = await updateOrderItem(id, req.body);

    logger.info(`Successfully Update Order with id ${id}`);
    return sendResponse(res, 200, "Sucessfully Update Order", updatedOrder);
  } catch (error) {
    logger.error("Failed to Update Order");
    return sendResponse(res, 500, error.message);
  }
};

exports.deleteOrderItemById = async (req, res) => {
  try {
    const { id } = req.query;
    const orderItem = await getOrderItem(id);

    if (!orderItem) {
      logger.error(`Order with id ${id} not found`);
      return sendResponse(res, 404, "Order not found");
    }

    await deleteOrderItem(id);
    logger.info(`Successfully Delete Order with id ${id}`);
    return sendResponse(res, 200, "Successfully Delete Order");
  } catch (error) {
    logger.error("Failed to Delete Order");
    return sendResponse(res, 500, error.message);
  }
};
