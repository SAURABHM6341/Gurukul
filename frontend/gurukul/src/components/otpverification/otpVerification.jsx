import React, { useRef } from "react";
import './otpVerifications.css';
import { useNavigate } from "react-router-dom";
import { apiConnector } from '../../service/apiconnector';
import { verify_otp } from '../../service/apis';
import { toast } from "react-hot-toast";

function VerifyEmail() {
  const inputs = useRef([]);

  const handleInput = (e, i) => {
    const value = e.target.value;

    // Allow only numbers
    if (!/^\d?$/.test(value)) return;

    inputs.current[i].value = value;

    if (value && i < 5) {
      inputs.current[i + 1].focus();
    } else if (!value && i > 0) {
      // If backspace and empty, move to previous input
      inputs.current[i - 1].focus();
    }
  };

  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/login');
  };
  const handleResend = () => {
    navigate('/check_email');
  };
  const handleVerifyOTP = async () => {
    const otp = inputs.current.map(input => input.value).join('');

    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      const formData = JSON.parse(localStorage.getItem("signupData"));

      const payload = {
        email: formData.email,
        otp: otp,
        Fname: formData.firstName,
        Lname: formData.lastName,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        accountType: formData.accType
      };
      const verification_res = await apiConnector("POST", verify_otp.SIGN_OTP_VERIFY_API, {}, payload, null);
      if (verification_res.data.success) {
        toast.success("Email verified and SignUp is completed");
      }
      navigate('/login');
      localStorage.removeItem("signupData");
    } catch (error) {
      toast.error(error.verification_res.data.message);
    }
  }
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
      <button className="verify-btn" onClick={handleVerifyOTP} >Verify email</button>
      <div className="verify-options">
        <span onClick={handleLogin} >← Back to login</span>
        <span className="resend-link" onClick={handleResend} >🔄 Resend it</span>
      </div>
    </div>
  );
}

export default VerifyEmail;
