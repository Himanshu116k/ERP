// controllers/subject.controller.js
import { asynchandler } from "../utility/asynchandler.js";
import { Subject } from "../model/subject.js";
import { Course } from "../model/course.js";
import { ApiError } from "../utility/apiError.js";
import { ApiReponse } from "../utility/Apiresponce.js";

const createSubject = asynchandler(async (req, res) => {
  const { name, code, course, year, credits } = req.body;
  if (!name || !course) return res.status(400).json(new ApiError(400, "Name and course required"));

  const courseDoc = await Course.findById(course);
  if (!courseDoc) return res.status(404).json(new ApiError(404, "Course not found"));

  const existing = code ? await Subject.findOne({ code }) : null;
  if (existing) return res.status(409).json(new ApiError(409, "Subject code already exists"));

  const subject = await Subject.create({ name, code, course, year, credits });
  return res.status(201).json(new ApiReponse(201, subject, "Subject created"));
});

const getAllSubjects = asynchandler(async (req, res) => {
  const filter = {};
  if (req.query.course) filter.course = req.query.course;
  if (req.query.year) filter.year = Number(req.query.year);

  const subjects = await Subject.find(filter).populate("course").lean();
  return res.status(200).json(new ApiReponse(200, subjects, "Subjects fetched"));
});

const getSubjectById = asynchandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id).populate("course");
  if (!subject) return res.status(404).json(new ApiError(404, "Subject not found"));
  return res.status(200).json(new ApiReponse(200, subject, "Subject fetched"));
});

const updateSubject = asynchandler(async (req, res) => {
  const updated = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!updated) return res.status(404).json(new ApiError(404, "Subject not found"));
  return res.status(200).json(new ApiReponse(200, updated, "Subject updated"));
});

const deleteSubject = asynchandler(async (req, res) => {
  const removed = await Subject.findByIdAndDelete(req.params.id);
  if (!removed) return res.status(404).json(new ApiError(404, "Subject not found"));
  return res.status(200).json(new ApiReponse(200, removed, "Subject deleted"));
});

export { createSubject, getAllSubjects, getSubjectById, updateSubject, deleteSubject };
