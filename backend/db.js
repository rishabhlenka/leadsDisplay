// const { Pool } = require("pg");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const csvFilePath = path.join(__dirname, "leads.csv");
const jsonFilePath = path.join(__dirname, "leads.json");

const convertCSVtoJSON = async () => {
  const results = [];

  try {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        results.push({
          lead_id: row["Lead ID"],
          lead_name: row["Lead Name"],
          contact_info: row["Contact Information"],
          source: row["Source"],
          interest_level: row["Interest Level"],
          status: row["Status"],
          assigned_salesperson: row["Assigned Salesperson"],
        });
      })
      .on("end", () => {
        // Write the results array to a JSON file
        const jsonFilePath = path.join(__dirname, "leads.json");
        fs.writeFileSync(jsonFilePath, JSON.stringify(results, null, 2));
        console.log(
          "CSV successfully converted to JSON and saved as leads.json"
        );
      });
  } catch (err) {
    console.error("Error converting CSV to JSON:", err);
  }
};

const initJSONExport = async () => {
  await convertCSVtoJSON();
};

// Run the code
initJSONExport();

// // Create a pool connection
// const pool = new Pool({
//   user: "glimpse",
//   host: "localhost",
//   database: "mydb",
//   password: "glimpse",
//   port: 5432,
// });

// module.exports = pool;

// const createLeadsTable = async () => {
//   const query = `
//     CREATE TABLE IF NOT EXISTS leads (
//       lead_id SERIAL PRIMARY KEY,
//       lead_name VARCHAR(255),
//       contact_info VARCHAR(255),
//       source VARCHAR(255),
//       interest_level VARCHAR(255),
//       status VARCHAR(255),
//       assigned_salesperson VARCHAR(100)
//     );
//   `;

//   try {
//     await pool.query(query);
//     console.log("Leads table created");
//   } catch (err) {
//     console.error("Error creating table:", err);
//   }
// };

// const importLeads = async () => {
//   const csvFilePath = path.join(__dirname, "leads.csv");

//   try {
//     const results = [];
//     fs.createReadStream(csvFilePath)
//       .pipe(csv())
//       .on("data", (row) => {
//         results.push(row);
//       })
//       .on("end", async () => {
//         for (const lead of results) {
//           const query = `
//             INSERT INTO leads (lead_name, contact_info, source, interest_level, status, assigned_salesperson)
//             VALUES ($1, $2, $3, $4, $5, $6)
//           `;
//           const values = [
//             lead.lead_name,
//             lead.contact_info,
//             lead.source,
//             lead.interest_level,
//             lead.status,
//             lead.assigned_salesperson,
//           ];
//           await pool.query(query, values);
//         }
//         console.log("Leads imported successfully");
//       });
//   } catch (err) {
//     console.error("Error importing leads from CSV:", err);
//   }
// };

// const initDB = async () => {
//   await createLeadsTable();
//   await importLeads();
// };

// module.exports = { pool, initDB };
