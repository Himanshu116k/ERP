// routes/attendance.route.js
import { Router } from "express";
import { markAttendance, updateAttendance, getAttendanceByBatchDate, getStudentAttendance } from "../controller/attendance.controller.js";
// import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// require auth if you have middleware
router.post("/mark", /* verifyJWT, */ markAttendance);
router.put("/:attendanceId", /* verifyJWT, */ updateAttendance);
router.get("/batch/:batchId/date/:date", /* verifyJWT, */ getAttendanceByBatchDate);
router.get("/student/:studentId", /* verifyJWT, */ getStudentAttendance);

export default router;
