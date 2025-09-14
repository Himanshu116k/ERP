import mongoose from "mongoose";
const teacherSchema = new mongoose.Schema({
   
    name:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
    },
    mastryIn:{
       type:String,
       required:true,
       lowercase:true,
       trim:true,
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
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phoneNo:{
        type:String,
        required:true,
        unique:true,
        match: [/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"],
    },
    address:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
    },
    age:{
        type:String,
        required:true
    },
    bloodGroup:{
        type:String,
        lowercase:true,
        trim:true,  
    },
    disability:{   // corrected spelling
        type:Boolean,
        required:true,
        disability:false
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
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmLek_EMsLT1OGhqew1lkhIXammaiIBcLZJg&s"
    },
    salary:{
        type:String,
        required:true
    }



},{timestamps:true})

export const Teachers = mongoose.model('Teachers', teacherSchema);