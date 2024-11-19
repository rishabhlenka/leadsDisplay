const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

// Read leads json
const readLeadsJSON = () => {
  const filePath = path.join(__dirname, "leads.json");
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
};

// GET: Fetch all leads, filter and paginate
app.get("/leads/filter", (req, res) => {
  const leads = readLeadsJSON();
  const { source, interest_level, status, page = 1, limit = 10 } = req.query;

  const filteredLeads = leads.filter((lead) => {
    return (
      (!source || lead.Source === source) &&
      (!interest_level || lead["Interest Level"] === interest_level) &&
      (!status || lead.Status === status)
    );
  });

  // Add pagination to subset
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

  res.json({
    leads: paginatedLeads,
    currentPage: parseInt(page, 10),
    totalLeads: filteredLeads.length,
  });
});

// Test server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
