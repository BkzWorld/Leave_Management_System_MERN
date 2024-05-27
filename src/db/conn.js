const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DATABASE_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connection Successfully established")

//     const count = await Register.countDocuments();

//   if (count === 0) {
//     // If no documents exist, insert some initial data
//     const initialData = new Register({
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
//         await initialData.save();
//         console.log("Initial data inserted successfully.");
//       } catch (error) {
//         console.error("Error inserting initial data:", error);
//       }

//}
}).catch((e)=>{
    console.log("Connection Failure",e)
})
