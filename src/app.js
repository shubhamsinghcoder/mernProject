require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
require("./db/conn");
const Register = require("./modles/registers");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");

const port = process.env.PORT || 8000;

const static_path = path.join(path.join(__dirname, "../public")); // for static
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path)); // for the static
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "hbs"); // for the dynamic
app.set("views", template_path);
hbs.registerPartials(partial_path);


app.get("/", (req, res) => {
  res.render("index"); // for the dynamic
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    if (password === cpassword) {
      const registerEmployee = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
        confirmpassword: req.body.confirmpassword,
        age: req.body.age,
      });

      // Generating the token using jsonwebtoken
      const token = await registerEmployee.generateAuthToken();

      const registered = await registerEmployee.save();
      res.status(201).render("index");
    } else {
      res.send("Password are not Match");
    }
  } catch (e) {
    res.send(e);
  }
});

//login
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const userPassrord = req.body.password;
    const emailData = await Register.findOne({ email: userEmail });

    const isMatch = await bcrypt.compare(userPassrord, emailData.password);

    const token = await emailData.generateAuthToken();
    console.log(token);
    if (isMatch) {
      res.render("index");
    } else {
      res.send("Invalid login details");
    }
  } catch (e) {
    res.send("Invalid login details");
  }
});

app.listen(port, () => {
  console.log(`Listening in port ${port}`);
});
