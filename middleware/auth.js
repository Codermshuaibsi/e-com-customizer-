const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel");

// wrong auth 

// exports.auth = async (req, res, next) => {
//   try {
//     //  extract token
//     const token =
//       req.cookies.token ||
//       req.body.token ||
//       req.header("Authorization").replace("Bearer ", "");

//     // if token missing , then return response
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "token is missing",
//       });
//     }

//     // verify the token
//     try {
//       const decode = jwt.verify(token, process.env.JWT_SECRET);
//       console.log("decode ", decode);
//       req.user = decode;
//     } catch (error) {
//       console.log(`error in auth middleware `, error);
//       return res.status(401).json({
//         success: false,
//         message: `token in invalid`,
//       });
//     }

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: `something went wrong while validating the token`,
//     });
//   }
// };

// auth 

exports.auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided or malformed authorization header",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      error: error.message,
    });
  }
};



exports.isAuth = async (req, res, next) => {
  try {
    const { token } = req.params;

    console.log("token", token);

    // if token missing , then return response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "token is missing",
      });
    }

    // verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decode ", decode);
      req.user = decode;
    } catch (error) {
      console.log(`error in auth middleware `, error);
      return res.status(401).json({
        success: false,
        message: `token in invalid`,
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `something went wrong while validating the token`,
    });
  }
};

// isUser 

exports.isUser = async (req, res, next) => {
  try {
    if (req.user.role !== "User") {
      return res.status(401).json({
        success: false,
        message: `this is protected route for user only`,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: ` user role cannot be verified , please try again`,
    });
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to verify admin access",
      error: error.message,
    });
  }
};
