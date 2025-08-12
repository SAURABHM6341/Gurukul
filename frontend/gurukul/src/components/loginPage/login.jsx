import React, { useState } from "react";
import girlImage from "../../assets/girlImage.png";
import './login.css'
import { apiConnector } from "../../service/apiconnector";
import { LoGin } from "../../service/apis";
import { Toaster, toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../../context/slices/authslice";
import { setUser } from "../../context/slices/profileSlice";
function Login() {
  const [accType, setAccType] = useState("Student");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => {
    setShowPassword(!showPassword);
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  //Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      email: formData.email,
      password: formData.password,
      accType
    };
    try {
      const toastId = toast.loading("Logging in...");
      const response = await apiConnector("POST", LoGin.LOGIN_API, {}, payload, null);
      if (response.data.success) {
        toast.dismiss(toastId);
        toast.success("Logged in successfully!");
        const session_ttl = 3 * 24 * 60 * 60 * 1000;
        const logintime = Date.now();
        const expiryTime = logintime + session_ttl;
        const userData = response?.data?.user;
        console.log("userdata line 47 in login.jsx", userData);
        const token = response?.data?.token;
        console.log("token line 49 in login.jsx", token);
        dispatch(setToken(token));
        dispatch(setUser(userData));
        localStorage.setItem("user", JSON.stringify({
          value: userData,
          expiry: expiryTime
        }));
        localStorage.setItem("token", JSON.stringify({
          value: token,
          expiry: expiryTime
        }));
        navigate('/')

      } else {
        toast.dismiss(toastId);
        toast.error(response.data.message || "Login failed!");
      }
      console.log("login was successfull", response);
    } catch (err) {
      console.error("Error during login:", err);
      toast.dismiss(toastId);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };


  return (
    <>
      <div className="loginPage">
        <div className="login-left">
          {/* Heading */}
          <div className="welcome-heading">
            <h2>Welcome Back</h2>
            <p>
              Build skills for <span>today</span>, <span>tomorrow</span>, and <span>beyond</span>.{" "}
              <em>Education to future-proof your career.</em>
            </p>
          </div>

          {/* Account Type Toggle */}
          <div className="login-acctype-buttons">
            <button
              className={accType === "Student" ? "active" : ""}
              onClick={() => setAccType("Student")}
              type="button"
            >
              Student
            </button>
            <button
              className={accType === "Instructor" ? "active" : ""}
              onClick={() => setAccType("Instructor")}
              type="button"
            >
              Instructor
            </button>
            <button
              className={accType === "Admin" ? "active" : ""}
              onClick={() => setAccType("Admin")}
              type="button"
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div>
              <label>
                Email Address<span>*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>
                Password<span>* </span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div
              className="eye-icon"
              onClick={handleToggle}
            >
              {showPassword ? "Hide" : "Show"}
            </div>

            <div className="forgot-password">
              <Link to={'/resetPassword'}  >Forgot password</Link>
            </div>

            <div className="login-submit-form-button">
              <button type="submit">Sign in</button>
            </div>
          </form>
        </div>
        <div className="login-right" >
          <img src={girlImage} alt="" height="450px" width="500px" />
        </div>
      </div>
    </>
  );
}

export default Login;
