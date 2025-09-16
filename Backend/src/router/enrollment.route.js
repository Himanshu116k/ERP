// routes/enrollment.route.js
import { Router } from "express";
import { enrollStudent, getEnrollmentsByBatch, removeEnrollment } from "../controller/enrollment.controller.js";

const router = Router();

router.post("/", enrollStudent); // { student, batch }
router.get("/batch/:batchId", getEnrollmentsByBatch);
router.delete("/:enrollId", removeEnrollment);

export default router;
