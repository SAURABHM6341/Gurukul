import React from "react";
import "./ResetPassword.css";

function ResetPassword() {
  return (
    <div className="resetsendotp-container">
      <h2 className="reset-title">Reset your password</h2>
      <p className="reset-description">
        Have no fear. We’ll email you instructions to reset your password. If you don’t have access to your email we can try account recovery
      </p>

      <form className="reset-form">
        <label htmlFor="email" className="reset-label">
          Email Address <span className="required">*</span>
        </label>
        <input
          type="email"
          id="email"
          className="reset-input"
          placeholder="myemailaddress@gmail.com"
        />

        <button type="submit" className="reset-button">
          Reset Password
        </button>

        <div className="back-to-login">
          <span>&larr;</span> Back to login
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
