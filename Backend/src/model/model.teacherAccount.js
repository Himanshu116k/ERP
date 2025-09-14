import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const teacherAccount = new mongoose.Schema({
   teacher: {                      // single reference to Students
      type: Schema.Types.ObjectId,
      ref: "Teacher",
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

// JWT methods
teacherAccount.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            studentId: this.student
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

export const TeacherAccount = mongoose.model("TeacherAccount", teacherAccount);
