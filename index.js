const { initializeDatabase } = require("./db/db.connect");
initializeDatabase();

const express = require("express");
const app = express();
app.use(express.json());

const { router: leadsRouter } = require("./routes/leads.routes");
const { router: salesAgentRouter } = require("./routes/salesAgent.routes");

app.use("/leads", leadsRouter);
app.use("/sales-agents", salesAgentRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
