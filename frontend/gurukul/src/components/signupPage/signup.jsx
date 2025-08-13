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

    // --- Password Validation Logic ---
    const validationRules = {
        lowercase: /[a-z]/,
        uppercase: /[A-Z]/,
        number: /\d/,
        specialChar: /[^A-Za-z0-9]/,
        minLength: /.{8,}/
    };

    const isValid = {
        lowercase: validationRules.lowercase.test(formData.password),
        uppercase: validationRules.uppercase.test(formData.password),
        number: validationRules.number.test(formData.password),
        specialChar: validationRules.specialChar.test(formData.password),
        minLength: validationRules.minLength.test(formData.password)
    };

    const allValid = Object.values(isValid).every(Boolean);
    const passwordsMatch = formData.password === formData.confirmPassword;

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
                try {
        // Validate password criteria
        if (!allValid) {
            toast.dismiss();
            toast.error("Password does not meet all criteria.");
            return;
        }

        // Check if passwords match
        if (!passwordsMatch) {
            toast.dismiss();
            toast.error("Passwords do not match.");
            return;
        }

        toast.dismiss();
        toast.loading("Creating account...");
        
        localStorage.setItem("signupData", JSON.stringify({
            ...formData,
            accType: accType
        }));
        const payload = {
            email: formData.email
        }

            toast.dismiss();
            toast.loading("Sending OTP...");
            const otp_res = await apiConnector("POST", send_otp.SIGN_OTP_API,null, payload, null);
            if (otp_res.data.success) {
                toast.dismiss();
                toast.success("OTP sent successfully");
            }
        } catch (err) {
            toast.dismiss();
            toast.error(err.response?.data?.message );
            console.log(err);
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

                            {/* Password Validation Display */}
                            {formData.password && (
                                <ul className="validation-list">
                                    <li className={isValid.lowercase ? "valid" : ""}>✅ one lowercase character</li>
                                    <li className={isValid.uppercase ? "valid" : ""}>✅ one uppercase character</li>
                                    <li className={isValid.number ? "valid" : ""}>✅ one number</li>
                                    <li className={isValid.specialChar ? "valid" : ""}>✅ one special character</li>
                                    <li className={isValid.minLength ? "valid" : ""}>✅ 8 character minimum</li>
                                    <li className={passwordsMatch && formData.confirmPassword ? "valid" : ""}>✅ passwords match</li>
                                </ul>
                            )}

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
