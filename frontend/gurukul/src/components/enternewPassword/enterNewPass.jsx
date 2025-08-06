import React, { useState } from "react";
import "./enterNewPass.css";
import { apiConnector } from '../../service/apiconnector';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux"; 
import { toast } from "react-hot-toast"; 
import { changePassword } from "../../service/apis";

const CHANGE_PASSWORD_API = "/api/v1/auth/changepassword"; // <-- Replace with your actual endpoint

function EnterNewPassword() {
  // Get user data (including email) from your Redux store's profile slice
  const  user  = useSelector((state) => state.profile.user);
  const  token  = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const { oldPassword, newPassword, confirmNewPassword } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // --- Password Validation Logic ---
  const validationRules = {
    lowercase: /[a-z]/,
    uppercase: /[A-Z]/,
    number: /\d/,
    specialChar: /[^A-Za-z0-9]/,
    minLength: /.{8,}/
  };

  const isValid = {
    lowercase: validationRules.lowercase.test(newPassword),
    uppercase: validationRules.uppercase.test(newPassword),
    number: validationRules.number.test(newPassword),
    specialChar: validationRules.specialChar.test(newPassword),
    minLength: validationRules.minLength.test(newPassword)
  };

  const allValid = Object.values(isValid).every(Boolean);
  const passwordsMatch = newPassword === confirmNewPassword;
  const handleReset = async (e) => {
    e.preventDefault(); 
    if (!allValid) {
        toast.error("New password does not meet all criteria.");
        return;
    }
    if (!passwordsMatch) {
        toast.error("New passwords do not match.");
        return;
    }
    const toastId = toast.loading("Updating...");
    try {
      // Create the payload
      const payload = {
        email: user.email, 
        oldPassword,
        newPassword,
        confirmNewPassword
      };

      // Call the API
      const response = await apiConnector("PUT", changePassword.CHANGE_PASSWORD_API,`Bearer ${token}`, payload);

      console.log("CHANGE PASSWORD API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password Changed Successfully!");
      navigate('/dashboard'); 

    } catch (error) {
      console.log("CHANGE PASSWORD API ERROR............", error);
      toast.error(error.response?.data?.message || "Could Not Change Password");
    }
    toast.dismiss(toastId);
  };

  const handleBack = () => {
    navigate('/dashboard/my-profile');
  };

  return (
    <form onSubmit={handleReset} className="reset-container">
      <h2>Choose new password</h2>
      <p className="subtitle">
        Almost done. Enter your new password and you're all set.
      </p>

      <div className="input-block">
        <label htmlFor="oldPassword">
          Old password <span>*</span>
        </label>
        <input
          required
          type="password"
          id="oldPassword"
          name="oldPassword"
          value={oldPassword}
          onChange={handleOnChange}
          placeholder="********"
        />
      </div>

      <div className="input-block">
        <label htmlFor="newPassword">
          New password <span>*</span>
        </label>
        <input
          required
          type="password"
          id="newPassword"
          name="newPassword"
          value={newPassword}
          onChange={handleOnChange}
          placeholder="********"
        />
      </div>

      <div className="input-block">
        <label htmlFor="confirmNewPassword">
          Confirm new password <span>*</span>
        </label>
        <input
          required
          type="password"
          id="confirmNewPassword"
          name="confirmNewPassword"
          value={confirmNewPassword}
          onChange={handleOnChange}
          placeholder="********"
        />
      </div>

      {/* Validation list only shows if user starts typing in the new password field */}
      {newPassword && (
        <ul className="validation-list">
          <li className={isValid.lowercase ? "valid" : ""}>✅ one lowercase character</li>
          <li className={isValid.uppercase ? "valid" : ""}>✅ one uppercase character</li>
          <li className={isValid.number ? "valid" : ""}>✅ one number</li>
          <li className={isValid.specialChar ? "valid" : ""}>✅ one special character</li>
          <li className={isValid.minLength ? "valid" : ""}>✅ 8 character minimum</li>
        </ul>
      )}

      <button type="submit" className="reset-btn">
        Reset Password
      </button>

      <div className="back-link" onClick={handleBack}>
        ← Back to My Profile
      </div>
    </form>
  );
}

export default EnterNewPassword;