import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyCourses.css';
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';
import AddCourse from '../addnewCourses/newCourse'; // Import the new component
import { apiConnector } from '../../../service/apiconnector';
import { useSelector } from 'react-redux';
import {FetchMyCourses} from '../../../service/apis' 
import toast from 'react-hot-toast';


const MyCourses = () => {
    const {token} = useSelector((state)=>state.auth?.token);
    const [CourSe,setCourSe] = useState([]);
    const navigate = useNavigate();
    const [view, setView] = useState('list');
    const fetchmyCourses = async() =>{
    try{
        toast.loading("Fetching Courses")
        const res = await apiConnector("GET",FetchMyCourses.MY_COURSE_API,`Bearer ${token}`);
        if(res.data.success){
        console.log(res.data?.allEnrolled.courses)
        toast.dismiss();
        toast.success("course fetched");
        setCourSe(res.data?.allEnrolled.courses);
    }
    }catch(err){
        console.log("dikkat h ");
        toast.dismiss();
        toast.error("course not fetched");
        setCourSe([]);
    }
}
useEffect(()=>{
    fetchmyCourses();
},[]);
    if (view === 'add') {
        // We pass setView so the AddCourse component can go back to the list
        return <AddCourse onBack={() => setView('list')} />;
    }

    // Otherwise, render the list of courses
    return (
        <div className="my-courses-container-mycourses">
            <div className="my-courses-header-mycourses">
                <h1>My Courses</h1>
                {/* The "New" button now changes the view state */}
                <button className="new-course-btn-mycourses" onClick={() => setView('add')}>
                  
                    <FaPlus /> New
                   
                </button>
            </div>
{
            CourSe ? (
                <div className="courses-list-mycourses">
                {CourSe.map(course => (
                    <div key={course._id} className="course-card-mycourses" onClick={()=>navigate(`/course_details/${course._id}`)} >
                        <img src={course.thumbnail} alt={course.courseName} className="course-card-thumbnail-mycourses" />
                        <div className="course-card-body-mycourses">
                            <h3>{course.courseName}</h3>
                            <p>{course.courseDescription}</p>
                            <p className="course-card-created-mycourses">Created: {course.createdAt.split("T")[0]}</p>
                            <span className={`status-badge${course.status.toLowerCase()}-mycourses`}>{course.status}</span>
                        </div>
                        <div className="course-card-footer-mycourses">
                            {/* <span className="course-card-duration">{course.duration}</span> */}
                            <span className="course-card-price-mycourses">₹{course.price}</span>
                            <div className="course-card-actions-mycourses">
                                <button title="Edit" onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}>
                                    <FaPencilAlt />
                                </button>
                                <button title="Delete">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            ) : (<>No Courses Yet</>)
}
        </div>
    );
};

export default MyCourses;