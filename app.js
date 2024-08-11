const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const routes = require("./routes");
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

dotenv.config();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(fileUpload());

app.use("/api/v1", routes);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Enterkomputer API",
      version: "1.0.0",
      description: "Enterkomputer API",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const spacs = swaggerjsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spacs));

module.exports = app;
