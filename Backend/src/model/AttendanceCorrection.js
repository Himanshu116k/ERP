import mongoose from "mongoose";
const corrSchema = new mongoose.Schema({
  attendance: { type: mongoose.Schema.Types.ObjectId, ref: "Attendance", required: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "TeacherAccounts", required: true },
  changedAt: { type: Date, default: Date.now },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Students", required: true },
  from: String,
  to: String,
  note: String
}, { timestamps:true });

export const AttendanceCorrection = mongoose.model("AttendanceCorrection", corrSchema);
