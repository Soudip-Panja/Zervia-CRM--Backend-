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
    throw error
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

// Get Lead
async function readAllLeads(filter = {}) {
  try {
    const leads = await Lead.find(filter).populate("salesAgent", "name");
    return leads;
  } catch (error) {
    console.log("Error fetching leads", error);
    throw error;
  }
}

router.get("/", async (req, res) => {
  try {
    const { salesAgent, status, tags, source } = req.query;

    const validStatuses = [
      "New",
      "Contacted",
      "Qualified",
      "Proposal Sent",
      "Closed",
    ];
    const validSources = [
      "Website",
      "Referral",
      "Cold Call",
      "Advertisement",
      "Email",
      "Other",
    ];

    let filter = {};

  
    if (salesAgent) {
      const mongoose = require("mongoose");
      if (!mongoose.Types.ObjectId.isValid(salesAgent)) {
        return res
          .status(400)
          .json({ error: "Invalid input: 'salesAgent' must be a valid ObjectId." });
      }
      filter.salesAgent = salesAgent;
    }

    if (status) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: "Invalid input: 'status' must be one of " + validStatuses.join(", "),
        });
      }
      filter.status = status;
    }

    if (tags) {
      const tagsArray = tags.split(",").map((t) => t.trim());
      filter.tags = { $all: tagsArray };
    }

    if (source) {
      if (!validSources.includes(source)) {
        return res.status(400).json({
          error: "Invalid input: 'source' must be one of " + validSources.join(", "),
        });
      }
      filter.source = source;
    }

    const leads = await readAllLeads(filter);
    res.status(200).json(leads);
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({ error: "Failed to fetch leads." });
  }
});

//Update Lead
async function updateLead(leadId, dataToUpdate) {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(leadId, dataToUpdate, {new: true}).populate("salesAgent", "_id name") 
    return updatedLead
  }
  catch (error) {
    console.log("Failed to update lead", error)
  }
}

router.post("/:leadId", async (req, res) => {
  try{
    const updatedLead = await updateLead(req.params.leadId, req.body)
    if(updateLead) {
      res.status(200).json({message: "Lead updated successfully.", Lead: updatedLead})
    } else {
      res.status(404).json({error: `Lead with ID ${req.params.leadId} not found.`})
    }
  }
  catch (error) {
    res.status(500).json({error: "Failed to update lead"})
  }
})

//Delete Lead
async function deleteLead(leadId) {
  try {
    const deletedLead = await Lead.findByIdAndDelete(leadId)
    return deletedLead
  }
  catch (error) {
    console.log("Failed to delete Lead.")
  }
}

router.delete("/:leadId", async (req, res) => {
  try{
    const deletedLead = await deleteLead(req.params.leadId)
    if(deletedLead) {
      res.status(200).json({message: "Lead deleted successfully", DeletedLead: deletedLead})
    } else {
      res.status(404).json({error: `Lead with ID ${req.params.leadId} not found.`})
    }
  }
  catch (error) {
    res.status(500).json({error: "Failed to delete Lead."})
  }
})


module.exports = { router, createNewLead };