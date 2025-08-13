import React, { useEffect, useState } from "react"; // Import useState
import './enrolledCourses.css';
import {apiConnector} from '../../../service/apiconnector'
import { useSelector } from "react-redux";
import {getEnrolledCourses, progressApis, getFullCourseByid} from '../../../service/apis'
import {toast} from 'react-hot-toast';
import {useNavigate} from 'react-router-dom'

function EnrolledCourses() {
    const navigate = useNavigate();
    const [coursesData,setCourseData] = useState([]);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [filter, setFilter] = useState('All');
    const [isLoading, setIsLoading] = useState(false);
    const user = useSelector((state) => state.profile?.user);
    const token = useSelector((state)=> state.auth?.token);
    const fetchEnrolled = async()=>{ 
        try{
            setIsLoading(true);
            const response = await apiConnector("GET",getEnrolledCourses.ENROLLED_COURSES_API,{Authorization: `Bearer ${token}`})
            if(response.data.success){
                console.log("print result courses enrolled", response)
                
                const courses = response.data.allEnrolled.courses;
                
                // Fetch progress for each course
                const coursesWithProgress = await Promise.all(
                    courses.map(async (course) => {
                        try {
                            // Fetch progress for this specific course
                            const progressResponse = await apiConnector("GET", 
                                `${progressApis.GET_COURSE_PROGRESS_API}/${course._id}`, 
                                {Authorization: `Bearer ${token}`}
                            );
                            
                            if (progressResponse.data.success) {
                                const progressData = progressResponse.data.data;
                                return {
                                    ...course,
                                    progress: progressData.completionPercentage || 0
                                };
                            } else {
                                // If no progress found, default to 0
                                return {
                                    ...course,
                                    progress: 0
                                };
                            }
                        } catch (progressError) {
                            console.log("Error fetching progress for course:", course._id, progressError);
                            // If error fetching progress, default to 0
                            return {
                                ...course,
                                progress: 0
                            };
                        }
                    })
                );
                
                setCourseData(coursesWithProgress);
                toast.dismiss();
                toast.success("Courses and progress fetched successfully");
            }
            else{
                setCourseData([]);
            }
            
        }catch(err){
             toast.dismiss();
            toast.error("could not fetch courses enrolled",err.message);
           console.log("could not fetch courses enrolled", err);
        } finally {
            setIsLoading(false);
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

    const handleMarkAsCompleted = async (courseId) => {
        try {
            toast.loading("Marking course as completed...");
            
            // First, get the full course details to get all videos
            const courseResponse = await apiConnector("GET", `${getFullCourseByid.FULL_COURSE_ID_API}/${courseId}`, {
                Authorization: `Bearer ${token}`
            });
            
            if (!courseResponse.data.success) {
                toast.dismiss();
                toast.error("Failed to fetch course details");
                return;
            }
            
            const course = courseResponse.data.course;
            const allVideoIds = [];
            
            // Extract all video IDs from the course content
            course.courseContent.forEach(section => {
                section.subSection.forEach(video => {
                    allVideoIds.push(video._id);
                });
            });
            
            if (allVideoIds.length === 0) {
                toast.dismiss();
                toast.error("No videos found in this course");
                return;
            }
            
            // Mark all videos as completed
            for (const videoId of allVideoIds) {
                await apiConnector("POST", progressApis.MARK_VIDEO_COMPLETED_API, {
                    Authorization: `Bearer ${token}`
                }, {
                    courseId: courseId,
                    videoId: videoId
                });
            }
            
            toast.dismiss();
            toast.success("Course marked as completed!");
            
            // Fetch updated progress from backend to ensure accuracy
            try {
                const progressResponse = await apiConnector("GET", 
                    `${progressApis.GET_COURSE_PROGRESS_API}/${courseId}`, 
                    {Authorization: `Bearer ${token}`}
                );
                
                if (progressResponse.data.success) {
                    const updatedProgress = progressResponse.data.data.completionPercentage || 100;
                    // Update the local state with actual progress from backend
                    setCourseData(prevCourses => 
                        prevCourses.map(course => 
                            course._id === courseId 
                                ? { ...course, progress: updatedProgress }
                                : course
                        )
                    );
                } else {
                    // Fallback to setting 100% if API call fails
                    setCourseData(prevCourses => 
                        prevCourses.map(course => 
                            course._id === courseId 
                                ? { ...course, progress: 100 }
                                : course
                        )
                    );
                }
            } catch (progressError) {
                console.log("Error fetching updated progress:", progressError);
                // Fallback to setting 100% if API call fails
                setCourseData(prevCourses => 
                    prevCourses.map(course => 
                        course._id === courseId 
                            ? { ...course, progress: 100 }
                            : course
                    )
                );
            }
            
            // Close the menu
            setOpenMenuId(null);
            
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to mark course as completed");
            console.error("Error marking course as completed:", error);
        }
    };

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
                    {isLoading ? (
                        <div className="loading-container">
                            <p>Loading courses and progress...</p>
                        </div>
                    ) : filteredCourses.length > 0 ? (
                        filteredCourses.map((course) => (
                        <div key={course._id} className="courseRow" onClick={()=>navigate(`/videopage/${course._id}`)}>
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
                                <button className="menu-trigger-btn" onClick={(e) => handleMenuToggle(course._id, e)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="5" r="2" fill="#99A1B3" />
                                        <circle cx="12" cy="12" r="2" fill="#99A1B3" />
                                        <circle cx="12" cy="19" r="2" fill="#99A1B3" />
                                    </svg>
                                </button>
                                {openMenuId === course._id && (
                                    <div className="context-menu" onClick={(e) => e.stopPropagation()}>
                                        <button 
                                            className="menu-item" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsCompleted(course._id);
                                            }}
                                            disabled={course.progress === 100}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14.1667 3.33331H5.83333C4.91667 3.33331 4.175 4.07498 4.175 4.99998L4.16667 15C4.16667 15.925 4.91667 16.6666 5.83333 16.6666H14.1667C15.0833 16.6666 15.8333 15.925 15.8333 15V4.99998C15.8333 4.07498 15.0833 3.33331 14.1667 3.33331ZM8.625 12.725L6.4 10.5L7.15833 9.74165L8.625 11.2L12.8417 7.00002L13.6 7.75831L8.625 12.725Z" fill="#99A1B3" />
                                            </svg>
                                            {course.progress === 100 ? "Already Completed" : "Mark as Completed"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                    ) : (
                        <div className="no-courses">
                            <p>No courses found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EnrolledCourses;