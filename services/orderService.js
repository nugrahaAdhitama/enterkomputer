const {
  addOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  addOrderWithItems,
  getOrderWithItemsById,
} = require("../models/orderModel");

exports.addOrder = async (data) => {
  return await addOrder(data);
};

exports.addOrderWithItems = async (orderData, itemsData) => {
  return await addOrderWithItems(orderData, itemsData);
};

exports.getOrderWithItemsById = async (id) => {
  return await getOrderWithItemsById(id);
};

exports.getAllOrders = async () => {
  try {
    return await getAllOrders();
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
};

exports.getOrderById = async (id) => getOrderById(id);

exports.updateOrder = async (id, data) => updateOrder(id, data);

exports.deleteOrder = async (id) => deleteOrder(id);
