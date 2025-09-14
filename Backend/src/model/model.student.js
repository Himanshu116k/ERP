import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
    },
    roll:{
        type:String, // change to Number if numeric
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone:{
        type:String,
        required:true,
        unique:true,
        match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    fatherName:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
    },
    motherName:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
    },
    address:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
    },
    bloodGroup:{
        type:String,
        lowercase:true,
        trim:true,  
    },
    disability:{   // corrected spelling
        type:Boolean,
        required:true,
    },
    gender:{
        type:String,
        enum:['male','female','other'],
        required:true,
        lowercase:true,
        trim:true,
    },
    dob:{
        type:Date,
        required:true,
        validate:{
            validator: function(value){
                return value < new Date();
            },
            message:"DOB cannot be in the future"
        }
    },
    religion:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
    },
    nationality:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
    },
    avatar:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8oghbsuzggpkknQSSU-Ch_xep_9v3m6EeBQ&s"
    },
    tenthMarks:{
        type:Number
    },
    twelfthMarks:{
        type:Number
    },
    isSuspended:{
        type:Boolean,
        default:false
    },
    
},{timestamps:true})








export const Students = mongoose.model('Students', studentSchema);
