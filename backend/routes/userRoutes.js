const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserByAdmin,
  deleteUserByAdmin,
} = require("../controllers/userController");

const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage: storage });

router.route("/register").post(upload.single("avatar"), registerUser);

router.route("/login").post(loginUser);
router.route("/logout").get(isAuthenticatedUser, logoutUser);
// router.route("/password/forgot").post(forgotPassword);
// router.route("/password/reset/:token").put(resetPassword);
// router.route("/password/update").put(updatePassword);

router.route("/user").get(isAuthenticatedUser, getUserDetails);
router
  .route("/user/update")
  .patch(isAuthenticatedUser, upload.single("avatar"), updateProfile);
router
  .route("/admin/users")
  // .get(isAuthenticatedUser, authorizedRoles("admin"), getAllUsers);
  .get(getAllUsers);
router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateUserByAdmin)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteUserByAdmin);
module.exports = router;
