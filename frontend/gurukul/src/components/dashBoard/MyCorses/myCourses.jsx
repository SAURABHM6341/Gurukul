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
        <div className="my-courses-container">
            <div className="my-courses-header">
                <h1>My Courses</h1>
                {/* The "New" button now changes the view state */}
                <button className="new-course-btn" onClick={() => setView('add')}>
                  
                    <FaPlus /> New
                   
                </button>
            </div>
{
            CourSe ? (
                <div className="courses-list">
                {CourSe.map(course => (
                    <div key={course._id} className="course-card">
                        <img src={course.thumbnail} alt={course.courseName} className="course-card-thumbnail" />
                        <div className="course-card-body">
                            <h3>{course.courseName}</h3>
                            <p>{course.courseDescription}</p>
                            <p className="course-card-created">Created: {course.createdAt}</p>
                            <span className={`status-badge ${course.status.toLowerCase()}`}>{course.status}</span>
                        </div>
                        <div className="course-card-footer">
                            {/* <span className="course-card-duration">{course.duration}</span> */}
                            <span className="course-card-price">₹{course.price}</span>
                            <div className="course-card-actions">
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