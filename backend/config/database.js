const mongoose = require("mongoose");

const dburl = process.env.DB_URL || "mongodb://127.0.0.1:27017/APIQ";
const connectDatabase = () => {
  mongoose.connect(dburl).then(() => {
    console.log("MongoDb connected to Ecommerce Database");
  });
};

module.exports = connectDatabase;
