const express = require("express");
const authRoutes = require("./authRoutes");
const categoryRoutes = require("./categoryRoutes");
const productRoutes = require("./productRoutes");
const leadRoutes = require("./leadRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/leads", leadRoutes);

router.use("/admin/auth", authRoutes);
router.use("/admin/categories", categoryRoutes);
router.use("/admin/products", productRoutes);
router.use("/admin/leads", leadRoutes);

module.exports = router;