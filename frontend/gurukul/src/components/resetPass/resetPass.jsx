import React, { useState } from "react";
import "./ResetPassword.css";
import { useNavigate } from "react-router-dom";
import { apiConnector } from "../../service/apiconnector";
import { resetpass } from '../../service/apis'
import { toast } from 'react-hot-toast'

function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const handleChange = (e) => {
    setEmail(e.target.value);
  }

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      toast.loading("sending otp please wait ");
      const payload = {
        email: email,
        
      }
      console.log("payload", payload);
      const response = await apiConnector("POST", resetpass.RESET_PASS_API, null, payload);
      if (response.data.success) {
        toast.dismiss();
        toast.success("otp sent to email");
        navigate('/verify_otp');
      }
      else {
        toast.dismiss();
        toast.error("something went wrong")
      }

    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.error(error.response.data.message);
    }
    const data = {
          email: email,
          purpose:"password-reset"
        }
        localStorage.setItem("resetData", JSON.stringify(data));
  }
  return (
    <div className="resetsendotp-container">
      <h2 className="reset-title">Reset your password</h2>
      <p className="reset-description">
        Have no fear. We’ll email you instructions to reset your password. If you don’t have access to your email we can try account recovery
      </p>

      <form className="reset-form" onSubmit={handleReset} >
        <label htmlFor="email" className="reset-label">
          Email Address <span className="required">*</span>
        </label>
        <input
          type="email"
          id="email"
          className="reset-input"
          onChange={handleChange}
          placeholder="myemailaddress@gmail.com"
        />

        <button type="submit" className="reset-button" >
          Reset Password
        </button>

        <div className="back-to-login" onClick={() => navigate('/login')} >
          <span>&larr;</span> Back to login
        </div>
        <div className="back-to-login" onClick={() => navigate('/verify_otp')} >
          <span>&rarr;</span> proceed to enter Otp
        </div>
      </form>
    </div>
  );
}

export default ResetPassword;
