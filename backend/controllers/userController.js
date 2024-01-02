const ErrorHandler = require("../util/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const invalidateToken = require("../util/invalidateToken");
const User = require("../models/userModel");
const sendToken = require("../util/jwtToken");

const sendEmail = require("../util/sendEmail");
const catchAsyncError = require("../middleware/catchAsyncError");
const crypto = require("crypto");

// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const { filename, path } = req.file;
    const user = await User.create({
      name,
      email,
      password,
      avatar: {
        filename,
        url: path,
      },
    });
    sendToken(user, 201, res);
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  console.log(req.body);
  // checking if user has given password and email both
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email or password", 400));
  }
  let user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password"));
  }

  const isPasswordMatched = user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// Logout User
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  console.log(user);
  const originalToken = user.getJWTToken();

  const invalidatedToken = invalidateToken(originalToken);

  if (!invalidatedToken) {
    throw next(new ErrorHandler("unable to logout user", 500));
  }

  res.status(200).json({
    success: true,
    message: "Logout Out",
    token: invalidateToken,
  });
});

// forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // get reset password token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findOne({ email: req.body.email });
  if (!updatedUser) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    resetToken,
    updatedUser,
  });
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset Password Token is invalid or expired", 400)
    );
  }

  if (req.body.password != req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

// get user details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    next(new ErrorHandler("User not found", 400));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update user password

exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );

  if (!user) {
    next(new ErrorHandler("User not found", 400));
  }

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    next(new ErrorHandler("Incorrect Password", 400));
  }

  if (req.body.newPassword != req.body.newConfirmPassword) {
    next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();
  sendToken(user, 200, res);
});

// update user Profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const data = req.body;
  const avatar = req.file;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      ...data,
      avatar: {
        filename: avatar.filename,
        url: avatar.path,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    user,
  });
});

// get all user for admin
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  if (!users) {
    return next(new ErrorHandler("Users does not exist", 400));
  }
  res.status(200).json({
    success: true,
    users,
  });
});

// get single user : admin
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`user doesn't exit with ${req.params.id}`, 400)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update user profile : admin
exports.updateUserByAdmin = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    email: req.body.email,
    name: req.body.name,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exist with id : ${req.params.id}`, 400)
    );
  }
  res.status(200).json({
    success: true,
    user,
  });
});

// delete user : admin
exports.deleteUserByAdmin = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User doesn't exits with id : ${req.params.id}`, 400)
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
  });
});
