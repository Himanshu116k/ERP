import dotenv from "dotenv";
dotenv.config();
import {app} from './app.js'
import connectDB from "./db/db.js";
import { DB_NAME } from './constant.js';
import { v2 as cloudinary } from "cloudinary";


connectDB()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`📡Server started at PORT 🔐 ${process.env.PORT}`);
        cloudinary.config({
          
         cloud_name: process.env.CLOUDNARY_CLOUD_NAME, 
          api_key: process.env.CLOUDNARY_CLOUD_API_KEY, 
          api_secret: process.env.CLOUDNARY_CLOUD_API_SECRECT   
        });
    
    app.on("error",(error)=>{
        console.log("ERROR:",error); 
        throw error;
    })
    })
})
.catch((err)=>{
    console.log("Failed to connect to the database",err);
    process.exit(1);
})
