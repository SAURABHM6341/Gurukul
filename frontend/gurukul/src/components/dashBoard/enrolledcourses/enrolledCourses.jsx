import React, { useEffect, useState } from "react"; // Import useState
import './enrolledCourses.css';
import {apiConnector} from '../../../service/apiconnector'
import { useSelector } from "react-redux";
import {getEnrolledCourses} from '../../../service/apis'
import {toast} from 'react-hot-toast';

function EnrolledCourses() {
    const [coursesData,setCourseData] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [filter, setFilter] = useState('All');
    const user = useSelector((state) => state.profile?.user);
    const token = useSelector((state)=> state.auth?.token);
    const fetchEnrolled = async()=>{ 
        try{
            const response = await apiConnector("GET",getEnrolledCourses.ENROLLED_COURSES_API,`Bearer ${token}`)
            if(response.data.success){
                toast.dismiss();
                toast.success("Courses Fetched Successfully");
                console.log("print result courses enrolled", response)
                setCourseData(response.data.allEnrolled.courses);
            }
            else{
                setCourseData([]);
            }
            
        }catch(err){
             toast.dismiss();
            toast.error("could not fetch courses enrolled",err.message);
           console.log("could not fetch courses enrolled", err);
        }
}
    useEffect(() => {
            fetchEnrolled();
        }, []);
    const handleMenuToggle = (courseId) => {
        setOpenMenuId(openMenuId === courseId ? null : courseId);
    };
     const filteredCourses = coursesData.filter(course => {
        if (filter === 'Pending') {
            return course.progress < 100;
        }
        if (filter === 'Completed') {
            return course.progress === 100;
        }
        // If 'All', return true for every course
        return true;
    });
    return (
        <div className="courseContainer">
            <div className="HeadingEnrolled">
                <h1>Enrolled Courses</h1>
            </div>

            <div className="StatusEnrolled">
                <div
                    className={`AllEnrolled ${filter === 'All' ? 'active' : ''}`}
                    onClick={() => setFilter('All')}
                >
                    All
                </div>
                <div
                    className={`pendingEnrolled ${filter === 'Pending' ? 'active' : ''}`}
                    onClick={() => setFilter('Pending')}
                >
                    Pending
                </div>
                <div
                    className={`CompleteEnrolled ${filter === 'Completed' ? 'active' : ''}`}
                    onClick={() => setFilter('Completed')}
                >
                    Completed
                </div>
            </div>

            <div className="enrolledCoursesContainer">
                <div className="courseListHeader">
                    <p>Course Name</p>
                    <p>Durations</p>
                    <p>Progress</p>
                </div>

                <div className="courseListBody">
                    {filteredCourses.map((course) => (
                        <div key={course.id} className="courseRow">
                            <div className="courseInfo">
                                <img src={course.thumbnail} alt={course.courseName} />
                                <div>
                                    <h4>{course.courseName}</h4>
                                    <p>{course.courseDescription}</p>
                                </div>
                            </div>
                            <div className="courseDuration">
                                2hr 30 mins {/* Placeholder duration */}
                            </div>
                            <div className="courseProgress">
                                {course.progress === 100 ? (
                                    <span className="completed-text">Completed</span>
                                ) : (
                                    <span>Progress {course.progress}%</span>
                                )}
                                <div className="progressBar">
                                    <div
                                        className={`progressBarFill ${course.progress === 100 ? 'completed' : ''}`}
                                        style={{ width: `${course.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="courseActions">
                                <button className="menu-trigger-btn" onClick={() => handleMenuToggle(course.id)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="5" r="2" fill="#99A1B3" />
                                        <circle cx="12" cy="12" r="2" fill="#99A1B3" />
                                        <circle cx="12" cy="19" r="2" fill="#99A1B3" />
                                    </svg>
                                </button>
                                {openMenuId === course.id && (
                                    <div className="context-menu">
                                        <button className="menu-item">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14.1667 3.33331H5.83333C4.91667 3.33331 4.175 4.07498 4.175 4.99998L4.16667 15C4.16667 15.925 4.91667 16.6666 5.83333 16.6666H14.1667C15.0833 16.6666 15.8333 15.925 15.8333 15V4.99998C15.8333 4.07498 15.0833 3.33331 14.1667 3.33331ZM8.625 12.725L6.4 10.5L7.15833 9.74165L8.625 11.2L12.8417 7.00002L13.6 7.75831L8.625 12.725Z" fill="#99A1B3" />
                                            </svg>
                                            Mark as Completed
                                        </button>
                                        <button className="menu-item remove">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5 15.8333C5 16.75 5.75 17.5 6.66667 17.5H13.3333C14.25 17.5 15 16.75 15 15.8333V5.83331H5V15.8333ZM15.8333 3.33331H12.9167L12.0833 2.5H7.91667L7.08333 3.33331H4.16667V4.99998H15.8333V3.33331Z" fill="#99A1B3" />
                                            </svg>
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default EnrolledCourses;