import React, { useEffect, useState } from "react"; // Import useState
import './enrolledCourses.css';
import {apiConnector} from '../../../service/apiconnector'
import { useSelector } from "react-redux";
import {getEnrolledCourses} from '../../../service/apis'
import {toast} from 'react-hot-toast';
import {useNavigate} from 'react-router-dom'

function EnrolledCourses() {
    const navigate = useNavigate();
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

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setOpenMenuId(null);
        };

        if (openMenuId) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [openMenuId]);
    const handleMenuToggle = (courseId, event) => {
        event.stopPropagation(); // Prevent event bubbling
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
                        <div key={course.id} className="courseRow" onClick={()=>navigate(`/videopage/${course._id}`)}>
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
                                <button className="menu-trigger-btn" onClick={(e) => handleMenuToggle(course.id, e)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="5" r="2" fill="#99A1B3" />
                                        <circle cx="12" cy="12" r="2" fill="#99A1B3" />
                                        <circle cx="12" cy="19" r="2" fill="#99A1B3" />
                                    </svg>
                                </button>
                                {openMenuId === course.id && (
                                    <div className="context-menu" onClick={(e) => e.stopPropagation()}>
                                        <button className="menu-item" onClick={(e) => e.stopPropagation()}>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14.1667 3.33331H5.83333C4.91667 3.33331 4.175 4.07498 4.175 4.99998L4.16667 15C4.16667 15.925 4.91667 16.6666 5.83333 16.6666H14.1667C15.0833 16.6666 15.8333 15.925 15.8333 15V4.99998C15.8333 4.07498 15.0833 3.33331 14.1667 3.33331ZM8.625 12.725L6.4 10.5L7.15833 9.74165L8.625 11.2L12.8417 7.00002L13.6 7.75831L8.625 12.725Z" fill="#99A1B3" />
                                            </svg>
                                            Mark as Completed
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