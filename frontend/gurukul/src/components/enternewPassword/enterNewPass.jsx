import React, { useState, useEffect } from "react";
import "./enterNewPass.css";
import { apiConnector } from '../../service/apiconnector';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { changePassword, resetpassentry } from "../../service/apis";

function EnterNewPassword() {
  // Get user data (including email) from your Redux store's profile slice
  const user = useSelector((state) => state.profile.user);
  const token = useSelector((state) => state.auth.token);
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
  const resetData = JSON.parse(localStorage.getItem("resetData"));
  const isResetFlow = resetData?.purpose === "password-reset";
  useEffect(() => {
    if (isResetFlow && !resetData?.email) {
      toast.error("Invalid session. Please restart the reset process.");
      navigate("/check_email");
    }
  }, [isResetFlow, resetData, navigate]);
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

    if (!isResetFlow && !oldPassword.trim()) {
      toast.error("Old password is required.");
      return;
    }

    const toastId = toast.loading("Updating...");

    try {
      const emailToUse = isResetFlow ? resetData.email : user.email;

      const payload = {
        email: emailToUse,
        newpassword: newPassword,
        confirmPassword: confirmNewPassword,
      };

      if (isResetFlow) {
        payload.otp = resetData.otp;
        payload.purpose = resetData.purpose; // ✅ ADD THIS
      } else {
        payload.oldPassword = oldPassword;
      }

      const response = await apiConnector(
        "PUT",
        isResetFlow
          ? resetpassentry.RESET_PASS_ENTRY_API
          : changePassword.CHANGE_PASSWORD_API,
        isResetFlow ? null : `Bearer ${token}`,
        payload
      );

      console.log("CHANGE PASSWORD API RESPONSE:", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password Changed Successfully!");

      if (isResetFlow) {
        localStorage.removeItem("resetData");
        navigate("/login");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      console.log("CHANGE PASSWORD API ERROR:", error);
      toast.error(error?.response?.data?.message || "Could Not Change Password");
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
          required={!isResetFlow}
          type="password"
          id="oldPassword"
          name="oldPassword"
          value={oldPassword}
          onChange={handleOnChange}
          placeholder="********"
          disabled={isResetFlow}
          className={isResetFlow ? "faded-input" : ""}
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
      {!isResetFlow &&
        <div className="back-link" onClick={handleBack}>
          ← Back to My Profile
        </div>
      }{isResetFlow &&
        <div className="back-link" onClick={() => navigate('/login')}>
          ← Back to Login
        </div>
      }
    </form>
  );
}

export default EnterNewPassword;