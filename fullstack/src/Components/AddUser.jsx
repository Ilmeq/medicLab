import React, { useState } from "react";
import "./AddUser.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddUser = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
    name: "",
    orders: "",
    imageUrl: "",
    dateOfBirth: null,
  });

  const [error, setError] = useState({ orders: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!error.orders) {
      axios
        .post("http://localhost:3000/auth/addUser", user)
        .then((result) => {
          console.log(result.data);
          navigate("/dashboard");
        })
        .catch((err) => console.log(err));
    }
  };

  const handleClose = () => {
    navigate("/dashboard");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    if (name === "orders") {
      if (isNaN(value) || value < 0 || value > 10) {
        setError({ ...error, orders: "Only 0-10 values are permissible." });
      } else {
        setError({ ...error, orders: "" });
      }
    }
  };

  const handleDateChange = (date) => {
    setUser({ ...user, dateOfBirth: date });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 via-white to-green-300">
      <div className="add-modal-content">
        <button className="close-button" onClick={handleClose}>
          <IoIosCloseCircleOutline size={30} />
        </button>
        <h2 className="modal-title">Add User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            onChange={handleChange}
            className="form-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
            className="form-input"
          />
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            onChange={handleChange}
            className="form-input"
          />
          <input
            type="text"
            name="orders"
            placeholder="Enter Orders (0-10)"
            onChange={handleChange}
            className={`form-input ${error.orders ? "input-error" : ""}`}
          />
          {error.orders && <p className="error-message">{error.orders}</p>}
          <input
            type="text"
            name="imageUrl"
            placeholder="Enter Image URL"
            onChange={handleChange}
            className="form-input"
          />
          <DatePicker
            selected={user.dateOfBirth}
            onChange={handleDateChange}
            placeholderText="Select Date of Birth"
            className="form-input"
          />
          <div className="button-container-centered">
            <button type="submit" className="save-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
