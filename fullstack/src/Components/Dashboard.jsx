import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CiLogout, CiSearch } from "react-icons/ci";
import { MdOutlineDashboard } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import adminlogo from "../assets/adminlogo.png";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchError, setSearchError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/user")
      .then((result) => {
        if (result.data.Status) {
          setUser(result.data.Result);
          setFilteredUsers(result.data.Result); // Initialize filtered users
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred while fetching users.");
      });
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(user);
      setSearchError("");
    } else {
      const results = user.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.id.toString().includes(searchQuery)
      );
      setFilteredUsers(results);
      setSearchError(results.length === 0 ? "Item not found" : "");
    }
  }, [searchQuery, user]);

  axios.defaults.withCredentials = true;
  const handleLogout = () => {
    axios
      .post("http://localhost:3000/auth/logout")
      .then((response) => {
        if (response.data.Status) {
          localStorage.removeItem("username"); // Clear username on logout
          navigate("/adminlogin");
        } else {
          alert(response.data.Error);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred while logging out.");
      });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Retrieve the username of the logged-in user from local storage
  const loggedInUser = localStorage.getItem("username") || "User";

  return (
    <div className=" mx-auto min-h-screen bg-gradient-to-br from-green-100 via-white to-green-300 flex flex-col lg:flex-row px-4 relative">
      {/* Sidebar */}
      <div
        className={`fixed lg:relative top-6 left-3 w-3/4 lg:w-1/5 h-full lg:h-full bg-white bg-opacity-90 backdrop-filter backdrop-blur-md shadow-neumorph flex flex-col justify-between transition-transform duration-300 lg:transform-none ${
          sidebarOpen
            ? "transform translate-x-0 z-50"
            : "transform -translate-x-full lg:translate-x-0 "
        }`}
      >
        <div className="flex flex-col pt-6 px-6 ">
          <div className="flex items-center mb-10 ">
            <img src={adminlogo} alt="Logo" className="  w-16 h-16 mr-0" />
            <h1 className="text-4xl font-bold text-gray-800">MedicLab</h1>
          </div>
          <ul className="flex flex-col space-y-4">
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center text-lg font-bold py-3 px-4 rounded-3xl shadow-neumorph transition-all duration-200 w-full ${
                  location.pathname === "/dashboard"
                    ? "bg-green-300 text-white border border-green-700"
                    : "text-gray-800 hover:text-green-700 hover:bg-green-100"
                }`}
              >
                <MdOutlineDashboard className="mr-2" /> Dashboard
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className={`flex items-center text-lg font-bold py-3 px-4 rounded-3xl shadow-neumorph transition-all duration-200 w-full ${
                  location.pathname === "/logout"
                    ? "bg-red-500 text-white border border-red-900"
                    : "text-gray-800 hover:text-red-700 hover:bg-red-100 hover:border-red-900"
                }`}
              >
                <CiLogout className="mr-2" /> Logout
              </button>
            </li>
          </ul>
          <div className="text-center pt-96 pb-20">
            <p className="text-gray-800 text-xl font-medium">Welcome</p>
          </div>
        </div>
      </div>

      {/* Hamburger Menu Icon */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white bg-opacity-10 backdrop-filter backdrop-blur-md shadow-neumorph rounded-full"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <GiHamburgerMenu size={24} />
      </button>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-6 lg:pl-6">
        {/* Search and Add User */}
        <div className=" p-6 bg-white bg-opacity-90 backdrop-filter backdrop-blur-md shadow-neumorph flex items-center justify-between fixed top-0 left-0 right-0 z-40 lg:static lg:top-auto lg:left-auto lg:right-auto lg:flex-row flex-col">
          <div className="relative w-full lg:w-3/4 mb-4 lg:mb-0">
            <CiSearch className="absolute left-4 top-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 p-3 rounded-3xl border bg-white bg-opacity-20 shadow-input focus:outline-none w-full"
            />
            {searchError && (
              <div className="text-red-600 mt-2">{searchError}</div>
            )}
          </div>

          <Link
            to="/addUser"
            className="flex items-center bg-green-300 text-gray-700  py-2 px-4 rounded-3xl shadow-neumorph transition-all duration-500 hover:bg-green-500 hover:text-white button"
          >
            <FaPlus className="mr-2" /> Add User
          </Link>
        </div>

        {/* Users Table */}
        <div className="  pt-32 lg:pt-6 p-6 bg-white bg-opacity-90 backdrop-filter backdrop-blur-md shadow-neumorph">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Users</h2>
          <table className="w-full text-left table-auto ">
            <thead>
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Last Login Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr
                  key={u.id}
                  className="transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer"
                  onClick={() => navigate(`/editUser/${u.id}`)}
                >
                  <td className="border px-6 py-2">{u.id}</td>
                  <td className="border px-6 py-2 flex items-center space-x-3">
                    <span>{u.name}</span>
                  </td>
                  <td className="border px-6 py-2">{u.username}</td>
                  <td className="border px-6 py-2">{u.lastLoginDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
