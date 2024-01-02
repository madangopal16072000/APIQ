const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createOrUpdataProductReview,
  getAllReviews,
  deleteReview,
  getAdminProducts,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizedRoles } = require("../middleware/auth");

const router = express.Router();
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage: storage });

// isAuthenticatedUser, authorizedRoles("admin"),
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAdminProducts);

router.route("/products").get(getAllProducts);

router
  .route("/admin/product/new")
  .post(
    isAuthenticatedUser,
    authorizedRoles("admin"),
    upload.array("images"),
    createProduct
  );
// router.route("/product/new").post(upload.array("images"), createProduct);

router
  .route("/admin/product/:id")
  .patch(
    isAuthenticatedUser,
    authorizedRoles("admin"),
    upload.array("images"),
    updateProduct
  )
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct);

router.route("/product/:id").get(getProductDetails);

router
  .route("/reviews")
  .put(isAuthenticatedUser, createOrUpdataProductReview)
  .delete(isAuthenticatedUser, deleteReview)
  .get(getAllReviews);
module.exports = router;
