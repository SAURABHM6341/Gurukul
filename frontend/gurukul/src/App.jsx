import './App.css'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx';
import SignUp from './pages/SignUpPage.jsx';
import Aboutus from './pages/AboutUs.jsx'
import ContaCtUs from './pages/ContactUS.jsx'
import LogIn from './pages/LogIn.jsx'
import CheckEmail from './pages/chekMail.jsx';
import Verify_otp from './pages/Verify_otp.jsx';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setToken } from './context/slices/authslice.js';
import { setUser } from './context/slices/profileSlice.js';
import StuDashboard from './components/dashBoard/studentDashboard/studentdash.jsx';
import UserProfile from './components/dashBoard/settingsDashboard/settingsDash';
import DashLeft from './components/dashBoard/dashLeft/dashLeft.jsx';
import EnrolledCourses from './components/dashBoard/enrolledcourses/enrolledCourses.jsx'
import Wishlist from './components/dashBoard/WishList/wishlist.jsx'
import CourseDet from './pages/courseDetail.jsx';
import MyCourses from './components/dashBoard/MyCorses/myCourses.jsx'
import AddCourse from './components/dashBoard/addnewCourses/newCourse.jsx'
import CourseInformationForm from './components/dashBoard/addnewCourses/courseInformation.jsx'
import PassWordChange from './pages/passChange.jsx'
import GetAllCourse from './components/dashBoard/allcourses/Allcourses.jsx'
import TagPage from './pages/tagPage.jsx'
import ResetPass from './pages/resetPass.jsx';
import LEcturePage from './pages/Lecture.jsx'
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      dispatch(setUser(JSON.parse(savedUser)));
      dispatch(setToken(savedToken));
    }
  }, []);
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<HomePage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/aboutus' element={<Aboutus />} />
        <Route path='/contactus' element={<ContaCtUs />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/check_email' element={<CheckEmail />} />
        <Route path='/verify_otp' element={<Verify_otp />} />
        <Route path='/course_details/:id' element={<CourseDet/>} />
        <Route path='/change_password' element={<PassWordChange/>} />
        <Route path='/tag/:tagid' element={<TagPage/>} />
        <Route path='/resetpassword' element={<ResetPass/>} />
        <Route path='/videopage' element={<LEcturePage/>} />

        {/* Dashboard Layout with Nested Routes */}
        <Route path='/dashboard' element={<DashLeft />}>
          <Route index element={< StuDashboard/>} /> 
          <Route path='setting' element={<UserProfile />} />
          <Route path='enrolledcourses' element={<EnrolledCourses />} />
          <Route path='cart' element={<Wishlist />} />
          <Route path='mycourses' element={<MyCourses />} />
          <Route path='mycourses' element={<AddCourse />} />
          <Route path='mycourses' element={<CourseInformationForm />} />
          <Route path='allcourses' element={<GetAllCourse />} />
        </Route>
      </Routes>
    </div>
  );
}
export default App;