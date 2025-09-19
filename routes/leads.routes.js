const express = require("express");
const router = express.Router();

const Lead = require("../models/lead.model");
const SalesAgent = require("../models/salesAgent.model");

async function createNewLead(newLead) {
  try {
    if (newLead.salesAgent) {
      const agentExist = await SalesAgent.findById(newLead.salesAgent);
      if (!agentExist) {
        throw new Error(`Sales agent of ID ${newLead.salesAgent} not found.`);
      }
    }
    const lead = new Lead(newLead);
    const saveLead = await lead.save();

    const populatedLead = await saveLead.populate("salesAgent", "name");
    return populatedLead;
  } catch (error) {
    console.log("Error creating new lead.", error);
  }
}

router.post("/", async (req, res) => {
  try {
    const { name, source, salesAgent, status, tags, timeToClose, priority } =
      req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Invalid input name is require." });
    }
    const validSources = [
      "Website",
      "Referral",
      "Cold Call",
      "Advertisement",
      "Email",
      "Other",
    ];

    if (!source || !validSources.includes(source)) {
      return res.status(400).json({
        error:
          "Invalid input: 'source' must be one of " + validSources.join(", "),
      });
    }

    const validStatuses = [
      "New",
      "Contacted",
      "Qualified",
      "Proposal Sent",
      "Closed",
    ];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error:
          "Invalid input: 'status' must be one of " + validStatuses.join(", "),
      });
    }

    if (
      timeToClose !== undefined &&
      (!Number.isInteger(timeToClose) || timeToClose <= 0)
    ) {
      return res
        .status(400)
        .json({ error: "'timeToClose' must be a positive integer." });
    }

    const validPriorities = ["High", "Medium", "Low"];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        error: "Invalid input: 'priority' must be one of High, Medium, Low.",
      });
    }

    const newLead = {
      name,
      source,
      salesAgent,
      status,
      tags,
      timeToClose,
      priority,
    };
    const savedLead = await createNewLead(newLead);
    res
      .status(201)
      .json({ message: "Lead added successfully.", lead: savedLead });
  } catch (error) {
    if (error.message.includes("Sales agent")) {
      return res.status(404).json({ error: error.message });
    }
    console.error("Error creating lead:", error);
    res.status(500).json({ error: "Failed to add Lead." });
  }
});

module.exports = { router, createNewLead };
