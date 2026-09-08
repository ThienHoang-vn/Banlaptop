const express = require("express");
const {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead
} = require("../controllers/leadController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").post(createLead).get(protect, getLeads);
router
  .route("/:id")
  .put(protect, updateLeadStatus)
  .delete(protect, deleteLead);

module.exports = router;