import { useEffect, useState } from "react";
import "./App.css";

interface Lead {
  "Lead ID": number;
  "Lead Name": string;
  "Contact Information": string;
  Source: string;
  "Interest Level": string;
  Status: string;
  "Assigned Salesperson": string;
}

const App = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [source, setSource] = useState("");
  const [interestLevel, setInterestLevel] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  const fetchLeads = async () => {
    try {
      const query = new URLSearchParams({
        source,
        interest_level: interestLevel,
        status,
        page: page.toString(),
      }).toString();

      const response = await fetch(
        `http://localhost:3000/leads/filter?${query}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLeads(data.leads);
      setTotalLeads(data.totalLeads);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [source, interestLevel, status, page]);

  return (
    <div id="root">
      <div className="card">
        {/* Filters */}
        <div>
          <label>
            Source:
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              <option value="">All</option>
              <option value="Referral">Referral</option>
              <option value="Website">Website</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Event">Event</option>
            </select>
          </label>

          <label>
            Interest Level:
            <select
              value={interestLevel}
              onChange={(e) => setInterestLevel(e.target.value)}
            >
              <option value="">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>

          <label>
            Status:
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All</option>
              <option value="New">New</option>
              <option value="Qualified">Qualified</option>
              <option value="Closed">Closed</option>
              <option value="Contacted">Contacted</option>
            </select>
          </label>

          {/* Filter Button */}
          {/* <button onClick={() => setPage(1)}>Apply Filters</button> */}
        </div>
      </div>

      {/* Leads Table */}
      <table>
        <thead>
          <tr>
            <th>Lead Name</th>
            <th>Contact Information</th>
            <th>Source</th>
            <th>Interest Level</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead["Lead ID"]}>
              <td>{lead["Lead Name"]}</td>
              <td>{lead["Contact Information"]}</td>
              <td>{lead.Source}</td>
              <td>{lead["Interest Level"]}</td>
              <td>{lead.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span> Page {page} </span>
        <button
          onClick={() =>
            setPage((prev) => (prev * 10 < totalLeads ? prev + 1 : prev))
          }
          disabled={page * 10 >= totalLeads}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
