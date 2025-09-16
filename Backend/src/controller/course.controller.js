// controllers/course.controller.js
import { asynchandler } from "../utility/asynchandler.js";
import { Course } from "../model/course.js";
import { ApiError } from "../utility/apiError.js";
import { ApiReponse } from "../utility/Apiresponce.js";

const createCourse = asynchandler(async (req, res) => {
  const { name, code, description } = req.body;
  if (!name || !code) return res.status(400).json(new ApiError(400,"Name and code required"));

  const exists = await Course.findOne({ code });
  if (exists) return res.status(409).json(new ApiError(409, "Course code already exists"));

  const course = await Course.create({ name, code, description });
  return res.status(201).json(new ApiReponse(201, course, "Course created"));
});

const getAllCourses = asynchandler(async (req, res) => {
  const courses = await Course.find().lean();
  return res.status(200).json(new ApiReponse(200, courses, "Courses fetched"));
});

const getCourseById = asynchandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json(new ApiError(404, "Course not found"));
  return res.status(200).json(new ApiReponse(200, course, "Course fetched"));
});

const updateCourse = asynchandler(async (req, res) => {
  const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updated) return res.status(404).json(new ApiError(404, "Course not found"));
  return res.status(200).json(new ApiReponse(200, updated, "Course updated"));
});

const deleteCourse = asynchandler(async (req, res) => {
  const removed = await Course.findByIdAndDelete(req.params.id);
  if (!removed) return res.status(404).json(new ApiError(404, "Course not found"));
  return res.status(200).json(new ApiReponse(200, removed, "Course deleted"));
});

export { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse };
