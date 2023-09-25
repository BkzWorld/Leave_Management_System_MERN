require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const marked = require("marked");
const slugify = require("slugify");
const ejs = require("ejs");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const auth = require("./middleware/auth");

require("./db/conn");
const Register = require("./models/registers");
// const DateModel = require("./models/DateModel");
const port = process.env.PORT || 5000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(static_path));
app.set("view engine", "ejs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

// console.log(process.env.SECRET_KEY)

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/LeaveStatus", auth, (req, res) => {
  // console.log(`Cookie: ${req.cookies.jwt}`)
  res.render("LeaveStatus");
});

app.get("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((curr) => {
      return curr.token !== req.token;
    });

    //req.user.tokens = [];
    res.clearCookie("jwt");
    console.log("logout successful");
    await req.user.save();
    res.render("index");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/LeaveStatus_HR", async (req, res) => {
  res.render("LeaveStatus_HR");
});

app.get("/LeaveStatus_VC", (req, res) => {
  res.render("LeaveStatus_VC");
});

app.get("/LeaveStatus_DR", (req, res) => {
  res.render("LeaveStatus_DR");
});


app.get("/Leave_Application", async (req, res) => {
  try {
    const savedDates = await Register.findOne();
    res.render("Leave_Application", { savedDates }); // 'savedDates' is the name of your EJS template
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching saved dates.");
  }
});


app.get("/admin_view", async (req, res) => {
  try {
      const allRequests = await Register.find({ 'leaveRequest.status': 'pending' });
      res.render("admin_view", { allRequests });
  } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching leave requests.");
  }
});

app.get("/status", async (req, res) => {
  try {
      // const email = /* Get the email of the logged-in user */;
      const user = await Register.findOne();
      res.render("status", { status: user.leaveRequest.status });
  } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching status.");
  }
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
      });
      console.log("The success part " + registerEmployee);

      const token = await registerEmployee.generateAuthToken();
      console.log("The token part " + token);

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 600000),
        httpOnly: true,
      });

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

    if (!user_email) {
      return res.send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user_email.password);

    if (!isMatch) {
      return res.send("Invalid Credentials");
    }

    const token = await user_email.generateAuthToken();
    console.log("The token part " + token);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 50000),
      httpOnly: true,
      // secure: true
    });

    console.log(`Cookie: ${req.cookies.jwt}`);

    if (user_type === "ADMIN") {
      if (
        user_email.admin_type === "HR" &&
        admin_type !== "VC" &&
        admin_type !== "DR"
      ) {
        res.status(201).render("LeaveStatus_HR", { user_email: user_email });
      } else if (
        user_email.admin_type === "VC" &&
        admin_type !== "DR" &&
        admin_type !== "HR"
      ) {
        res.status(201).render("LeaveStatus_VC", { user_email: user_email });
      } else if (
        user_email.admin_type === "DR" &&
        admin_type !== "HR" &&
        admin_type !== "VC"
      ) {
        res.status(201).render("LeaveStatus_DR", { user_email: user_email });
      } else {
        res.status(500).render("index");
      }
    } else if (user_type === "EMPLOYEE") {
      if (
        user_email.employee_type === "FACULTY" &&
        employee_type !== "NON_FACULTY"
      ) {
        res.status(201).render("LeaveStatus", { user_email: user_email });
      } else if (
        user_email.employee_type === "NON_FACULTY" &&
        employee_type !== "FACULTY"
      ) {
        res.status(201).render("LeaveStatus_NF", { user_email: user_email });
      } else {
        res.status(201).render("index");
      }
    } else {
      res.send("Invalid Credentials");
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Invalid Credentials");
  }
});

app.get("/user-list", auth, async (req, res) => {
  try {
    // Retrieve all users with user_type = "ADMIN"
    const admins = await Register.find({ user_type: "ADMIN" });

    // Retrieve all users with user_type = "EMPLOYEE"
    const employees = await Register.find({ user_type: "EMPLOYEE" });
    req.user.tokens = req.user.tokens.filter((curr) => {
      return curr.token !== req.token;
    });

    //req.user.tokens = [];
    res.clearCookie("jwt");
    await req.user.save();

    res.render("employeeList", { admins, employees });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route to display the leave allocation form
app.get("/allocate-leaves", async (req, res) => {
  try {
    const userId = req.query.userId;
    const user = await Register.findById(userId);
    res.render("allocate-leaves", { user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/allocate-leaves", async (req, res) => {
  try {
    const userId = req.body.userId;
    const updatedLeaves = {
      casualLeave: req.body.casualLeave,
      medicalLeave: req.body.medicalLeave,
      compOffLeave: req.body.compOffLeave,
      dutyLeave: req.body.dutyLeave,
      academicLeave: req.body.academicLeave,
      specialLeave: req.body.specialLeave,
      // Add similar lines for other leave types
    };

    // Update the user's leave balances in the MongoDB database
    await Register.findByIdAndUpdate(userId, {
      $set: { leaveBalances: updatedLeaves },
    });

    res.status(200).json({ message: "Leave Allocated" });
    // alert("Leave Allocated");
    // const successMessage = "Leave Allocated";
    // Redirect back to the employee list page
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/leaveBalances/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await Register.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("leaveBalances", { user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/Leave_Application", async (req, res) => {
  try {
    const email = req.body.email;
    const user_email = await Register.findOne({ email: email });

    if (!user_email) {
      return res.status(400).send("Invalid Email");
    }


    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    if (endDate < startDate) {
      res.status(400).send("End Date cannot be before Start Date.");
      return;
    }

    const leaveType = req.body.leaveType;
    const leaveBalanceField = `leaveBalances.${leaveType.toLowerCase()}Leave`; // Construct the field name dynamically

    // Calculate the duration in days
    const differenceInMilliseconds = endDate - startDate;
    const differenceInDays = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24)
    );

    const currentDate = await Register.findOne({email:email});

    if (!currentDate) {
      console.log("No documents found in the database.");
      return;
    }

    const currentLeaveBalance =
      currentDate.leaveBalances[leaveType.toLowerCase() + "Leave"];
    if (currentLeaveBalance < differenceInDays) {
      res.status(400).send(`Not enough ${leaveType} Leave balance.`);
      return;
    }

    // const newLeaveBalance = currentLeaveBalance - differenceInDays;
    await Register.updateOne(
      {email:email},
      {
        $set: {
          // [leaveBalanceField]: newLeaveBalance,
          startDate: startDate,
          endDate: endDate,
          durationInDays: differenceInDays,
          leaveType: leaveType,
          'leaveRequest.status': 'pending'
        },
      }
    );

    // await newDuration.save();
    console.log(differenceInDays);
    const savedDates = [await Register.findOne({email:email})];

    res.render("Leave_Application", { savedDates, leaveType, email }); // Redirect to a success page or the form page
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving the duration.");
  }
});


app.post("/update_status", async (req, res) => {
  try {
      const { email , status } = req.body;
      const leaveRequest = await Register.findOne({email:email});

      if (status === "approved") {
          const leaveType = leaveRequest.leaveType;
          const leaveBalanceField = typeof leaveType === 'string' ? `leaveBalances.${leaveType.toLowerCase()}Leave` : '';
          const differenceInDays = leaveRequest.durationInDays;
          //const currentLeaveBalance = leaveRequest.leaveBalances[leaveType.toLowerCase() + "Leave"];
          const currentLeaveBalance = leaveRequest.leaveBalances?.[leaveType?.toLowerCase() + "Leave"] ?? 0;
          const newLeaveBalance = currentLeaveBalance - differenceInDays;

          await Register.updateOne(
              { email:email },
              {
                  $set: {
                      'leaveRequest.status': status,
                      [leaveBalanceField]: newLeaveBalance
                  },
              }
          );
      } else {
          await Register.updateOne(
              { email:email },
              {
                  $set: {
                      'leaveRequest.status': status,
                      
                  },
              }
          );
      }
      res.status(200).send("Status updated successfully.");
      res.render("update_status", { status: status });
  } catch (error) {
      console.error(error);
      res.status(500).send("Error updating status.");
  }
});


app.listen(port, () => {
  console.log(`server is running at ${port}`);
});
