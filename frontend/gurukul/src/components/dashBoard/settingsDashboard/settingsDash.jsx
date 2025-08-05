import React, { useEffect, useState } from 'react';
import './dashsetting.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { apiConnector } from '../../../service/apiconnector';
import { useLocation, Link, matchPath } from "react-router-dom";

export default function UserProfile() {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const matchRoute = (route) => {
            return matchPath({ path: route }, location.pathname);
        }
    const token = useSelector((state) => state.auth?.token);
    const user = useSelector((state) => state.profile?.user);
    console.log(user);

    const [formData, setFormData] = useState({
        profession: '',
        dob: '',
        gender: '',
        phone: '',
        about: ''
    });
    const defaultAvatar = `https://api.dicebear.com/9.x/initials/svg?seed=${user.Fname}%20${user.Lname}`

    const [profileImage, setProfileImage] = useState(user?.image || defaultAvatar);
    const handleLogout = () => {
        dispatch(clearUser());             // Clears user from Redux
        dispatch(clearToken());            // Clears token from Redux
        localStorage.removeItem("token"); // Also clear from localStorage
        localStorage.removeItem("user");
        toast.success("Logged out successfully");
        navigate("/login");
    };

    // useEffect(() => {
    //     const fetchProfile = async () => {
    //         try {
    //             const res = await apiConnector('GET', '/api/v1/profile/me', null, null, { Authorization: `Bearer ${token}` });
    //             const data = res.data;
    //             setFormData({
    //                 profession: data.profession || '',
    //                 dob: data.dob || '',
    //                 gender: data.gender || '',
    //                 phone: data.phone || '',
    //                 about: data.about || ''
    //             });
    //             setProfileImage(data.image || defaultAvatar);
    //         } catch (error) {
    //             console.error('Failed to fetch profile', error);
    //         }
    //     };
    //     fetchProfile();
    // }, [token]);

    // const handleUpdate = async () => {
    //     try {
    //         const payload = {
    //             profession: formData.profession,
    //             dob: formData.dob,
    //             gender: formData.gender,
    //             phone: formData.phone,
    //             about: formData.about,
    //             image: profileImage
    //         };
    //         await apiConnector('PUT', '/api/v1/profile/update', payload, null, { Authorization: `Bearer ${token}` });
    //     } catch (error) {
    //         console.error('Update failed', error);
    //     }
    // };

    // const handleDeleteAccount = async () => {
    //     try {
    //         await apiConnector('POST', '/api/v1/account/delete', null, null, { Authorization: `Bearer ${token}` });
    //         navigate('/dashboard');
    //     } catch (error) {
    //         console.error('Account deletion failed', error);
    //     }
    // };

    const handleRemoveImage = () => {
        setProfileImage(`https://api.dicebear.com/7.x/initials/svg?seed=${user.Fname + user.Lname}`);
    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePassChange = () => {
        navigate('/change_password')
    }
    // UserProfile.js

    return (


          <div className="profile-container">
                <h1>Edit Profile</h1>
                {/* Section 1: Change Profile Picture */}
                <div className="section">
                    <div className="image-block">
                        <img src={profileImage} alt="Profile" />
                        <div className="image-actions">
                            <p>Change Profile Picture</p>
                            <div>
                                <button className="btn yellow">Change</button>
                                <button
                                    className="btn gray"
                                onClick={handleRemoveImage}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Profile Information */}
                <div className="section">
                    <h3>Profile Information</h3>
                    <div className="form-grid">
                        {/* Display Name */}
                        <div className="form-group">
                            <label htmlFor="displayName">Display Name</label>
                            <input id="displayName" type="text" value={`${user.Fname} ${user.Lname}`} disabled />
                            <small>Name entered above will be used for all issued certificates.</small>
                        </div>

                        {/* Profession */}
                        <div className="form-group">
                            <label htmlFor="profession">Profession</label>
                            <select id="profession" name="profession" value={formData.profession} onChange={handleChange}>
                                <option value="">Select Profession</option>
                                <option value="Developer">Developer</option>
                                <option value="Designer">Designer</option>
                                <option value="Student">Student</option>
                                <option value="Instructor">Instructor</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Date of Birth */}
                        <div className="form-group">
                            <label htmlFor="dob">Date of Birth</label>
                            <input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                        </div>

                        {/* Gender */}
                        <div className="form-group">
                            <label>Gender</label>
                            <div className="gender">
                                <label><input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleChange} /> Male</label>
                                <label><input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleChange} /> Female</label>
                                <label><input type="radio" name="gender" value="Other" checked={formData.gender === 'Other'} onChange={handleChange} /> Other</label>
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <div className="phone-input">
                                <span>+91</span>
                                <input id="phone" name="phone" type="text" value={formData.phone} onChange={handleChange} placeholder="12345 67890" />
                            </div>
                        </div>

                        {/* About */}
                        <div className="form-group">
                            <label htmlFor="about">About</label>
                            <textarea id="about" name="about" placeholder="Enter Bio Details" value={formData.about} onChange={handleChange}></textarea>
                        </div>
                    </div>
                </div>

                {/* Section 3: Password */}
                <div className="section">
                    <h3>Password</h3>
                    <div className="changePassButton">
                        <button onClick={handlePassChange} className="btn yellow" >Change PassWord</button>
                    </div>
                </div>


                {/* Section 4: Delete Account */}
                <div className="section delete">
                    <div className="delete-icon"></div>
                    <div className="delete-content">
                        <h3>Delete Account</h3>
                        <p>Would you like to delete account?<br />This account contains Paid Courses. Deleting your account will remove all the contain associated with it.</p>
                        <button className="btn link">I want to delete my account.</button>
                    </div>
                </div>

                {/* Final Actions */}
                <div className="actions">
                    <button className="btn gray" onClick={() => navigate('/dashboard')}>Cancel</button>
                    <button className="btn yellow" /* onClick={handleUpdate} */>Save</button>
                </div>
            </div>

    );
}
