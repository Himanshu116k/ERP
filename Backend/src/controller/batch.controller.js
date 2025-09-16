// controllers/batch.controller.js
import { asynchandler } from "../utility/asynchandler.js";
import { Batch } from "../model/batch.js";
import { Course } from "../model/course.js";
import { ApiError } from "../utility/apiError.js";
import { ApiReponse } from "../utility/Apiresponce.js";

const createBatch = asynchandler(async (req, res) => {
  const { name, course, year, section, academicYear } = req.body;
  console.log(req.body)
  if (!name || !course || !year) return res.status(400).json(new ApiError(400, "Missing required fields"));

  const courseDoc = await Course.findOne({name: course });
  console.log(courseDoc)
  if (!courseDoc) return res.status(404).json(new ApiError(404, "Course not found"));

  // Unique enforced by model index; still check to return friendly error
  const exists = await Batch.findOne({ course: courseDoc._id, year, section, academicYear });
  console.log(exists)
  if (exists) return res.status(409).json(new ApiError(409, "Batch already exists for given course/year/section"));

  const batch = await Batch.create({ name, course: courseDoc._id, year, section, academicYear });
  return res.status(201).json(new ApiReponse(201, batch, "Batch created"));
});

const getAllBatches = asynchandler(async (req, res) => {
  const filter = {};
  if (req.query.course) filter.course = req.query.course;
  if (req.query.year) filter.year = Number(req.query.year);
  if (req.query.academicYear) filter.academicYear = req.query.academicYear;

  const batches = await Batch.find(filter).populate("course").lean();
  return res.status(200).json(new ApiReponse(200, batches, "Batches fetched"));
});

const getBatchById = asynchandler(async (req, res) => {
  const batch = await Batch.findById(req.params.id).populate("course");
  if (!batch) return res.status(404).json(new ApiError(404, "Batch not found"));
  return res.status(200).json(new ApiReponse(200, batch, "Batch fetched"));
});

const updateBatch = asynchandler(async (req, res) => {
  const updated = await Batch.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updated) return res.status(404).json(new ApiError(404, "Batch not found"));
  return res.status(200).json(new ApiReponse(200, updated, "Batch updated"));
});

const deleteBatch = asynchandler(async (req, res) => {
  const removed = await Batch.findByIdAndDelete(req.params.id);
  if (!removed) return res.status(404).json(new ApiError(404, "Batch not found"));
  return res.status(200).json(new ApiReponse(200, removed, "Batch deleted"));
});

export { createBatch, getAllBatches, getBatchById, updateBatch, deleteBatch };
