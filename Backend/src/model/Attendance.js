import mongoose from "mongoose";

const statusSub = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Students", required: true },
  status: { type: String, enum: ["present","absent","late","excused"], required: true },
  markedAt: { type: Date, default: Date.now },
  note: String
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "TeacherAccounts", required: true }, // who marked it
  date: { type: Date, required: true },
startTime: { type: String, required: true },
endTime: { type: String, required: true },
  sessionType: { type: String, enum: ["theory","practical","tutorial"], default: "theory" },
  statuses: [statusSub],
  summary: {
    total: { type: Number, default: 0 },
    present: { type: Number, default: 0 },
    absent: { type: Number, default: 0 }
  },
  corrections: [{ type: mongoose.Schema.Types.ObjectId, ref: "AttendanceCorrection" }],
  academicYear: String
},{ timestamps:true });

attendanceSchema.index({ batch:1, subject:1, date:1 }, { unique: true }); // one session per batch+subject+date

export const Attendance = mongoose.model("Attendance", attendanceSchema);
