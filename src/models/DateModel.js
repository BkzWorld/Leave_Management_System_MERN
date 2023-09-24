// const mongoose = require("mongoose");
// const slugify = require("slugify");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// const dateSchema = new mongoose.Schema({
  
//   startDate: Date,
//   endDate: Date,
//   durationInDays: Number,
//   userId:String,
//   leaveBalances: {
//     casualLeave: {
//       type: Number,
//       default: 15,
//     },
//     medicalLeave: {
//       type: Number,
//       default: 10,
//     },
//     // compOffLeave: {
//     //   type: Number,
//     //   default: 10,
//     // },
//     dutyLeave: {
//       type: Number,
//       default: 10,
//     },
//     academicLeave: {
//       type: Number,
//       default: 10,
//     },
//     specialLeave: {
//       type: Number,
//       default: 15,
//     },
//   },
// });

// const db = mongoose.connection;

// db.on("error", (err) => {
//   console.error("MongoDB connection error:", err);
// });

// db.once("open", async () => {
//   console.log("Connected to MongoDB");

//   // Check if there are any documents in the collection
//   const count = await DateModel.countDocuments();

//   if (count === 0) {
//     // If no documents exist, insert some initial data
//     const initialData = new DateModel({
//       startDate: new Date("2023-09-20"),
//       endDate: new Date("2023-09-25"),
//       durationInDays: 0,
//       leaveBalances: {
//         casualLeave: 15,
//         medicalLeave: 10,
//         // compOffLeave: 10,
//         dutyLeave: 10,
//         academicLeave: 10,
//         specialLeave: 15,
//       },
//     });

//     try {
//       await initialData.save();
//       console.log("Initial data inserted successfully.");
//     } catch (error) {
//       console.error("Error inserting initial data:", error);
//     }
//   }
// });

// dateSchema.methods.generateAuthToken = async function () {
//   try {
//     const token = jwt.sign(
//       { _id: this._id.toString() },
//       process.env.SECRET_KEY
//     );
//     this.tokens = this.tokens.concat({ token: token });
//     await this.save();
//     return token;
//   } catch (error) {
//     res.send("Error part: " + error);
//     console.log("Error part" + error);
//   }
// };

// dateSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     // console.log(`the current password is ${this.password}`)
//     this.password = await bcrypt.hash(this.password, 10);
//     // console.log(`the current password is ${this.password}`)

//     this.confirmPassword = await bcrypt.hash(this.password, 10);
//   }

//   next();
// });
// const DateModel = new mongoose.model("Date", dateSchema);

// module.exports = DateModel;
