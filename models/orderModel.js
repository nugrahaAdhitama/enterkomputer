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

async function addOrderWithItems(orderData, itemsData) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { query: orderQuery, values: orderValues } = createInsertQuery(
      orderData,
      "myschema.orders"
    );
    const orderResult = await client.query(orderQuery, orderValues);
    const orderId = orderResult.rows[0].id;

    for (let item of itemsData) {
      item.order_id = orderId;
      const { query: itemQuery, values: itemValues } = createInsertQuery(
        item,
        "myschema.order_items"
      );
      await client.query(itemQuery, itemValues);
    }

    await client.query("COMMIT");

    const printerQuery = `
      SELECT DISTINCT station AS printer
      FROM myschema.products
      WHERE id = ANY($1::int[])
    `;
    const productIds = itemsData.map((item) => item.product_id);
    const printerResult = await client.query(printerQuery, [productIds]);
    const printers = printerResult.rows.map((row) => row.printer);

    return { order_id: orderId, printers };
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating order with items:", err.message, err.stack);
    return null;
  } finally {
    client.release();
  }
}

async function addOrder(data) {
  const { query, values } = createInsertQuery(data, "myschema.orders");

  try {
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch (err) {
    console.error("Error inserting order:", err);
    return null;
  }
}

async function getAllOrders() {
  const query = "SELECT * FROM myschema.orders";

  try {
    const res = await pool.query(query);
    return res.rows.length > 0 ? res.rows : [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

async function getOrderById(id) {
  const query = `
    SELECT * FROM myschema.orders
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

async function getOrderWithItemsById(id) {
  const orderQuery = `
    SELECT id AS order_id, table_number, created_at FROM myschema.orders
    WHERE id = $1 
  `;

  const itemsQuery = `
    SELECT p.name, p.variant, oi.quantity, p.price FROM myschema.order_items oi
    JOIN myschema.products p ON oi.product_id = p.id
    WHERE oi.order_id = $1
  `;

  try {
    const client = await pool.connect();
    const orderResult = await client.query(orderQuery, [id]);
    const itemsResult = await client.query(itemsQuery, [id]);
    client.release();

    if (orderResult.rows.length > 0) {
      const order = orderResult.rows[0];
      const items = itemsResult.rows;
      const total_price = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { ...order, total_price, items };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching order with id ${id}:`, error);
    return null;
  }
}

async function updateOrder(id, data) {
  const { query, values } = createUpdateQuery(data, "myschema.orders", id);

  try {
    const res = await pool.query(query, values);
    return res.rows[0];
  } catch (err) {
    console.error(`Error updating order with id ${id}:`, err);
    return null;
  }
}

async function deleteAllOrders() {
  const query = "UPDATE myschema.orders SET deleted_at = NOW() RETURNING *;";

  try {
    const res = await pool.query(query);
    return res.rows;
  } catch (error) {
    console.error("Error deleting all orders:", error);
    return [];
  }
}

async function deleteOrder(id) {
  const query = `
    UPDATE myschema.orders
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
  addOrder,
  getAllOrders,
  getOrderById,
  getOrderWithItemsById,
  updateOrder,
  deleteAllOrders,
  deleteOrder,
  addOrderWithItems,
};
