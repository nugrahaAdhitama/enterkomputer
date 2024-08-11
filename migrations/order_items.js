const pool = require("../config/database");

exports.createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS myschema.order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES myschema.orders(id),
        product_id INTEGER REFERENCES myschema.products(id),
        quantity INTEGER NOT NULL,
        CREATED_AT TIMESTAMP DEFAULT NOW()
    )`);
};

exports.dropTable = async () => {
  await pool.query("DROP TABLE IF EXISTS myschema.order_items");
};
