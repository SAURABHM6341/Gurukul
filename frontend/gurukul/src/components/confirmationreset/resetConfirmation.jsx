import React from "react";
import './resetConfirmation.css';

function ResetComplete() {
  return (
    <div className="resetconf-container">
      <h2>Reset complete!</h2>
      <p>All done! We have sent an Confirmation email to Your Registered Mail id</p>
      <button className="return-btn">Return to login</button>
      <div className="back-link">← Back to login</div>
    </div>
  );
}

export default ResetComplete;
