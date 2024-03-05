const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});
// Generating token
employeeSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    res.send(`the error part is ${error}`);
  }
};

// Securing the password using the bcryptjs
// we are convet our password into bcrypt hash password before the save method after convet password will be store in our database which are present in the app.js file
employeeSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    // this.confirmpassword = undefined;
    this.confirmpassword = await bcrypt.hash(this.password, 10);
  }

  next();
});

const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;
