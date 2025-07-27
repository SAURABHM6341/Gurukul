import React, { useState } from "react";
import girlImage from "../../assets/girlImage.png";
import './login.css'
function Login() {
  const [accType, setAccType] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

//     const payload = {
//       email,
//       password,
//       accType
//     };

//     try {
//       const response = await fetch("http://localhost:5000/api/v1/user/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         credentials: "include", // only if you are using cookies (optional)
//         body: JSON.stringify(payload)
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         console.error("Login failed:", data.message);
//         alert("Login failed: " + data.message);
//         return;
//       }

//       console.log("Login success:", data);
//       alert("Login Successful ✅");
//     } catch (err) {
//       console.error("Error during login:", err);
//       alert("An error occurred. See console for details.");
//     }
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
          </div>

          <form onSubmit={handleSubmit}>
            <div>
              <label>
                Email Address<span>*</span>
              </label>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>
                Password<span>* </span>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="forgot-password">
              <a href="#">Forgot password</a>
            </div>

            <div className="login-submit-form-button">
              <button type="submit">Sign in</button>
            </div>
          </form>
        </div>
        <div className="login-right" >
            <img src={girlImage} alt="" height="450px" width = "500px" />
        </div>
      </div>
    </>
  );
}

export default Login;
