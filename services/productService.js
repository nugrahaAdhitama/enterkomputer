const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../models/productModel");

exports.addProduct = async (data) => {
  return await addProduct(data);
};

exports.getAllProducts = async () => {
  try {
    return await getAllProducts();
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
};

exports.getProductById = async (id) => getProductById(id);

exports.updateProduct = async (id, data) => updateProduct(id, data);

exports.deleteProduct = async (id) => deleteProduct(id);
