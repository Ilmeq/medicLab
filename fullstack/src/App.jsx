// app.jsx
import React from "react";
import "./App.css"; // Ensure this file includes Tailwind directives or custom styles if needed
import Login from "./Components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import AddUser from "./Components/AddUser";
import EditUser from "./Components/EditUser";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/adminlogin" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/addUser" element={<AddUser />}></Route>
        <Route path="/editUser/:id" element={<EditUser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
