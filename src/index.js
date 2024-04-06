// require('dotenv').config({path:'./env'});

import dotenv from "dotenv"
import connectDB from "./db/index.js"
import { app } from "./app.js"

dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`listening on port ${process.env.PORT}`);
    })
    app.on('error',(err)=>{
        console.log("error in app: ", err);
        throw err;
    })
})
.catch((err)=>{
    console.log("DB connection err: ",err);
    
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
