import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const studentAccountSchema = new mongoose.Schema({
   student: {                      // single reference to Students
      type: Schema.Types.ObjectId,
      ref: "Students",
      required: true
   },
   email: {                        // store actual email for quick lookup
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true,
      default: "12345678"
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
studentAccountSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

studentAccountSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};



// JWT methods
studentAccountSchema.methods.generateAccessToken = function() {
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

studentAccountSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        { _id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

export const StudentAccount = mongoose.model("StudentAccount", studentAccountSchema);
