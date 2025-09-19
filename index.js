const { initializeDatabase } = require("./db/db.connect");
initializeDatabase();

const express = require("express");
const app = express();
app.use(express.json());

const { seedLeadData } = require("./dataSeeding/leadsSeeding");
// seedLeadData();

const { seedSalesAgent } = require("./dataSeeding/salesAgentSeeding");
// seedSalesAgent()

const { router: leadsRouter } = require("./routes/leads.routes");

app.use("/leads", leadsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
