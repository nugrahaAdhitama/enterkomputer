const pool = require("../config/database");

exports.createTable = async () => {
  await pool.query(`
  CREATE SCHEMA IF NOT EXISTS myschema;
    CREATE TABLE IF NOT EXISTS myschema.products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        variant VARCHAR(50),
        price DECIMAL(10, 2) NOT NULL,
        station VARCHAR(1) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
    )`);
};

exports.dropTable = async () => {
  await pool.query("DROP TABLE IF EXISTS myschema.products");
};
