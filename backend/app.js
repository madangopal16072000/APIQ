if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config();
}

const cookieParser = require("cookie-parser");
const express = require("express");
const errorMiddleware = require("./middleware/error");
const path = require("path");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const mongoSanitize = require("express-mongo-sanitize");
const orderRoutes = require("./routes/orderRoutes");
const cors = require("cors");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to my Instacart Api");
});
app.use("/api/v1", productRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);

// middleware for Errors
app.use(errorMiddleware);

module.exports = app;
