import { Router } from "express";
import {upload} from "../middleware/multer.middleware.js"
// import {verifyJWT} from "../middleware/auth.middleware.js"
import {createStudent,loginStudent} from "../controller/auth.controller.js"

const router = Router();
router.route("/register-newstudent").post(upload.fields([
          {
            name:"avatar",//fronted name should be avtar
            maxCount:1
          }
    ]),createStudent)
    
router.route("/login-student").post(loginStudent)

export default router;
