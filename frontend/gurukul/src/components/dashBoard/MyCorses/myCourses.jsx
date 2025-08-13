import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './myCourses.css';
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';
import AddCourse from '../addnewCourses/newCourse'; // Import the new component
import { apiConnector } from '../../../service/apiconnector';
import { useSelector } from 'react-redux';
import { FetchMyCourses, deleteEditCourse } from '../../../service/apis'
import toast from 'react-hot-toast';


const MyCourses = () => {
    const { token } = useSelector((state) => state.auth?.token);
    const [CourSe, setCourSe] = useState(null);
    const navigate = useNavigate();
    const [view, setView] = useState('list');
    const [editData, setEditData] = useState(null);

    const fetchmyCourses = async () => {
        try {
            toast.loading("Fetching Courses")
            const res = await apiConnector("GET", FetchMyCourses.MY_COURSE_API, {
                Authorization: `Bearer ${token}`
            });
            if (res.data.success) {
                console.log(res.data?.allEnrolled?.courses)
                toast.dismiss();
                toast.success("course fetched");
                setCourSe(res.data?.allEnrolled?.courses);
            }
        } catch (err) {
            console.log("dikkat h ");
            toast.dismiss();
            toast.error("course not fetched");
            setCourSe([]);
        }
    }
    useEffect(() => {
        fetchmyCourses();
    }, []);
    if (view === 'add') {
        return <AddCourse onBack={() => setView('list')} isEditing={false}  />;
    }
    if (view === 'edit') {
        return <AddCourse onBack={() => setView('list')} isEditing={true} courseInfo={editData} />;
    }
    const handleDeleteCourse = async (event, courseId) => {
        event.stopPropagation();
        try {
            if (window.confirm("Are you sure you want to delete this course?")) {
                const payload = { courseId };
                console.log("payload", payload);
                const res = await apiConnector("DELETE", deleteEditCourse.DELETE_COURSE_API, {
                Authorization: `Bearer ${token}`
            }, payload);
                if (res.data.success) {
                    toast.success("Course deleted successfully");
                    fetchmyCourses(); // Refresh the course list
                } else {
                    toast.error("Failed to delete course", res?.data?.message || "Please try again");
                }
            }
        } catch (error) {
            toast.error("Error deleting course");
            console.error("Error deleting course:", error, error?.response?.data?.message || "Unknown error");
        }
    }
    const handleEditCourse = (event, course) => {
        event.stopPropagation();
        setEditData(course);
        setView('edit');
    };

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
                            <div key={course._id} className="course-card-mycourses" onClick={() => navigate(`/course_details/${course._id}`)} >
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
                                        <button title="Edit" onClick={(e) => handleEditCourse(e, course)}>
                                            <FaPencilAlt />
                                        </button>
                                        <button title="Delete" onClick={(e) => handleDeleteCourse(e, course._id)} >
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