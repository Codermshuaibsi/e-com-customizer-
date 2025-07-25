const User = require("../models/userModel");
const admin = require("../utils/firebase")
const bcrypt = require("bcrypt");
const validator = require("validator")
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/mailSender"); 
const { findOne } = require("../models/productModel");
const { uploadToCloudinary } = require("../utils/imageUploader");


// getUser
exports.getUserDetails = async (req, res) => {
  try {
    const id = req.params.id || req.user.id;

    const userDetails = await User.findById({ _id: id });

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "user does not found ",
      });
    }

    return res.status(200).json({
      success: true,
      message: "user details fetch successfully",
      data: userDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in getUserDetails",
    });
  }
}; 
  
// postUser
exports.signUp = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      role,
      favouriteGame,
      address,
      state,
      pincode,
      city,
    } = req.body;

    // 🛑 Basic validation
    if (
      !firstName ||
      !email ||
      !lastName ||
      !phoneNumber ||
      !password ||
      !favouriteGame ||
      !address ||
      !state ||
      !pincode ||
      !city
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Email Validation
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // ✅ Check if user exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    // ✅ Password length check
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Please enter a stronger password (min 6 characters)",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // ✅ Create User
    const userDetails = await User.create({
      firstName,
      lastName,
      phoneNumber,
      email,
      password: hashPassword,
      role: role || "User",
      favouriteGame,
      address: {
        addressLine: address,
        state: state,
        pincode: pincode,
        city: city,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      userDetails,
    });
  } catch (error) {
    console.log("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Error in signup controller",
    });
  }
};

  

// Login with Google auth
exports.LoginWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log(decodedToken);

    const email = decodedToken.email;
    const fullName = decodedToken.name;


    const nameParts = fullName ? fullName.split(' ') : [];
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts[1] || 'User';
    const uid = decodedToken?.uid

    console.log(`${firstName}, ${lastName}..`);
    const existingUser = await User.findOne({ email });

    // If user exists, return the existing user data and token
    if (existingUser) {
      const payload = {
        email,
        id: existingUser._id,
        role: existingUser ? existingUser.role : 'User',
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '3d',
      });
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: existingUser,
        token,
        uid
      });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      role: 'User',
      password: "",
    });

    await newUser.save();
    const payload = {
      email,
      id: newUser._id,
      role: newUser ? newUser.role : 'User',
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
      token,
      uid,

    });

  } catch (error) {
    console.error("Error during Google login:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during sign-up or login. Please try again.",
    });
  }
};

// admin login
exports.adminLogin = async (req, res) => {
  try {
    //  get data from req.body
    const { email, password } = req.body;

    //  validation data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: `all fields are required ,please try again`,
      });
    }
    // user check exist of not
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `please register as Admin before login`,
      });
    }

    if (user.role !== "Admin") {
      return res.status(404).json({
        success: false,
        message: "Admin do not found with this email id ",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    // password match and generate jwt
    if (await bcrypt.compare(password, user.password)) {
      //  creating token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });

      // todo: toObject ki jrurt ho skti hai fat skta hai
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      // create cookie and send response
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `login successfully`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `password inccorrect`,
      });
    }
  } catch (error) {
    console.log(`error in login `, error);
    return res.status().json({
      success: false,
      message: ` login failure , please try again `,
    });
  }
};

// login
exports.login = async (req, res) => {
  try {
    //  get data from req.body
    const { email, password } = req.body;

    //  validation data
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: `all fields are required ,please try again`,
      });
    }
    // user check exist of not
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `please register before login`,
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    };

    // password match and generate jwt
    if (await bcrypt.compare(password, user.password)) {
      //  creating token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      // todo: toObject ki jrurt ho skti hai fat skta hai
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      // create cookie and send response
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `login successfully`,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `password inccorrect`,
      });
    }
  } catch (error) {
    console.log(`error in login `, error);
    return res.status().json({
      success: false,
      message: ` login failure , please try again `,
    });
  }
}; 

// updateUser
exports.updateUser = async (req, res) => {
  try {
  const { firstName, lastName, phoneNumber, role, email } = req.body;

  const id = req.params.id || (req.user && req.user.id);
  console.log("➡️ ID to update:", id);

  const userDetails = await User.findById(id);
  console.log("➡️ Found user:", userDetails);

  if (!userDetails) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  if (email && email !== userDetails.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }
    userDetails.email = email;
  }

  if (firstName) userDetails.firstName = firstName;
  if (lastName) userDetails.lastName = lastName;
  if (phoneNumber) userDetails.phoneNumber = phoneNumber;
  if (role) userDetails.role = role;

  await userDetails.save();

  return res.status(200).json({
    success: true,
    message: "User profile updated successfully",
    data: userDetails,
  });
} catch (error) {
  console.error("🔥 Update error:", error);
  return res.status(500).json({
    success: false,
    message: "cannot update user",
  });
}

};

//updateprofile

exports.updateprofile = async(req,res)=>{
      
   try {

     const userId = req.user.id;
  const thumbnail = req.files?.thumbnail;

  if(!userId){
     return res.status(500).json({
          success: false,
          message: "User not found",
        });
  }

   if(!thumbnail){
     return res.status(500).json({
          success: false,
          message: "fields are required ,please try again",
        });
  }

  const userUpdate =await User.findOne({_id:userId});

  if (thumbnail) {
        // upload to cloudinary
        const image = await uploadToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME,
          1000,
          1000
        );
  
        userUpdate.thumbnail = image.secure_url;
      }

        userUpdate.save();

    return res.status(200).json({
      success: true,
      message: "profile update successfully",
    });
    
   } catch (error) {
     
     console.log(error);
    res.status(500).json({
      success: false,
      message: "internal server error in updating product",
    });

   }
  

}


// deleteUser
exports.deleteUser = async (req, res) => {
  try {

    const id = req.params.id || req.user.id;
    const { uid } = req.body;


    const userDetails = await User.findOne({ _id: id });

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    if (uid) {
      try {
        await admin.auth().deleteUser(uid);
        console.log(`User ${uid} deleted from Firebase successfully`);
      } catch (firebaseError) {
        console.log(`Error deleting Firebase user: ${firebaseError.message}`);
        return res.status(500).json({
          success: false,
          message: "Error deleting user from Firebase. Please try again.",
        });
      }
    }

    // Now, delete the user from the local MongoDB database
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Cannot delete account, please try again.",
    });
  }
};

// get all users
exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});

    if (allUsers.length === 0) {
      return res.status(403).json({
        success: false,
        message: "no user found till now",
      });
    }

    return res.status(200).json({
      success: true,
      message: "successfuly fetch all users ",
      data: allUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in fetch all useres ",
    });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const allAdmins = await User.find({ role: "Admin" });

    if (!allAdmins || allAdmins.length === 0) {
      return res.status(403).json({
        success: false,
        message: "no admin found till now",
      });
    }

    return res.status(200).json({
      success: true,
      message: "successfuly fetch all users ",
      data: allAdmins,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in fetch all admins ",
    });
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params
    const admin = await User.findOne({ _id: id, role: "Admin" })
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "no admin not found with this id"
      })
    }
    if (!admin || admin.length === 0) {
      return res.status(403).json({
        success: false,
        message: "no admin found till now",
      });
    }
    return res.status(200).json({
      success: true,
      message: "admin found successfully by id",
      data: admin
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in fetch  admins By Id ",
    });
  }
}

// update address
exports.updateAddress = async (req, res) => {
  try {
    const { state, pincode, address, city } = req.body;

    if (!country || !state || !pincode || !address || !city) {
      return res.status(403).json({
        success: false,
        message: "please send all data of address",
      });
    }
    const id = req.user.id;

    const updatedAddress = {
      country,
      state,
      pincode,
      addressLine: address,
      city,
    };

    const userDetails = await User.findById({ _id: id });
    if (userDetails) {
      userDetails.address = updatedAddress;

      await userDetails.save();
      return res.status(200).json({
        success: true,
        messsage: "successfully save the address",
        userDetails,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
}; 

// send connect mail
exports.sendConnectMail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(403).json({
        success: false,
        message: "Please send the email id",
      });
    }

    await mailSender(email, `You are connected with us`, ` hey !! `);

    return res.status(200).json({
      success: true,
      message: "email sent successfully ",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error ",
    });
  }
};

// forgot password
exports.lostPasswordController = async (req, res) => {
  try {
    const { email, favouriteGame, newPassword } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!favouriteGame) {
      return res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      return res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await User.findOne({ email, favouriteGame });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or favouriteGame",
      });
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password: hashPassword });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
}
 


