import React, { useState } from "react";
import "./enterNewPass.css";

function EnterNewPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validationRules = {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    number: /\d/,
    specialChar: /[^A-Za-z0-9]/,
    minLength: /.{8,}/
  };

  const isValid = {
    lowercase: validationRules.lowercase.test(password),
    uppercase: validationRules.uppercase.test(password),
    number: validationRules.number.test(password),
    specialChar: validationRules.specialChar.test(password),
    minLength: validationRules.minLength.test(password)
  };

  const allValid = Object.values(isValid).every(Boolean);
  const passwordsMatch = password === confirmPassword;

  const handleReset = () => {
    if (allValid && passwordsMatch) {
      alert("Password reset successfully!");
    } else {
      alert("Password does not meet all criteria or mismatch.");
    }
  };

  return (
    <div className="reset-container">
      <h2>Choose new password</h2>
      <p className="subtitle">
        Almost done. Enter your new password and you're all set.
      </p>

      <div className="input-block">
        <label>
          New password <span>*</span>
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
        />
      </div>

      <div className="input-block">
        <label>
          Confirm new password <span>*</span>
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="********"
        />
      </div>

      <ul className="validation-list">
        <li className={isValid.lowercase ? "valid" : ""}>✅ one lowercase character</li>
        <li className={isValid.uppercase ? "valid" : ""}>✅ one uppercase character</li>
        <li className={isValid.number ? "valid" : ""}>✅ one number</li>
        <li className={isValid.specialChar ? "valid" : ""}>✅ one special character</li>
        <li className={isValid.minLength ? "valid" : ""}>✅ 8 character minimum</li>
      </ul>

      <button className="reset-btn" onClick={handleReset}>
        Reset Password
      </button>

      <div className="back-link">
        ← Back to login
      </div>
    </div>
  );
}

export default EnterNewPassword;
