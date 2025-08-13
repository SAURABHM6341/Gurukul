import React, { use, useState } from "react";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import { send_otp } from '../../service/apis'
import { apiConnector } from "../../service/apiconnector";
import { toast } from "react-hot-toast";
function Signup() {
    const  groupImage =  'https://res.cloudinary.com/dwwwmae9x/image/upload/v1755000033/groupImage_aezszj.png'
    const navigate = useNavigate();
    const [accType, setAccType] = useState("Student");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        localStorage.setItem("signupData", JSON.stringify({
            ...formData,
            accType: accType
        }));
        const payload = {
            email: formData.email
        }
        try {
            toast.loading("Sending OTP...");
            const otp_res = await apiConnector("POST", send_otp.SIGN_OTP_API,null, payload, null);
            if (otp_res.data.success) {
                toast.dismiss();
                toast.success("OTP sent successfully");
            }
        } catch (err) {
            toast.dismiss();
            toast.error(err.otp_res?.data?.message || "Please wait for atleast 5 min before new request");
        }

        navigate("/check_email");
    };
    const handleToggle = () => {
        setShowPassword(!showPassword);
    }
    const handleToggleconfirm = () => {
        setShowConfirm(!showConfirm);
    }

    return (
        <>
            <div className="signUpOpenContainer">
                <div className="signUpleft">
                    <div className="signup-container">
                        <h2>Join the millions learning to code with GuruKul for free</h2>
                        <p className="subheading">
                            Build skills for <span>today</span>, <span>tomorrow</span>, and <span>beyond</span>.{" "}
                            <em>Education to future-proof your career.</em>
                        </p>

                        {/* Toggle buttons */}
                        <div className="role-toggle">
                            <button
                                type="button"
                                className={accType === "Student" ? "active" : ""}
                                onClick={() => setAccType("Student")}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                className={accType === "Instructor" ? "active" : ""}
                                onClick={() => setAccType("Instructor")}
                            >
                                Instructors
                            </button>
                        </div>

                        <form className="signup-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name<span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="Enter first name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Last Name<span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        placeholder="Enter last name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email Address<span className="required">*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group password-field">
                                    <label>Create Password <span className="required">*</span></label>
                                    <div className="password-wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Enter Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div
                                            className="eye-icon"
                                            onClick={handleToggle}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group password-field">
                                    <label>Confirm Password <span className="required">*</span></label>
                                    <div className="password-wrapper">
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Enter Password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div
                                            className="eye-icon"
                                            onClick={handleToggleconfirm}
                                        >
                                            {showConfirm ? "Hide" : "Show"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="create-btn">Create Account</button>
                        </form>
                    </div>
                </div>
                <div className="signup-right">
                    <img src={groupImage} alt="" height="531px" width="585px" />
                </div>
            </div>
        </>
    );
}

export default Signup;
