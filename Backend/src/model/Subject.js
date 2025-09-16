import mongoose from "mongoose";
const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  year: Number,
  credits: Number
},{ timestamps:true });

export const Subject = mongoose.model("Subject", subjectSchema);
