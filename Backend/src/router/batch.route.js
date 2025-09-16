import { Router } from "express";
import { createBatch } from "../controller/batch.controller.js";

const router = Router();

router.post("/", createBatch);

export default router;
