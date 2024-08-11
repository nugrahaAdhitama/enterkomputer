const orders = require("./migrations/orders");
const products = require("./migrations/products");
const orderItems = require("./migrations/order_items");

console.log("DB NAME: ", process.env.DB_NAME);
(async () => {
  await products.dropTable();
  await orders.dropTable();
  await orderItems.dropTable();
  await products.createTable();
  await orders.createTable();
  await orderItems.createTable();
})();

console.log("Migration completed");
