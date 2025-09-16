import mongoose from "mongoose";
const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Students", required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
  enrollmentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["active","left","suspended"], default: "active" }
},{ timestamps:true });

enrollmentSchema.index({ batch:1, student:1 }, { unique: true });

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
