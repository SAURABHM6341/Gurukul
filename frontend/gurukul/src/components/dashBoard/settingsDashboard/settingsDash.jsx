import React, { useEffect, useState } from 'react';
import './dashsetting.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiConnector } from '../../../service/apiconnector';
import { additonalProfileApi, additonalProfileApiUpdate, updateUserImage,removeUserImage,deleteAccount } from '../../../service/apis';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../context/slices/profileSlice'
export default function UserProfile() {
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth?.token);
    const user = useSelector((state) => state.profile?.user);
    const dispatch = useDispatch();
        const [deleteAcc,setDeleteAccount] = useState(false);
    const [formData, setFormData] = useState({
        dateOfBirth: '',
        gender: '',
        contactNumber: '',
        about: ''
    });

    const defaultAvatar = `https://api.dicebear.com/9.x/initials/svg?seed=${user?.Fname || 'U'}%20${user?.Lname || 'N'}`;
    const [profileImage, setProfileImage] = useState(null);
    const [isImageUploading, setIsImageUploading] = useState(false);


    const additonalDetailsres = async () => {
        try {
            const response = await apiConnector("GET", additonalProfileApi.PROFILE_INFO_API, `Bearer ${token}`);
            if (response.data.success) {
                const details = response.data.userDetails.additionalDetails;
                toast.dismiss();
                toast.success("Profile details fetched");

                setFormData({
                    dateOfBirth: details.dateOfBirth?.split('T')[0] || '',
                    gender: details.gender || '',
                    contactNumber: details.contactNumber || '',
                    about: details.about || ''
                });

                setProfileImage(user?.image || defaultAvatar);
            } else {
                toast.dismiss();
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.log(error);
            toast.dismiss();
            toast.error("Cannot fetch profile details");
        }
    };

    useEffect(() => {
        if (user) {
            additonalDetailsres();
        }
    }, [user]);

    const handleUpdate = async () => {
        try {
            toast.loading("Updating details")
            const payload = {
                ...formData
            };
            await apiConnector('PUT', additonalProfileApiUpdate.PROFILE_INFO_UPDATE_API, `Bearer ${token}`, payload);
            toast.dismiss();
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error('Update failed', error);
            toast.dismiss();
            toast.error("Update failed");
        }
    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };



    const handlePassChange = () => {
        navigate('/change_password');
    };

    if (!user || !formData) {
        return <>Loading...</>;
    }
    const handleImageChange = async (event) => {
        toast.loading("Uploading Image")
        const file = event.target.files[0];

        if (!file) {
            toast.dismiss();
            toast.error("No image selected.");
            return;
        }

        const formData1 = new FormData();
        setIsImageUploading(true);
        formData1.append("image", file);

        try {
            const response = await apiConnector("PUT", updateUserImage.UPDATE_API_USER_IMAGE, `Bearer ${token}`, formData1);

            if (response?.data?.success) {
                toast.dismiss();
                toast.success("Image updated successfully");
                dispatch(setUser(response.data.updatedUser));
                localStorage.setItem("user", JSON.stringify(response.data.updatedUser));
            } else {
                toast.dismiss();
                toast.error("Failed to update image");
            }

        } catch (error) {
            console.error("Image update error:", error);
            toast.dismiss();
            toast.error("Something went wrong");
        } finally {
            setIsImageUploading(false); // 🔁 Hide loader
        }
    };
    const handleRemoveImage = async () => {
        try {
            toast.loading("Removing...")
            setIsImageUploading(true);
            const payload ={
                Fname : user.Fname,
                Lname : user.Lname,
            }

            const response = await apiConnector("PUT", removeUserImage.REMOVE_API_USER_IMAGE, `Bearer ${token}`,payload);

            if (response?.data?.success) {
                toast.dismiss();
                toast.success("Profile image reset to default");
                dispatch(setUser(response.data.updatedUser));
                localStorage.setItem("user", JSON.stringify(response.data.updatedUser));
            } else {
                toast.dismiss();
                toast.error("Failed to reset image");
            }
        } catch (error) {
            console.error("Error resetting image:", error);
            toast.dismiss();
            toast.error("Something went wrong");
        } finally {
            setIsImageUploading(false);
        }

    };

    const handleDeleteAccount = async()=>{
        if(window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try{
                const response = await apiConnector("PUT", deleteAccount.DELETE_ACCOUNT_API, `Bearer ${token}`);
                if(response?.data?.success) {
                    toast.dismiss();
                    toast.success("Account deleted Initiated");
                    setDeleteAccount(true);

                } else {
                    toast.dismiss();
                    toast.error("Failed to delete account");
                }
            }catch(error) {
                console.error("Error deleting account:", error);
                toast.error("Something went wrong while deleting account");
            }
        }
    }
    const cancelDeleteAccount=async()=>{
    try {
            const response = await apiConnector("PUT", deleteAccount.CANCEL_DELETE_ACCOUNT_API, `Bearer ${token}`);
            if(response?.data?.success) {
                toast.dismiss();
                toast.success("Account deletion cancelled");
                setDeleteAccount(false);
            } else {
                toast.dismiss();
                toast.error("Failed to cancel account deletion");
            }
        } catch (error) {
            console.error("Error cancelling account deletion:", error);
            toast.dismiss();
            toast.error("Something went wrong while cancelling account deletion");
        }
    }
    return (
        <div className="profile-container">
            <h1>Edit Profile</h1>

            {/* Section 1: Profile Picture */}
            <div className="section">
                <div className="image-block">
                    {isImageUploading && <p style={{ color: 'orange', fontWeight: 'bold' }}>Changing...</p>}
                    <img src={profileImage} alt="Profile" />
                    <div className="image-actions">
                        <p>Change Profile Picture</p>
                        <input
                            type="file"
                            id="profile-image-input"
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <div>

                            <button className="btn yellow" onClick={() => document.getElementById('profile-image-input').click()} >Change</button>
                            <button className="btn gray" onClick={handleRemoveImage}>Remove</button>
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
                        <small>Name will be used for certificates.</small>
                    </div>

                    {/* Date of Birth */}
                    <div className="form-group">
                        <label htmlFor="dateOfBirth">Date of Birth</label>
                        <input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                        />
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
                        <label htmlFor="contactNumber">Phone Number</label>
                        <div className="phone-input">
                            <span>+91</span>
                            <input
                                id="contactNumber"
                                name="contactNumber"
                                type="text"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                placeholder="12345 67890"
                            />
                        </div>
                    </div>

                    {/* About */}
                    <div className="form-group">
                        <label htmlFor="about">About</label>
                        <textarea
                            id="about"
                            name="about"
                            placeholder="Enter Bio Details"
                            value={formData.about}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            {/* Section 3: Password */}
            <div className="section">
                <h3>Password</h3>
                <div className="changePassButton">
                    <button onClick={handlePassChange} className="btn yellow">Change Password</button>
                </div>
            </div>

            {/* Section 4: Delete Account */}
            <div className="section delete">
                <div className="delete-icon"></div>
                <div className="delete-content">
                    <h3>Delete Account</h3>
                    <p>
                        Would you like to delete account?
                        <br />
                        This account contains paid courses. Deleting your account will remove all associated content.
                    </p>
                    {
                        deleteAcc &&
                       <div> <p className="delete-success">Account deletion initiated. You will receive an email confirmation.</p>  
                        <button className="btn link" onClick={cancelDeleteAccount} >I want to cancel the request</button>
                        <p>if you don't want to cancel request please logout </p>
                        <p>User may able to see their details after account deletion but once you logout evrything will be deleted </p>
                        </div>
                        
                    }
                    { !deleteAcc &&
                    <button className="btn link" onClick={handleDeleteAccount} >I want to delete my account.</button>
                    }
                </div>
            </div>

            {/* Final Actions */}
            <div className="actions">
                <button className="btn gray" onClick={() => navigate('/dashboard')}>Cancel</button>
                <button className="btn yellow" onClick={handleUpdate}>Save</button>
            </div>
        </div>
    );
}
