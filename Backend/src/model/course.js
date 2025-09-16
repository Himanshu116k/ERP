import mongoose from "mongoose";
const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true },

  // name: { type: String, required: true, trim: true },
  // course: { type: String, required: true, unique: true },
  // year: { type: String, required: true, unique: true },
  // section: { type: String, required: true, unique: true },
  // academicYear: { type: String, required: true, unique: true },


  description: String
},{ timestamps:true });

export const Course = mongoose.model("Course", courseSchema);
