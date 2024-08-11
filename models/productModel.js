const pool = require("../config/database");

function createInsertQuery(data, tableName) {
  const fields = Object.keys(data);
  const values = Object.values(data);
  const placeholders = fields.map((_, index) => `$${index + 1}`);

  const query = `
    INSERT INTO ${tableName} (${fields.join(", ")})
    VALUES (${placeholders.join(", ")})
    RETURNING *;
  `;

  return { query, values };
}

function createUpdateQuery(data, tableName, id) {
  const fields = Object.keys(data);
  const values = Object.values(data);
  const setClause = fields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(", ");

  const query = `
    UPDATE ${tableName}
    SET ${setClause}, updated_at = NOW()
    WHERE id = $${fields.length + 1}
    RETURNING *;
  `;

  return { query, values: [...values, id] };
}

async function addProduct(data) {
  const { query, values } = createInsertQuery(data, "myschema.products");

  try {
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch (err) {
    console.error("Error inserting product:", err);
    return null;
  }
}

async function getAllProducts() {
  const query = "SELECT * FROM myschema.products";

  try {
    const res = await pool.query(query);
    return res.rows.length > 0 ? res.rows : [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getProductById(id) {
  const query = `
    SELECT * FROM myschema.products
    WHERE id = $1 AND deleted_at IS NULL
  `;

  try {
    const res = await pool.query(query, [id]);
    return res.rows.length > 0 ? res.rows[0] : null;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
}

async function updateProduct(id, data) {
  const { query, values } = createUpdateQuery(data, "myschema.products", id);

  try {
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch (err) {
    console.error(`Error updating product with id ${id}:`, err);
    return null;
  }
}

async function deleteAllProducts() {
  const query = "UPDATE myschema.products SET deleted_at = NOW() RETURNING *;";

  try {
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    console.error("Error deleting all divisions:", error);
    return [];
  }
}

async function deleteProduct(id) {
  const query = `
    UPDATE myschema.products
    SET deleted_at = NOW()
    WHERE id = $1
    RETURNING *;
  `;

  try {
    const res = await pool.query(query, [id]);
    return res.rows[0];
  } catch (err) {
    console.error(`Error deleting product with id ${id}:`, err);
    return null;
  }
}

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteAllProducts,
  deleteProduct,
};
