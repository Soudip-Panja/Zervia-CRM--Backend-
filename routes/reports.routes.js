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
      console.log(formattedLeads);
    } else {
      console.log("No closed lead found.");
    }
  } catch (error) {
    console.log("Failed to fetch closed leads", error);
  }
}

module.exports = { getLastWeekClosedLeads };
