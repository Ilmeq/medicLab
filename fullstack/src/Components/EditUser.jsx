import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import "./AddUser"; // Import the same CSS file

const EditUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState({
    id: "",
    username: "",
    password: "",
    name: "",
    orders: "",
    imageUrl: "",
    dateOfBirth: null,
    lastLoginDate: "",
    status: "",
  });
  const [error, setError] = useState({ orders: "" });
  const [showBlockPopup, setShowBlockPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/user/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setUser(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred while fetching user data.");
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!error.orders) {
      axios
        .put(`http://localhost:3000/auth/updateUser/${id}`, user)
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

  const handleBlock = () => {
    axios
      .put(`http://localhost:3000/auth/blockUser/${id}`)
      .then((result) => {
        if (result.data.Status) {
          setShowBlockPopup(true);
          setTimeout(() => {
            setShowBlockPopup(false);
            navigate("/dashboard");
          }, 2000);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred while blocking the user.");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 via-white to-green-300">
      <div className="modal-content">
        <button className="close-button" onClick={handleClose}>
          <IoIosCloseCircleOutline size={30} />
        </button>
        <h2 className="modal-title">Edit User</h2>
        <form onSubmit={handleSubmit} className="grid-form">
          <div className="grid-column">
            <div className="relative flex items-center">
              <label htmlFor="id" className="form-label mr-10">
                ID:
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={user.id}
                readOnly
                className="form-input"
              />
            </div>
            <div className="relative flex items-center">
              <label htmlFor="name" className="form-label mr-10">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="relative flex items-center">
              <label htmlFor="username" className="form-label mr-10">
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={user.username}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="relative flex items-center">
              <label htmlFor="orders" className="form-label mr-10">
                Orders (0-10):
              </label>
              <input
                type="text"
                id="orders"
                name="orders"
                value={user.orders}
                onChange={handleChange}
                className={`form-input ${error.orders ? "input-error" : ""}`}
              />
            </div>
            {error.orders && <p className="error-message">{error.orders}</p>}
          </div>
          <div className="grid-column">
            <div className="relative flex items-center">
              <label htmlFor="imageUrl" className="form-label mr-10">
                Image URL:
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={user.imageUrl}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="relative flex items-center">
              <label htmlFor="dateOfBirth" className="form-label  mr-16">
                Date of Birth:
              </label>
              <DatePicker
                selected={user.dateOfBirth}
                onChange={handleDateChange}
                placeholderText="Select Date of Birth"
                className="form-input"
              />
            </div>
            <div className="relative flex items-center">
              <label htmlFor="lastLoginDate" className="form-label mr-10">
                Last Login Date:
              </label>
              <input
                type="text"
                id="lastLoginDate"
                name="lastLoginDate"
                value={user.lastLoginDate}
                readOnly
                className="form-input"
              />
            </div>
            <div className="relative flex items-center">
              <label htmlFor="status" className="form-label mr-10">
                Status:
              </label>
              <input
                type="text"
                id="status"
                name="status"
                value={user.status}
                readOnly
                className="form-input"
              />
            </div>
          </div>
          <div className="button-container">
            <button type="submit" className="save-button">
              Save
            </button>
            <button
              type="button"
              onClick={handleBlock}
              className="block-button"
            >
              Block User
            </button>
          </div>
        </form>
        {showBlockPopup && (
          <div className="block-popup">User has been blocked.</div>
        )}
      </div>
    </div>
  );
};

export default EditUser;
