import React from "react";
import {getallcourses} from '../../../service/apis';
import { apiConnector } from "../../../service/apiconnector";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from 'react';
import { useSelector } from "react-redux";
import { FaPlus, FaPencilAlt, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import './Allcourses.css'
function GetAllCourse() {
    const token = useSelector((state)=>state.auth?.token);
    const [CourSe,setCourSe] = useState([]);
    const navigate = useNavigate();
    const fetchallCourses = async() =>{
    try{
        toast.loading("Fetching Courses")
        const res = await apiConnector("GET",getallcourses.GET_ALL_COURSES_API,`Bearer ${token}`);
        if(res.data.success){
        console.log(res.data?.courses)
        toast.dismiss();
        toast.success("course fetched");
        setCourSe(res.data?.courses);
    }
    }catch(err){
        console.log("dikkat h ");
        toast.dismiss();
        toast.error("course not fetched");
        setCourSe([]);
    }
}
useEffect(()=>{
    fetchallCourses();
},[]);
    return (
        <>
        <div className="Headingallcourses">
            Courses
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
                                                    <span className={`status-badge${course?.status?.toLowerCase()}-mycourses`}>{course.status}</span>
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
        </>
    );
}
export default GetAllCourse;