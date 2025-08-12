import React, { useEffect } from "react";
import './ResendMail.css';
import { send_otp } from '../../service/apis'
import { apiConnector } from "../../service/apiconnector";
import {toast} from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
function ResendMail() {
  const formData = JSON.parse(localStorage.getItem("signupData"));
  const payload = {
    email: formData.email
  }
  const handleResend = async () => {
    try {
      const otp_res = await apiConnector("POST", send_otp.SIGN_OTP_API, {}, payload, null);
      if (otp_res.data.success) {
        toast.dismiss();
        toast.success("OTP resend successfully"); 
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err.otp_res?.data?.message||"Please wait for atleast 5 min before new request");
    }
  }
  const navigate = useNavigate();
  const handleOTP = ()=>{
    navigate('/verify_otp');
  }
  return (
    <div className="bda-resend-container">
      <div className="resend-container">
        <h2 className="resend-title">Check email</h2>
        <p className="resend-subtitle">
          We have sent the reset email to<br />
          <span className="email-highlight">{formData.email}</span>
        </p>

        <button className="resend-button" onClick={handleResend} >Resend email</button>

        <div className="resend-navigation">
          <Link to={'/login'} >
          <div className="nav-option">
            <span className="back-arrow">←</span> Back to login
          </div>
          </Link>
          <div className="nav-option">
            <Link to={'/verify_otp'}>
              <div className="nav-option" onClick={handleOTP} >
                <span className="forward-arrow">→</span>
                Proceed to Enter OTP
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResendMail;
