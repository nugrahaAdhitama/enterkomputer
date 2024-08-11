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

async function addOrderItems(data) {
  const { query, values } = createInsertQuery(data, "myschema.order_items");

  try {
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch (err) {
    console.error("Error inserting order:", err);
    return null;
  }
}

async function getAllOrderItems() {
  const query = "SELECT * FROM myschema.order_items WHERE deleted_at IS NULL";

  try {
    const res = await pool.query(query);
    return res.rows.length > 0 ? res.rows : [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

async function getOrderItem(id) {
  const query = `
    SELECT * FROM myschema.order_items
    WHERE id = $1 AND deleted_at IS NULL
  `;

  try {
    const res = await pool.query(query, [id]);
    return res.rows.length > 0 ? res.rows[0] : null;
  } catch (error) {
    console.error(`Error fetching order with id ${id}:`, error);
    return null;
  }
}

async function updateOrderItem(id, data) {
  const { query, values } = createUpdateQuery(data, "myschema.order_items", id);

  try {
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch (err) {
    console.error(`Error updating order with id ${id}:`, err);
    return null;
  }
}

async function deleteAllOrderItems() {
  const query =
    "UPDATE myschema.order_items SET deleted_at = NOW() RETURNING *;";

  try {
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    console.error("Error deleting all orders:", error);
    return [];
  }
}

async function deleteOrderItem(id) {
  const query = `
    UPDATE myschema.order_items
    SET deleted_at = NOW()
    WHERE id = $1
    RETURNING *;
  `;

  try {
    const res = await pool.query(query, [id]);
    return res.rows[0];
  } catch (err) {
    console.error(`Error deleting order with id ${id}:`, err);
    return null;
  }
}

module.exports = {
  addOrderItems,
  getAllOrderItems,
  getOrderItem,
  updateOrderItem,
  deleteAllOrderItems,
  deleteOrderItem,
};
