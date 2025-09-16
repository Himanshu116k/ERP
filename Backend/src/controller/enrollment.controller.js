// controllers/enrollment.controller.js
import { asynchandler } from "../utility/asynchandler.js";
import { Enrollment } from "../model/enrollment.js";
import { Students } from "../model/model.student.js";
import { Batch } from "../model/batch.js";
import { ApiError } from "../utility/apiError.js";
import { ApiReponse } from "../utility/Apiresponce.js";

const enrollStudent = asynchandler(async (req, res) => {
  const { student, batch } = req.body;
  if (!student || !batch) return res.status(400).json(new ApiError(400, "student and batch are required"));

  const studentDoc = await Students.findById(student);
  if (!studentDoc) return res.status(404).json(new ApiError(404, "Student not found"));

  const batchDoc = await Batch.findById(batch);
  if (!batchDoc) return res.status(404).json(new ApiError(404, "Batch not found"));

  // prevent duplicate enrollment
  const existing = await Enrollment.findOne({ student, batch });
  if (existing) return res.status(409).json(new ApiError(409, "Student already enrolled in this batch"));

  const enrollment = await Enrollment.create({ student, batch });
  return res.status(201).json(new ApiReponse(201, enrollment, "Enrollment created"));
});

const getEnrollmentsByBatch = asynchandler(async (req, res) => {
  const { batchId } = req.params;
  const enrollments = await Enrollment.find({ batch: batchId, status: "active" }).populate("student").lean();
  return res.status(200).json(new ApiReponse(200, enrollments, "Enrollments fetched"));
});

const removeEnrollment = asynchandler(async (req, res) => {
  const removed = await Enrollment.findByIdAndDelete(req.params.enrollId);
  if (!removed) return res.status(404).json(new ApiError(404, "Enrollment not found"));
  return res.status(200).json(new ApiReponse(200, removed, "Enrollment removed"));
});

export { enrollStudent, getEnrollmentsByBatch, removeEnrollment };
