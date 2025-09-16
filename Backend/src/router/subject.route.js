// routes/subject.route.js
import { Router } from "express";
import { createSubject, getAllSubjects, getSubjectById, updateSubject, deleteSubject } from "../controller/subject.controller.js";

const router = Router();

router.post("/", createSubject);
router.get("/", getAllSubjects);
router.get("/:id", getSubjectById);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

export default router;
