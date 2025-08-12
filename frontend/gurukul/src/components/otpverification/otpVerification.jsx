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
      toast.dismiss();
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      // Try loading resetData first
      const resetData = JSON.parse(localStorage.getItem("resetData"));
      const signupData = JSON.parse(localStorage.getItem("signupData"));

      let payload, apiUrl, nextRoute;

      if (resetData?.email && resetData?.purpose === "password-reset") {
        nextRoute = "/changePasswordOTP";
        // Store verified OTP for next step
        const updatedResetData = {
          ...resetData,
          otp,
        };
        localStorage.setItem("resetData", JSON.stringify(updatedResetData));
        navigate(nextRoute);
      } else if (signupData?.email) {
        // Signup flow
        payload = {
          email: signupData.email,
          otp: otp,
          Fname: signupData.firstName,
          Lname: signupData.lastName,
          password: signupData.password,
          confirmPassword: signupData.confirmPassword,
          accountType: signupData.accType
        };
        apiUrl = verify_otp.SIGN_OTP_VERIFY_API;
        nextRoute = "/login";
        const verification_res = await apiConnector("POST", apiUrl, {}, payload, null);

        if (verification_res.data.success) {
          toast.dismiss();
          toast.success("OTP verified successfully");

          localStorage.removeItem("signupData");
          navigate(nextRoute);
        }
      } else {
        toast.dismiss();
        toast.error("No OTP verification context found.");
        return;
      }

    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error(error?.response?.data?.message || "OTP verification failed");
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
      <button className="verify-btn" onClick={handleVerifyOTP} >Verify email</button>
      <div className="verify-options">
        <span onClick={handleLogin} >← Back to login</span>
        <span className="resend-link" onClick={handleResend} >🔄 Resend it</span>
      </div>
    </div>
  );
}

export default VerifyEmail;
