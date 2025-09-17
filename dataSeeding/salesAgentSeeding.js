const fs = require("fs");
const salesAgent = require("../models/salesAgent.model");

const jsonData = fs.readFileSync("./data/salesAgent.json", "utf-8");
const salesAgentData = JSON.parse(jsonData);

async function seedSalesAgent() {
  try {
    for (const saleAgentData of salesAgentData) {
      const newSaleAgent = new salesAgent({
        name: saleAgentData.name,
        email: saleAgentData.email,
        createdAt: saleAgentData.createdAt,
      });
      await newSaleAgent.save();
    }
    console.log("Sales Agent data successfully seeded ✅")
  } catch (error) {
    console.log("Error seeding salesAgent data: ", error);
  }
}
module.exports = { seedSalesAgent };
