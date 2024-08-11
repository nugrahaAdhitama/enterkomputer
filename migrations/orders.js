const pool = require("../config/database");

exports.createTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS myschema.orders (
        id SERIAL PRIMARY KEY,
        table_number INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    )`);
};

exports.dropTable = async () => {
  await pool.query("DROP TABLE IF EXISTS myschema.orders");
};
