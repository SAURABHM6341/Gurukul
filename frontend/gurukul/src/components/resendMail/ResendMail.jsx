import React from "react";
import './ResendMail.css';

function ResendMail() {
  return (
    <div className="bda-resend-container">
        <div className="resend-container">
      <h2 className="resend-title">Check email</h2>
      <p className="resend-subtitle">
        We have sent the reset email to<br />
        <span className="email-highlight">youremailaccount@gmail.com</span>
      </p>

      <button className="resend-button">Resend email</button>

      <div className="resend-navigation">
        <div className="nav-option">
          <span className="back-arrow">←</span> Back to login
        </div>
        <div className="nav-option">
          <span className="forward-arrow">→</span> Proceed to dashboard
        </div>
      </div>
    </div>
    </div>
  );
}

export default ResendMail;
