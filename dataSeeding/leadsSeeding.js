const fs = require("fs");
const Lead = require("../models/lead.model");

const jasonData = fs.readFileSync("./data/leads.json", "utf-8");
const leadsData = JSON.parse(jasonData);

async function seedLeadData() {
  try {
    for (const leadData of leadsData) {
      const newLead = new Lead({
        name: leadData.name,
        source: leadData.source,
        salesAgent: leadData.salesAgent,
        status: leadData.status,
        tags: leadData.tags,
        timeToClose: leadData.timeToClose,
        priority: leadData.priority,
        createdAt: leadData.createdAt,
        updatedAt: leadData.updatedAt,
        closedAt: leadData.closedAt,
      });
      await newLead.save();
    }
    console.log("Leads Data successfully seeded ✅");
  } catch (error) {
    console.log("Error seeding leeds data: ", error);
  }
}
module.exports = { seedLeadData };
