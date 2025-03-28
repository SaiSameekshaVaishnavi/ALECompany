import React, { useContext, useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import { Add, Edit, Delete, Home, ExitToApp } from "@mui/icons-material";
import { api } from "./refreshToken";
import { AuthContext } from "./authContext";


const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const { token, logout } = useContext(AuthContext);

  const user = localStorage.getItem("username");
  const storedRoles = localStorage.getItem("roles");
  const roles = storedRoles ? JSON.parse(storedRoles) : {};
  const canAdd = roles["Admin"] !== undefined;
  const canUpdate =
    roles["Admin"] !== undefined || roles["Editor"] !== undefined;

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [token]);

  // Fetch employees from backend
  const fetchEmployees = async () => {
    const actualToken = typeof token === "string" ? token : token?.accessToken;
    console.log("Extracted Token before API call:", actualToken);
    if (!actualToken) {
      console.error("No valid token found!");
      return;
    }
    try {
      const response = await api.get("/employees", {
        headers: {
          Authorization: `Bearer ${actualToken}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        withCredentials: true,
      });

      console.log("Raw API Response:", response);

      if (response.status !== 200) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.data;
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Handle Add Employee
  const handleAdd = async () => {
    if (!canAdd) return alert("You don't have permission to add employees!");
    const firstname = prompt("Enter Employee first name:");
    const lastname = prompt("Enter Employee last name:");
    if (!firstname || !lastname) {
      alert("Please enter both first name and last name");
      return;
    }
    const actualToken = typeof token === "string" ? token : token?.accessToken;
    if (!actualToken) {
      alert("No valid token found!");
      return;
    }
    try {
      const response = await api.post(
        "/employees",
        {
          firstname,
          lastname,
        },
        {
          headers: {
            Authorization: `Bearer ${actualToken}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          withCredentials: true,
        }
      );

      console.log("Employee added successfully:", response.data);
      setOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee.");
    }
  };

  // Handle Update Employee
  const handleUpdate = async (employee) => {
    if (!canUpdate)
      return alert("You don't have permission to update employees!");
    setSelectedEmployee(employee);
    setOpen(true);
  };

  // Save Updated Employee
  const handleSave = async () => {
    if (!selectedEmployee) {
      alert("No employee selected!");
      return;
    }

    const actualToken = typeof token === "string" ? token : token?.accessToken;
    if (!actualToken) {
      alert("No valid token found!");
      return;
    }
    console.log("Making PUT request to:", api.defaults.baseURL + "/employees");
    try {
      const response = await api.put(
        "/employees",
        {
          _id: selectedEmployee._id, // Send ID as required by the backend
          firstname: selectedEmployee.firstname,
          lastname: selectedEmployee.lastname,
        },
        {
          headers: {
            Authorization: `Bearer ${actualToken}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
          withCredentials: true,
        }
      );

      console.log("Employee updated successfully:", response.data);
      setOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee.");
    }
  };

  // Handle Delete Employee
  const handleDelete = async (_id) => {
    if (!canAdd) return alert("You don't have permission to delete employees!");
    const actualToken = typeof token === "string" ? token : token?.accessToken;
    if (!actualToken) {
      alert("No valid token found!");
      return;
    }
    try {
      const response = await api.delete(`/employees/${_id}`, {
        headers: {
          Authorization: `Bearer ${actualToken}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log("Employee deleted successfully:", response.data);
      fetchEmployees();
    } catch (error) {
      console.error(
        "Error deleting employee:",
        error.response?.data || error.message
      );
      alert("Failed to delete employee.");
    }
  };

  const handleRedirect = () => {
    window.location.href = "/";
  };

  const handleLogOut = async () => {
    await logout();
  };

  return (
    <>
      {/* Fixed Navigation Bar */}
      <AppBar position="fixed" sx={{ backgroundColor: "#1E88E5" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Employee Portal
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<Home />}
              sx={{
                backgroundColor: "#FFC107",
                color: "#000",
                marginRight: 2,
                "&:hover": { backgroundColor: "#FFB300" },
              }}
              onClick={handleRedirect}
            >
              Main Page
            </Button>
            <Button
              variant="contained"
              startIcon={<ExitToApp />}
              sx={{
                backgroundColor: "#D32F2F",
                color: "#FFF",
                "&:hover": { backgroundColor: "#B71C1C" },
              }}
              onClick={handleLogOut}
            >
              Sign Out
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container style={{ marginTop: 80 }}>
        {/* Greeting Section */}
        <Box mb={3}>
          <Paper
            elevation={3}
            sx={{
              padding: "15px",
              background: "linear-gradient(45deg, #2196F3, #21CBF3)",
              color: "white",
              borderRadius: "10px",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              Hello, {user} 👋
            </Typography>
          </Paper>
        </Box>

        {/* Employee Management Title */}
        <Box textAlign="center" mt={3} mb={2}>
          <Typography variant="h5" fontWeight="bold">
            Employee Management
          </Typography>
        </Box>

        {/* Add Employee Button */}
        {canAdd ? (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={handleAdd}
            sx={{
              marginBottom: "15px",
              backgroundColor: "#4CAF50",
              "&:hover": { backgroundColor: "#45A049" },
            }}
          >
            Add Employee
          </Button>
        ) : null}

        {/* Employee Table */}
        <Box>
          <Paper elevation={3} sx={{ padding: "10px", borderRadius: "8px" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#EAEAEA" }}>
                  <TableCell>
                    <b>ID</b>
                  </TableCell>
                  <TableCell>
                    <b>First Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Last Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((emp, index) => (
                  <TableRow
                    key={emp._id}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#FAFAFA" : "white",
                      "&:hover": { backgroundColor: "#F1F1F1" },
                    }}
                  >
                    <TableCell>{emp.isd}</TableCell>
                    <TableCell>{emp.firstname}</TableCell>
                    <TableCell>{emp.lastname}</TableCell>
                    <TableCell>
                      {(canAdd || canUpdate) && (
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<Edit />}
                          onClick={() => handleUpdate(emp)}
                          sx={{
                            marginRight: "8px",
                            backgroundColor: "#1976D2",
                            "&:hover": { backgroundColor: "#115293" },
                          }}
                        >
                          Update
                        </Button>
                      )}
                      {canAdd && (
                        <Button
                          variant="contained"
                          color="secondary"
                          startIcon={<Delete />}
                          onClick={() => handleDelete(emp._id)}
                          sx={{
                            backgroundColor: "#D32F2F",
                            "&:hover": { backgroundColor: "#B71C1C" },
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>

        {/* Update Employee Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Update Employee</DialogTitle>
          <DialogContent>
            <TextField
              label="First Name"
              fullWidth
              value={selectedEmployee?.firstname || ""}
              onChange={(e) =>
                setSelectedEmployee({
                  ...selectedEmployee,
                  firstname: e.target.value,
                })
              }
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Last Name"
              fullWidth
              value={selectedEmployee?.lastname || ""}
              onChange={(e) =>
                setSelectedEmployee({
                  ...selectedEmployee,
                  lastname: e.target.value,
                })
              }
              sx={{ marginBottom: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default EmployeeTable;
