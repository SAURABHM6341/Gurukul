import React from "react";
import { useSelector } from "react-redux";
import { useLocation, Link, matchPath, Outlet } from "react-router-dom";
import './dashleft.css'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../../../context/slices/profileSlice";
import { clearToken } from "../../../context/slices/authslice";
import { toast } from "react-hot-toast";
import Header from '../../header/header'
import { resetCart } from "../../../context/slices/cartslice";
function DashLeft() {



    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(clearUser());             // Clears user from Redux
        dispatch(clearToken());
        dispatch(resetCart());
                    // Clears token from Redux
        localStorage.removeItem("token"); // Also clear from localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("cart");
        toast.success("Logged out successfully");
        navigate("/login");
    };
    const user = useSelector((state) => state.profile?.user);
    const location = useLocation();

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    }
    const safeUser = user || {};
    return (<>
        <Header/>
        <div className="dashboard">
            <div className="Dashboardleft">
                {/* --- Links have been added here --- */}
                <Link to="/dashboard" className="myProfile" style={matchRoute('/dashboard') ? { color: "#facc15", backgroundColor: "#3D2A01" } : {}}>
                    My Profile
                </Link>

                {safeUser.accountType === "Student" && (
                    <>
                        <Link to="/dashboard/enrolledcourses" className="enrolledCourse" style={matchRoute('/dashboard/enrolledcourses') ? { color: "#facc15", backgroundColor: "#3D2A01" } : {}}>
                            Enrolled Courses
                        </Link>
                        <Link to="/dashboard/cart" className="WishedCourse" style={matchRoute('/dashboard/cart') ? { color: "#facc15", backgroundColor: "#3D2A01" } : {}}>
                            Wishlist
                        </Link>
                        <Link to="/dashboard/purchase-history" className="PurchaseHistory" style={matchRoute('/dashboard/purchase-history') ? { color: "#facc15", backgroundColor: "#3D2A01" } : {}}>
                            Purchase History
                        </Link>
                    </>
                )}

                {safeUser.accountType === "Instructor" && (
                    <>
                        <Link to="/dashboard/mycourses" className="instCourse" style={matchRoute('/dashboard/mycourses') ? { color: "#facc15", backgroundColor: "#3D2A01" } : {}}>
                            My Courses
                        </Link>
                    </>
                )}

                {safeUser.accountType === "Admin" && (
                    <>
                        <Link to="/dashboard/admin/all-users" className="adminUsers" style={matchRoute('/dashboard/admin/all-users') ? { color: "#facc15", backgroundColor: "#3D2A01" } : {}}>
                            All Users
                        </Link>
                        <Link to="/dashboard/admin/all-instructors" className="adminInstructors" style={matchRoute('/dashboard/admin/all-instructors') ? { color: "#facc15", backgroundColor: "#3D2A01" } : {}}>
                            All Instructors
                        </Link>
                        <Link to="/dashboard/admin/all-students" className="adminStudents" style={matchRoute('/dashboard/admin/all-students') ? { color: "#facc15", backgroundColor: "#3D2A01" } : {}}>
                            All Students
                        </Link>
                        <Link to="/dashboard/admin/create-tag" className="createTag" style={matchRoute('/dashboard/admin/create-tag') ? { color: "#facc15", backgroundColor: "#3D2A01" } : {}}>
                            Create Tag
                        </Link>
                    </>
                )}

                <Link to="/dashboard/allcourses" className="allcourses" style={matchRoute('/dashboard/allcourses') ? { color: "#facc15", backgroundColor: "#3D2A01" } : {}}>
                    Courses
                </Link>

                <hr className="gapline" />

                <Link to="/dashboard/setting" className="settings" style={matchRoute('/dashboard/setting') ? { color: "#facc15", backgroundColor: "#3D2A01" } : {}}>
                    Settings
                </Link>
                <div className="logOut" onClick={handleLogout}>Logout</div>

            </div>
            <div className="dashboardRight">
                <Outlet />
            </div>
        </div>
    </>);
}
export default DashLeft;