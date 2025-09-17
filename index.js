const { initializeDatabase } = require("./db/db.connect");
initializeDatabase();

const { seedLeadData } = require("./dataSeeding/leadsSeeding");
// seedLeadData();

const { seedSalesAgent } = require("./dataSeeding/salesAgentSeeding");
seedSalesAgent()
