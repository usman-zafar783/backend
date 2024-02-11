const mongoose = require('mongoose');
require('dotenv').config();

require('colors');
const { MONGO_URL } = process.env;


// const connectDB = (url) =>{
//    return mongoose.connect(url, { autoIndex: true })
// };

const connectDB = async () => {
   try {
     await mongoose.connect(MONGO_URL, {
       // useNewUrlParser: true,
       // useUnifiedTopology: true,
       connectTimeoutMS: 60000,
     });
     console.log("Connected to MongoDB".green.bold);
   } catch (error) {
     console.error("Error connecting to MongoDB:".red.bold, error.message);
   }
 };

module.exports = connectDB;

