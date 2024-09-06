require('dotenv').config();
const mongoose = require('mongoose');

async function dbconnect(){
    try{
       await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.PASSWORD}@cluster0.glp8s.mongodb.net/userInfo`);
    }
    catch(err){
        console.log(err);
    }
}
module.exports.dbconnect=dbconnect;