const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../services/productService");

const logger = require("../utils/logger");
const { sendResponse } = require("../utils/response");

exports.addProduct = async (req, res) => {
  try {
    const result = await addProduct(req.body);
    logger.info("Add Success: Success Add Product");
    return sendResponse(res, 201, "Success Add Product", result);
  } catch (error) {
    logger.error("Add Error: Failed Add Product");
    return sendResponse(res, 500, error.message);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    if (req.query.id) {
      return next();
    }

    const products = await getAllProducts();
    logger.info("Successfully Get All Products");
    return sendResponse(res, 200, "Successfully Get All Products", products);
  } catch (error) {
    logger.error("Error Get All Products");
    return sendResponse(res, 500, "Failed to Get All Products");
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.query;
    const product = await getProductById(id);

    if (!product) {
      logger.error(`Product with id ${id} not found`);
      return sendResponse(res, 404, "Product not found");
    }

    logger.info(`Successfully Get Product with id ${id}`);
    return sendResponse(res, 200, "Successfully Get Product", product);
  } catch (error) {
    logger.error("Failed to Get Product");
    return sendResponse(res, 500, error.message);
  }
};

exports.updateProductById = async (req, res) => {
  try {
    const { id } = req.query;
    const product = await getProductById(id);

    if (!product) {
      logger.error(`Product with id ${id} not found`);
      return sendResponse(res, 404, "Product not found");
    }

    const updatedProduct = await updateProduct(id, req.body);

    logger.info(`Successfully Update Product with id ${id}`);
    return sendResponse(res, 200, "Sucessfully Update Product", updatedProduct);
  } catch (error) {
    logger.error("Failed to Update Product");
    return sendResponse(res, 500, error.message);
  }
};

exports.deleteProductById = async (req, res) => {
  try {
    const { id } = req.query;
    const product = await getProductById(id);

    if (!product) {
      logger.error(`Product with id ${id} not found`);
      return sendResponse(res, 404, "Product not found");
    }

    await deleteProduct(id);
    logger.info(`Successfully Delete Product with id ${id}`);
    return sendResponse(res, 200, "Successfully Delete Product");
  } catch (error) {
    logger.error("Failed to Delete Product");
    return sendResponse(res, 500, error.message);
  }
};
