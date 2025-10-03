const mongoose = require("mongoose");
require("dotenv").config();

const mongoUrl = process.env.MONGODB;

// const initializeDatabase = async () => {
//   await mongoose
//     .connect(mongoUrl)
//     .then(() => {
//       console.log("Connected to database.");
//     })
//     .catch((error) => console.log("Error in connecting to database.", error));
// };

const initializeDatabase = async () => {
  try {
    const connection = await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (connection) {
      console.log("connected succesfully");
    }
  } catch (error) {
    console.log("connection failed", error);
  }
};

module.exports = { initializeDatabase };