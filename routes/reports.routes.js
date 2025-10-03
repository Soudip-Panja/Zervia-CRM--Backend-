const express = require("express")
const router = express.Router();

const Lead = require("../models/lead.model");

// Get Leads Closed Last Week
async function getLastWeekClosedLeads() {
  try {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const closedLeads = await Lead.find({
      status: "Closed",
      closedAt: { $gte: lastWeek },
    }).populate("salesAgent", "name");

    if (closedLeads.length > 0) {
      const formattedLeads = closedLeads.map((lead) => ({
        id: lead._id.toString(),
        name: lead.name,
        salesAgent: lead.salesAgent.name,
        closedAt: lead.closedAt,
      }));
      return formattedLeads
    } else {
      console.log("No closed lead found.");
    }
  } catch (error) {
    console.log("Failed to fetch closed leads", error);
  }
}

router.get("/last-week", async(req, res) => {
    try{
        const lastWeekClosedLeads = await getLastWeekClosedLeads()
        if(lastWeekClosedLeads) {
            res.status(200).json(lastWeekClosedLeads)
        } else {
            res.status(404).json({error: "No leads found."})
        }
    }
    catch (error) {
        res.status(500).json({error: "Failed to fetch leads"})
    }
})

//Get Total Leads in Pipeline
async function getLeadsInPipeline() {
  try{
    const totalLeads = await Lead.find({status: { $ne: "Closed" }})
    if(totalLeads.length > 0){
      console.log(`Total Leads = ${totalLeads.length}`)
    } else {
      console.log("No leads found.")
    }
  }
  catch (error) {
    console.log("Failed to fech total leads", error)
  }
}


module.exports = { router, getLeadsInPipeline };
