const express = require("express");
const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(getProducts).post(protect, createProduct);
router.get("/:slug", getProductBySlug);
router
  .route("/:id")
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;