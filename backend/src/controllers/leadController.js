const Lead = require("../models/Lead");

const createLead = async (req, res) => {
  try {
    const { customerName, phone, product, note } = req.body;

    if (!customerName || !phone) {
      return res
        .status(400)
        .json({ message: "Customer name and phone are required" });
    }

    const lead = await Lead.create({
      customerName,
      phone,
      product: product || null,
      note: note || "",
      status: "pending"
    });

    res.status(201).json(lead);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getLeads = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const queryObject = {};

    if (status) {
      const validStatuses = ["pending", "contacted", "done"];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid lead status" });
      }

      queryObject.status = status;
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const total = await Lead.countDocuments(queryObject);

    const leads = await Lead.find(queryObject)
      .populate("product", "name slug price thumbnail")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const totalPages = Math.ceil(total / limitNumber);

    res.status(200).json({
      leads,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const validStatuses = ["pending", "contacted", "done"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid lead status" });
    }

    lead.status = status;
    const updatedLead = await lead.save();

    res.status(200).json(updatedLead);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead
};