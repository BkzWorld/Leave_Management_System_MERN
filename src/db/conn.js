const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost:27017/${process.env.DATABASE_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connection Successfully established")
}).catch((e)=>{
    console.log("Connection Failure")
})
