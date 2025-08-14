const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const URL = process.env.DB_URL
    const DB = await mongoose.connect(URL);


    console.log(`DataBase Connected: ${DB.connection.host}`.blue);
  } catch (err) {
    console.log(`DataBase occur error {\n${err}\n}`.red);
  }
};

module.exports = connectDB;