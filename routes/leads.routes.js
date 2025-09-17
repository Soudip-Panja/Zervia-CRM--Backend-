const express = require("express");
require("dotenv").config();
const app = express();

const Lead = require("../models/lead.model");
const SalesAgent = require("../models/salesAgent.model");

async function createNewLead(newLead) {
  try {
    const lead = new Lead(newLead);
    const saveLead = await lead.save();
    console.log(saveLead);
  } catch (error) {
    console.log("Error creating new lead.", error);
  }
}
module.exports = { createNewLead };