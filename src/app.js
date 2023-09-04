require ('dotenv').config()
const express = require("express");
const path = require("path");
const app = express();
const marked = require("marked");
const slugify = require("slugify");

const ejs = require("ejs");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
require("./db/conn");
const Register = require("./models/registers");

const port = process.env.PORT || 5000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "ejs");
app.set("views", template_path);
hbs.registerPartials(partial_path);


// console.log(process.env.SECRET_KEY)

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/LeaveStatus", (req, res) => {
  res.render("LeaveStatus");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/LeaveStatus_HR", (req, res) => {
  res.render("LeaveStatus_HR");
});

app.get("/LeaveStatus_VC", (req, res) => {
  res.render("LeaveStatus_VC");
});

app.get("/LeaveStatus_DR", (req, res) => {
  res.render("LeaveStatus_DR");
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmPassword;
    console.log(req.body);
    if (password === cpassword) {
      const registerEmployee = new Register({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        biometric_id: req.body.biometric_id,
        institute: req.body.institute,
        user_type: req.body.user_type,
        admin_type: req.body.admin_type,
        employee_type: req.body.employee_type,
        branch: req.body.branch,
        phone: req.body.phone,
        designation: req.body.designation,
        password: password,
        confirmPassword: cpassword,
        // leavesAssigned:{
        // casualLeave:req.body.casualLeave,
        // medicalLeave:req.body.medicalLeave,
        // compOffLeave:req.body.compOffLeave,
        // dutyLeave:req.body.dutyLeave,
        // academicLeave:req.body.academicLeave,
        // specialLeave:req.body.specialLeave,
        // },
      });
      console.log("The success part " + registerEmployee);

      const token = await registerEmployee.generateAuthToken();
      console.log("The token part " + token);

      const registered = await registerEmployee.save();
      console.log("The page part: " + registered);

      res.status(201).render("index");
    } else {
      res.send("Passwords do not match", e);
      console.log(e);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/index", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user_type = req.body.user_type;
    const admin_type = req.body.admin_type;
    const employee_type = req.body.employee_type;

    const user_email = await Register.findOne({ email: email });

    const isMatch = await bcrypt.compare(password, user_email.password);

    const token = await user_email.generateAuthToken();
    console.log("The token part " + token);

    if (!user_email) {
      return res.send("User not found");
    }
    if ( 
      isMatch &&
      user_email.user_type === user_type &&
      user_email.admin_type === admin_type
    ) {
      if (user_type === "ADMIN") {
        if (admin_type === "HR" && admin_type !== "VC" && admin_type !== "DR") {
          res.status(201).render("LeaveStatus_HR", { user_email: user_email });
        } else if (
          admin_type === "VC" &&
          admin_type !== "DR" &&
          admin_type !== "HR"
        ) {
          res.status(201).render("LeaveStatus_VC", { user_email: user_email });
        } else if (
          admin_type === "DR" &&
          admin_type !== "HR" &&
          admin_type !== "VC"
        ) {
          res.status(201).render("LeaveStatus_DR", { user_email: user_email });
        } else {
          res.status(201).render("index");
        }
      }
    } else if (
      isMatch &&
      user_email.user_type === user_type &&
      user_email.employee_type === employee_type
    ) {
      if (user_type === "EMPLOYEE") {
        if (employee_type === "FACULTY" && employee_type !== "NON_FACULTY") {
          res.status(201).render("LeaveStatus", { user_email: user_email });
        } else if (
          employee_type === "NON_FACULTY" &&
          employee_type !== "FACULTY"
        ) {
          res.status(201).render("LeaveStatus_NF", { user_email: user_email });
        } else {
          res.status(201).render("index");
        }
      } else {
        res.status(201).render("index");
      }
    } else {
      res.send("Invalid Credentials");
    }

    // res.send(user_email.password);
    // console.log(user_email);
    // console.log(`${email} and password is ${password}`)
  } catch (error) {
    console.log(error);
    res.status(400).send("Invalid Credentials");
  }
});

app.listen(port, () => {
  console.log(`server is running at ${port}`);
});
