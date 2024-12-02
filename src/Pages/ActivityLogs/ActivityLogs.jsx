import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get("/api/user/activity-logs", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Get the token from local storage
          },
        });
        setLogs(response.data);
      } catch (error) {
        console.error("Error fetching activity logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) return <CircularProgress style={{ display: "block", margin: "20px auto" }} />;

  return (
    <TableContainer component={Paper} style={{ maxWidth: "800px", margin: "20px auto", padding: "20px" }}>
      <Button 
        variant="outlined" 
        color="primary" 
        onClick={() => navigate('/customer-dashboard')} 
        style={{ marginBottom: "20px" }}
      >
        Back to Dashboard
      </Button>

      <h2 style={{ textAlign: "center" }}>Activity Logs</h2>
      {logs.length === 0 ? (
        <p style={{ textAlign: "center" }}>No activity logs available.</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Activity Type</strong></TableCell>
              <TableCell><strong>Details</strong></TableCell>
              <TableCell><strong>Timestamp</strong></TableCell>
              <TableCell><strong>Sign In Time</strong></TableCell>
              <TableCell><strong>Sign Out Time</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{log.activityType}</TableCell>
                <TableCell>{log.activityDetails}</TableCell>
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                
                {/* Render Sign In and Sign Out Time if available */}
                <TableCell>
                  {log.activityType === "sign-in" ? new Date(log.timestamp).toLocaleString() : "-"}
                </TableCell>
                <TableCell>
                  {log.activityType === "sign-out" ? new Date(log.timestamp).toLocaleString() : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default ActivityLogs;
