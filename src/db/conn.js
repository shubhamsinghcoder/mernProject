const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/registration-form")
  .then(() => {
    console.log("Connection successfull...");
  })
  .catch((error) => {
    console.log(error);
  });
