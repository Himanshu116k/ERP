import { asynchandler } from "../utility/asynchandler.js";
import {Students} from "../model/model.student.js"
import {StudentAccount} from "../model/model.studentAccount.js"
import {ApiError} from "../utility/apiError.js" 
import {ApiReponse} from "../utility/Apiresponce.js"
import { uplodOnCloudnary } from "../middleware/cloudnary.js";


const generateAccessAndRefreshTokens = async (userId,db) => {
  try {
    const user = await db.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};

const loginStudent =asynchandler(async(req,res)=>{
  //email
  //password 
  //isBlocke?
  //token
  //data,
  //accesstoken,
  const {email,password} = req.body;
  const User = await StudentAccount.findOne({email})
  if(!User) return res.status(404).ApiError(404,"user not found");
  const isPasswordCorrect = await User.isPasswordCorrect(password);
  if(!isPasswordCorrect) return res.status(401).ApiError(401,"invalid password")
// generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(User,StudentAccount);

  // remove sensitive fields
  const loggInuser = await StudentAccount.findOne(User._id).select("-password -refreshToken")
  const Pvalue = await StudentAccount.findOne().populate("student").exec().select("-password -refreshToken")
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refereshToken", refreshToken, options)
    .json(
      new ApiReponse(
        200,
        {
          user: {loggInuser,Pvalue},
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );

  


})

export const createStudent = asynchandler(async (req, res) => {
  try {
    const {
      name,
      roll,
      email,
      phone,
      fatherName,
      motherName,
      address,
      bloodGroup,
      disability,
      gender,
      dob,
      religion,
      nationality,
      tenthMarks,
      twelfthMarks,
    } = req.body;
    console.log(req.body);


    // Validate required fields
    if (
      !name ||
      !roll ||
      !email ||
      !phone ||
      !fatherName ||
      !motherName ||
      !address ||
      !gender ||
      !dob ||
      !religion ||
      !nationality
    ) {
      const missingFields = requiredFields.filter(field => !req.body[field]);

if (missingFields.length > 0) {
  return res.status(400).json({
    success: false,
    message: "Missing required fields",
    missing: missingFields
  });
}
      return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    // Check duplicates
    const existingStudent = await Students.findOne({
      $or: [{ roll }, { email }, { phone }],
    });
    if (existingStudent) {
      return res.status(409).json(new ApiError(409, "Student already exists"));
    }

    // ✅ Handle avatar file (multer.fields → req.files)
    let avatarUrl =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8oghbsuzggpkknQSSU-Ch_xep_9v3m6EeBQ&s";

    if (req.files && req.files.avatar && req.files.avatar.length > 0) {
      const avatarPath = req.files.avatar[0].path;
      const avatarImg = await uplodOnCloudnary(avatarPath);
      if (avatarImg) {
        avatarUrl = avatarImg.url;
      }
    }

    // Save student
    const newStudent = await Students.create({
      name,
      roll,
      email,
      phone,
      fatherName,
      motherName,
      address,
      bloodGroup,
      disability,
      gender,
      dob,
      religion,
      nationality,
      tenthMarks,
      twelfthMarks,
      avatar: avatarUrl,
    });
     
    

      const studentAccount = await StudentAccount.create({
      student: newStudent._id,           
      email: newStudent.email,         
      password:"12345678"
    });


    return res
      .status(201)
      .json(new ApiReponse(201, newStudent, "Student created successfully"));
  } catch (error) {
    console.error("Error creating student:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});




export {loginStudent}