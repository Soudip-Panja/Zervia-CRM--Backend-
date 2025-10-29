const express = require("express");
const router = express.Router();

const SalesAgent = require("../models/salesAgent.model");
const { get } = require("mongoose");

//Create New Sales Agent

async function createNewSalesAgent(newSalesAgent) {
  try {
    const salesAgent = new SalesAgent(newSalesAgent);
    const saveSalesAgent = await salesAgent.save();
    return saveSalesAgent
  } catch (error) {
    console.log("Error creating new Sales Agent", error);
  }
}

router.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (name) {
      if (typeof name !== "string") {
        res
          .status(400)
          .json({ error: "Invalid input 'name' must be a string." });
      }
    } else {
      res.status(400).json({ error: "Name is missing." });
    }

    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400).json({ error: "Invalid email." });
      }
    } else {
      res.status(400).json({ error: "Email is missing." });
    }

    const existingAgent = await SalesAgent.findOne({ email });
    if (existingAgent) {
      return res.status(409).json({
        error: `Sales agent with email '${email}' already exists.`,
      });
    }

    const savedAgent = await createNewSalesAgent({ name, email });

    res.status(201).json({
      id: savedAgent._id,
      name: savedAgent.name,
      email: savedAgent.email,
      createdAt: savedAgent.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add Sales Agent." });
  }
});

//Get All Sales Agent
async function getAllSalesAgent() {
  try {
    const allSalesAgent = await SalesAgent.find();
    return allSalesAgent;
  } catch (error) {
    console.log("Failed to fetch all Sales Agent", error);
  }
}

router.get("/", async (req, res) => {
  try {
    const salesAgents = await getAllSalesAgent();
    if (salesAgents.length != 0) {
      res.json(salesAgents);
    } else {
      res.status(404).json({ error: "No Sales Agents found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch all Sales Agent." });
  }
});

module.exports = { router, createNewSalesAgent };
