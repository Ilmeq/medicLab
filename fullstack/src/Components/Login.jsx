import React, { useState } from "react";
import "./Login.css"; // Import custom CSS for noise texture and loader animation
import axios from "axios";
import { useNavigate } from "react-router-dom";
import adminlogo from "../../src/assets/adminlogo.png";

const Login = () => {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:3000/auth/adminlogin", values)
      .then((result) => {
        if (result.data.loginStatus) {
          navigate("/dashboard");
        } else {
          setError(result.data.Error);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
    setIsLoading(true);

    // Simulate a login process with a timeout
    setTimeout(() => {
      setIsLoading(false);
      // Handle the form submission logic here (e.g., API call)
    }, 2000);
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 via-white to-green-300">
      <div className="p-8 rounded-lg w-1/4 bg-white bg-opacity-75 backdrop-filter backdrop-blur-md shadow-neumorph">
        <div className="flex items-center justify-center mb-6">
          <img src={adminlogo} alt="Admin Logo" className="w-12 h-12 mr-1" />
          <h1 className="text-4xl font-bold text-gray-800">MedicLab</h1>
        </div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Log In to Your Account
        </h2>

        {error && (
          <div className="flex justify-center mb-4">
            <div className="chat-frame">
              <div className="chat-bubble text-red-600">{error}</div>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex items-center">
            <i className="fas fa-user absolute left-3 text-gray-500"></i>
            <input
              type="text"
              name="username"
              autoComplete="off"
              placeholder="Enter Username"
              onChange={(e) =>
                setValues({ ...values, username: e.target.value })
              }
              className={`pl-10 p-3 rounded-lg border bg-white bg-opacity-20 shadow-input focus:outline-none w-full ${
                error ? "border-red-500" : "focus:ring-2 focus:ring-green-700"
              }`}
            />
          </div>
          <div className="relative flex items-center">
            <i className="fas fa-lock absolute left-3 text-gray-500"></i>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              className={`pl-10 p-3 rounded-lg border bg-white bg-opacity-20 shadow-input focus:outline-none w-full ${
                error ? "border-red-500" : "focus:ring-2 focus:ring-green-700"
              }`}
            />
          </div>
          <button
            className="relative text-green-700 w-full py-3 rounded-lg flex justify-center items-center shadow-neumorph overflow-hidden btn p-4 border-2 uppercase shadow bg-transparent hover:delay-[.5s] transition-all duration-500 hover:text-white before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-0 before:transition-all before:duration-500 before:bg-green-700 before:hover:w-full after:absolute after:left-0 after:bottom-0 after:h-0 after:w-full after:transition-all after:duration-500 after:bg-green-600 after:hover:h-full after:text-white after:-z-10 after:hover:delay-[0.4s]"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <div className="loader"></div> : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
