const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../Models/User');

// auth
exports.authenticate = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    const token =
      req.cookies.token ||
      req.body.token ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({
      success: false,
      message: "Something went wrong while verifying token. Please login again.",
    });
  }
};
// is student
exports.isStudent = (req,res,next)=>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "this is protected route for students only!"
            });
        }
        next();
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified please login again!"
        });
    }

}

//is instructor

exports.isInstructor = (req,res,next)=>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "this is protected route for instructors only!"
            });
        }
        next();
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified please login again!"
        });
    }
}

//isadmin

exports.isAdmin = (req,res,next)=>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "this is protected route for admin only!"
            });
        }
        next();
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "user role cannot be verified please login again!"
        });
    }
}