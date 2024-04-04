// require('dotenv').config({path:'./env'});

import dotenv from "dotenv"
import connectDB from "./db/index.js"

dotenv.config({
    path:'./env'
})




//connecting DB => M1
/*
;(async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    }
    catch(err){
        console.error(err);
        throw err;        
    }
})()

*/
// ; if used for cleaning purpose, if ; is not in the lines before the IIFE

connectDB()