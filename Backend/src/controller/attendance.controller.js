// controllers/attendance.controller.js
import { asynchandler } from "../utility/asynchandler.js";
import { Attendance } from "../model/attendance.js";
import { AttendanceCorrection } from "../model/attendanceCorrection.js";
import { Enrollment } from "../model/enrollment.js";
import { Students } from "../model/model.student.js";
import { ApiError } from "../utility/apiError.js";
import { ApiReponse } from "../utility/Apiresponce.js";
import mongoose from "mongoose";

function normalizeDateToUTCMidnight(d) {
  const date = new Date(d);
  date.setUTCHours(0,0,0,0);
  return date;
}

/**
 * POST /mark
 * body: { batchId, subjectId, date, statuses: [{ student, status, note? }, ...] }
 */
const markAttendance = asynchandler(async (req, res) => {
  const { batchId, subjectId, date, statuses } = req.body;
  if (!batchId || !subjectId || !date || !Array.isArray(statuses) || statuses.length === 0) {
    return res.status(400).json(new ApiError(400, "batchId, subjectId, date and statuses[] required"));
  }

  const normalizedDate = normalizeDateToUTCMidnight(date);

  // Optional: verify students belong to batch (warn or fail)
  const studentIds = statuses.map(s => s.student);
  const enrolledCount = await Enrollment.countDocuments({ batch: batchId, student: { $in: studentIds }, status: "active" });
  // If mismatch, we'll still continue but you can choose to block
  if (enrolledCount !== studentIds.length) {
    // just log and proceed — change to error if you want strictness
    console.warn("Some provided students are not enrolled in the batch");
  }

  const statusesPrepared = statuses.map(s => ({
    student: s.student,
    status: s.status,
    note: s.note || "",
    markedAt: new Date()
  }));

  // Upsert the attendance doc for batch+subject+date
  const filter = { batch: batchId, subject: subjectId, date: normalizedDate };
  const update = {
    $set: {
      batch: batchId,
      subject: subjectId,
      date: normalizedDate,
      statuses: statusesPrepared,
      teacher: req.user?.accountId || req.body.teacher || null,
      academicYear: req.body.academicYear || undefined,
      startTime: req.body.startTime || undefined,
      endTime: req.body.endTime || undefined,
      sessionType: req.body.sessionType || "theory"
    }
  };

  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  let attendance;
  try {
    attendance = await Attendance.findOneAndUpdate(filter, update, options);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json(new ApiError(409, "Attendance session already created (race)"));
    throw err;
  }

  // Compute summary
  const presentCount = statusesPrepared.filter(s => s.status === "present").length;
  attendance.summary = {
    total: statusesPrepared.length,
    present: presentCount,
    absent: statusesPrepared.filter(s => s.status === "absent").length
  };
  await attendance.save();

  // Populate a few fields for response
  const populated = await Attendance.findById(attendance._id).populate("statuses.student").populate("subject").populate("batch").lean();

  return res.status(200).json(new ApiReponse(200, populated, "Attendance marked/updated"));
});

/**
 * PUT /:attendanceId
 * body: { statuses: [{ student, status, note? } ...] }
 * records corrections for changed statuses
 */
const updateAttendance = asynchandler(async (req, res) => {
  const { attendanceId } = req.params;
  const { statuses } = req.body;
  if (!Array.isArray(statuses)) return res.status(400).json(new ApiError(400, "statuses[] required"));

  const attendance = await Attendance.findById(attendanceId);
  if (!attendance) return res.status(404).json(new ApiError(404, "Attendance not found"));

  const existingMap = new Map(attendance.statuses.map(s => [String(s.student), s.status]));
  const correctionsToSave = [];

  const prepared = statuses.map(s => {
    const sid = String(s.student);
    const oldStatus = existingMap.get(sid);
    if (oldStatus && oldStatus !== s.status) {
      correctionsToSave.push({
        attendance: attendance._id,
        changedBy: req.user?.accountId || null,
        student: s.student,
        from: oldStatus,
        to: s.status,
        note: s.note || ""
      });
    }
    return {
      student: s.student,
      status: s.status,
      note: s.note || "",
      markedAt: new Date()
    };
  });

  // Save corrections and get their ids
  const correctionDocs = [];
  if (correctionsToSave.length > 0) {
    for (const c of correctionsToSave) {
      const doc = await AttendanceCorrection.create(c);
      correctionDocs.push(doc._id);
    }
  }

  attendance.statuses = prepared;
  attendance.summary = {
    total: prepared.length,
    present: prepared.filter(s => s.status === "present").length,
    absent: prepared.filter(s => s.status === "absent").length
  };
  attendance.corrections = [...(attendance.corrections || []), ...correctionDocs];
  attendance.teacher = req.user?.accountId || attendance.teacher;
  await attendance.save();

  const populated = await Attendance.findById(attendance._id).populate("statuses.student").populate("corrections").populate("subject").populate("batch").lean();
  return res.status(200).json(new ApiReponse(200, populated, "Attendance updated"));
});

/**
 * GET /batch/:batchId/date/:date
 */
const getAttendanceByBatchDate = asynchandler(async (req, res) => {
  const { batchId, date } = req.params;
  const normalized = normalizeDateToUTCMidnight(date);
  const filter = { batch: batchId, date: normalized };
  if (req.query.subjectId) filter.subject = req.query.subjectId;

  const attendance = await Attendance.findOne(filter)
    .populate("batch")
    .populate("subject")
    .populate({ path: "teacher", populate: { path: "teacher" } })
    .populate("statuses.student")
    .populate("corrections")
    .lean();

  if (!attendance) return res.status(404).json(new ApiError(404, "Attendance not found for given batch/date"));
  return res.status(200).json(new ApiReponse(200, attendance, "Attendance fetched"));
});

/**
 * GET /student/:studentId?from=&to=
 * returns aggregated counts for a student
 */
const getStudentAttendance = asynchandler(async (req, res) => {
  const { studentId } = req.params;
  const from = req.query.from ? normalizeDateToUTCMidnight(req.query.from) : new Date(0);
  const to = req.query.to ? normalizeDateToUTCMidnight(req.query.to) : new Date();

  // aggregate: unwind statuses, match studentId, group by status
  const pipeline = [
    { $match: { date: { $gte: from, $lte: to } } },
    { $unwind: "$statuses" },
    { $match: { "statuses.student": mongoose.Types.ObjectId(studentId) } },
    { $group: { _id: "$statuses.status", count: { $sum: 1 } } }
  ];

  const result = await Attendance.aggregate(pipeline);
  const summary = result.reduce((acc, cur) => { acc[cur._id] = cur.count; return acc; }, {});
  const total = Object.values(summary).reduce((s, v) => s + v, 0);

  return res.status(200).json(new ApiReponse(200, { summary, total }, "Student attendance summary"));
});

export { markAttendance, updateAttendance, getAttendanceByBatchDate, getStudentAttendance };
