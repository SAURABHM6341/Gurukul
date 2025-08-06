import {React,useState,useEffect} from "react";
import { useSelector } from "react-redux";
import './studentDash.css';
import { useNavigate } from "react-router-dom";
import {apiConnector} from '../../../service/apiconnector';
import {additonalProfileApi} from '../../../service/apis'
import {toast} from 'react-hot-toast'

function StuDashboard() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.profile?.user);
    const token = useSelector((state) => state.auth?.token);
    const handleEdit = () => {
        navigate("/dashboard/setting");
    }
    const [additionalData,setadditonalData] = useState({
        gender:"",dateOfBirth:"",about:"",contactNumber:""
    });
    const additonalDetailsres = async()=>{
        try {
            const response = await apiConnector("GET",additonalProfileApi.PROFILE_INFO_API,`Bearer ${token}`);
            if(response.data.success){
                toast.dismiss()
                toast.success("profile details fetched");
                setadditonalData(response.data.userDetails.additionalDetails);
                console.log("additional details mil gyi h ",response.data.userDetails.additionalDetails);
            }
            else{
                toast.dismiss()
                toast.error("something is wrong");
            }
        } catch (error) {
            toast.dismiss()
            console.log(error);
            toast.error("cannot fetch all details");
        }
    }
    useEffect(()=>{
        additonalDetailsres();
    },[]);
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
                                    <div className="EmailUser">{safeUser.email}</div>
                                </div>
                                <div className="contactNumber">
                                    <div className="PhoneTitle">Phone Number</div>
                                    <div className="phoneNumber">{additionalData.contactNumber}</div>
                                </div>
                            </div>
                            <div className="genderDob">
                                <div className="GenderProfile">
                                    <div className="GenderTitle">Gender</div>
                                    <div className="gendergender">{additionalData.gender}</div>
                                </div>
                                <div className="dobprofile">
                                    <div className="DOBTitle">Date of Birth</div>
                                    <div className="Dobtext">{additionalData.dateOfBirth.split("T")[0]}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="editButtonDiv" onClick={handleEdit} >Edit</div>
                </div>
                <div className="moreDetails" >
                    <div className="headingPersonal">
                        Bio
                    </div>
                    <div className="textBioarea">
                        {additionalData.about}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default StuDashboard;