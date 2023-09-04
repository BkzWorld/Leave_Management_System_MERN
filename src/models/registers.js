const mongoose = require('mongoose');
const slugify = require('slugify')
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

// const leaveBalanceSchema = new mongoose.Schema({
//     leavesAssigned:{
//         casualLeave: {
//             type: Number,
//             default: 15, // Set the default value here
//         },
//         medicalLeave: {
//             type: Number,
//             default: 10,
//         },
//         compOffLeave: {
//             type: Number,
//             default: 10,
//         },
//         dutyLeave: {
//             type: Number,
//             default: 10,
//         },
//         academicLeave: {
//             type: Number,
//             default: 10,
//         },
//         specialLeave: {
//             type: Number,
//             default: 15,
//         },
//         }

// })
const employeeSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
    },
    last_name:{
        type: String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    biometric_id: {
        type: String,
        required: true,
        unique: true,
      },
    institute:{
        type:String,
        required:true,
    },
    user_type:{
        type:String,
        required:true,
    },
    admin_type:{
        type:String,
    },
    employee_type:{
        type:String,
    },
    branch:{
        type:String,
    },
    phone:{
        type: Number ,
        required:true,
        unique:true,
    },
    designation:{
        type:String,
       
    },
    password:{
        type:String,
        required:true,
    },
    confirmPassword:{
        type:String,
        required:true,
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]
    // leaveBalances: leaveBalanceSchema,

})


employeeSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: token})
        await this.save();
        return token;
    } catch (error) {
        res.send("Error part: " + error)
        console.log("Error part"+ error)
    }
}

employeeSchema.pre("save", async function(next){

    if(this.isModified("password")){
        // console.log(`the current password is ${this.password}`)
        this.password = await bcrypt.hash(this.password, 10);
        // console.log(`the current password is ${this.password}`)

        this.confirmPassword = await bcrypt.hash(this.password, 10);
    }

    next();
})

const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;





// employeeSchema.pre('validate', function(next) {
//     if (this.first_name) {
//       this.slug = slugify(this.first_name, { lower: true, strict: true })
//     }
  
//     next()
//   })