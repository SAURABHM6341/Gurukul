import React, { useRef } from "react";
import './otpVerifications.css';

function VerifyEmail() {
  const inputs = useRef([]);

  const handleInput = (e, i) => {
    const value = e.target.value;
    if (value.length === 1 && i < 5) {
      inputs.current[i + 1].focus();
    }
  };

  return (
    <div className="verify-container">
      <h2>Verify Yourself</h2>
      <p>A verification code has been sent to your registered email Id. Enter the code below</p>
      <div className="otp-boxes">
        {[...Array(6)].map((_, i) => (
          <input
            key={i}
            maxLength="1"
            onChange={(e) => handleInput(e, i)}
            ref={(el) => (inputs.current[i] = el)}
          />
        ))}
      </div>
      <button className="verify-btn">Verify email</button>
      <div className="verify-options">
        <span>← Back to login</span>
        <span className="resend-link">🔄 Resend it</span>
      </div>
    </div>
  );
}

export default VerifyEmail;
