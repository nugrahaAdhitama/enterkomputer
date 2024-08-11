const {
  addOrderItems,
  getAllOrderItems,
  getOrderItem,
  updateOrderItem,
  deleteOrderItem,
} = require("../models/orderItems");

exports.addOrderItems = async (data) => {
  return await addOrderItems(data);
};

exports.getAllOrderItems = async () => {
  try {
    return await getAllOrderItems();
  } catch (error) {
    console.error("Error fetching all order items:", error);
    throw error;
  }
};

exports.getOrderItem = async (id) => getOrderItem(id);

exports.updateOrderItem = async (id, data) => updateOrderItem(id, data);

exports.deleteOrderItem = async (id) => deleteOrderItem(id);
