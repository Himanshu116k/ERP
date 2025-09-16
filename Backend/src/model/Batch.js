import mongoose from "mongoose";
const batchSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. BCA-BPU-3rd-A
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  year: { type: Number, required: true },
  section: { type: String },
  academicYear: { type: String, required: true },
  active: { type: Boolean, default: true }
},{ timestamps:true });

batchSchema.index({ course:1, year:1, section:1, academicYear:1 }, { unique: true });

export const Batch = mongoose.model("Batch", batchSchema);
