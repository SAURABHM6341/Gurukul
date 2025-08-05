import React from "react";
import { useSelector } from "react-redux";
import './studentDash.css';
import { useNavigate } from "react-router-dom";
function StuDashboard() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.profile?.user);
    const handleEdit=()=>{
        navigate("/dashboard/setting");
    }
    // A fallback user object to prevent errors if user is null during initial render
    const safeUser = user || {};

    return (

            <div className="dashboardRight">
                <div className="headingprofileMine">My Profile</div>
                <div className="detailsProfile">
                    <div className="nameEmailUserphoto">
                        <div className="ProfilePhoto">
                            <img src={safeUser.image} alt={`${safeUser.Fname}'s profile`} />
                        </div>
                        <div className="nameEmail">
                            <div className="namefUser">{safeUser.Fname} {safeUser.Lname}</div>
                            <div className="emailuser">{safeUser.email}</div>
                        </div>
                    </div>
                   
                    <div className="moreDetails">
                        <div className="personalDetailsDiv">
                            <div className="headingPersonal">
                                Personal Details
                            </div>
                            <div className="detailsPersonal">
                                <div className="nameProfile">
                                    <div className="FnameDiv">
                                        <div className="FnameTitle">First Name</div>
                                        <div className="FnameUser">{safeUser.Fname}</div>
                                    </div>
                                    <div className="LnameDiv">
                                        <div className="LnameTitle">Last Name</div>
                                        <div className="LnameUser">{safeUser.Lname}</div>
                                    </div>
                                </div>
                                <div className="emailProfile">
                                    <div className="EmailDiv">
                                        <div className="EmailTitle">E-mail</div>
                                        <div className="FnameUser">{safeUser.email}</div>
                                    </div>
                                    <div className="phoneDiv">
                                        <div className="phoneTitle">Phone Number</div>
                                        <div className="phoneUser">
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="editButtonDiv"  onClick={handleEdit} >Edit</div>
                    </div>
                </div>
            </div>

    );
}

export default StuDashboard;