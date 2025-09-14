import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const teacherAccount = new mongoose.Schema({
   teacher: {                      // single reference to Students
      type: Schema.Types.ObjectId,
      ref: "Teachers",
      required: true
   },
   email: {                        // store actual email for quick lookup
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      default: "123456"
   },
   isBlocked: {
     type: Boolean,
     required: true,
     default: false
   },
   refreshToken: {
      type: String,
   },

}, { timestamps:true });


// password hashing
teacherAccount.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


teacherAccount.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// JWT methods
teacherAccount.methods.generateAccessToken = function() {
    return jwt.sign(
        {
           _id: this._id,
      email: this.email,
      teacherId: this.teacher // ✅ correct
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

teacherAccount.methods.generateRefreshToken = function() {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

export const TeacherAccounts = mongoose.model("TeacherAccounts", teacherAccount);
