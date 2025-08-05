import React, { useEffect, useState } from 'react';
import './courseDetail.css';
import { FaStar, FaRegStar, FaStarHalfAlt, FaInfoCircle, FaCheck, FaPlayCircle, FaChevronDown, FaRegClock, FaSignal, FaCertificate, FaInfinity } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { apiConnector } from '../../service/apiconnector';
import { getCourseByid } from '../../service/apis';
import {useParams} from 'react-router-dom';
import {toast} from 'react-hot-toast'
// --- HELPER COMPONENT FOR LESSONS ---
// This component manages its own state for collapsing/expanding
const LessonAccordion = ({ lesson }) => {
    const [isOpen, setIsOpen] = useState(false);

    const totalLectures = lesson.subSection.length;
    // In a real app, duration would be calculated or come from the API

    return (
        <div className="lesson-accordion">
            <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="header-title">
                    <FaChevronDown className={`chevron-icon ${isOpen ? 'open' : ''}`} />
                    <span>{lesson.sectionName}</span>
                </div>
                <div className="header-meta">
                    <span>{totalLectures} lectures • {totalDuration}</span>
                </div>
            </div>
            {isOpen && (
                <div className="accordion-content">
                    {lesson.subSection.map((video, index) => (
                        <div key={index} className="video-item">
                            <FaPlayCircle className="video-icon" />
                            <span className="video-title">{video.title}</span>
                            <span className="video-duration">{video.timeDuration}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};



// --- MAIN COURSE DETAILS COMPONENT ---
const CourseDetails = () => {
    const user = useSelector((state)=>state?.profile?.user);
const token = useSelector((state)=>state?.auth?.token);
const { id } = useParams();
const [courseData, setCourseData] = useState();
const fetchCourse = async()=>{
    const url = getCourseByid.COURSE_ID_API.replace(":id", id);
    try{
        const res = await apiConnector("GET",url);
        if(res.data.success){
            toast.dismiss();
            toast.success("course details fetched");
            console.log(res.data.course);
            setCourseData(res.data.course);
        }
        else{
            setCourseData(null);
        }

    }catch(err){
        toast.dismiss();
            toast.error("course details fetch failed");
            console.log(res.err);
    }
}
useEffect(() => {
            fetchCourse();
        }, []);
    const [isEnrolled,setisEnrolled] = useState(false);
    useEffect(() => {
    if (user) {
        setisEnrolled(true);
    }
}, [user])
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={`full-${i}`} />);
        if (halfStar) stars.push(<FaStarHalfAlt key="half" />);
        for (let i = 0; i < emptyStars; i++) stars.push(<FaRegStar key={`empty-${i}`} />);
        
        return <div className="stars">{stars}</div>;
    };
if (!courseData) {
    return <div className="loader">Loading course details...</div>;
}
    return (
        <div className="course-page-container">
            <div className="course-main-content">
                <h1 className="course-title">{courseData.courseName}</h1>
                <p className="course-description">{courseData.courseDescription}</p>
                
                <div className="course-meta-info">
                    <span className="rating-value">{courseData.averageRating}</span>
                    {renderStars(courseData.averageRating)}
                    <span className="review-count">({courseData.totalReviews} Total Ratings)</span>
                    <span className="student-count">{courseData.studentEnrolled.length} students</span>
                </div>

                <div className="author-info">
                    <span>Created by <a href="#author">{courseData.instructor?.Fname} {courseData.instructor?.Lname}</a></span>
                    <span><FaInfoCircle /> Last updated {courseData.createdAt}</span>
                    <span><FaRegClock /> English</span>
                </div>

                <div className="what-you-will-learn">
                    <h2>What you'll learn</h2>
                    
                    <p>{courseData.whatToLearn}</p>
                </div>

                <div className="course-content-section">
                    <h2>Course content</h2>
                    <div className="content-summary">
                        <span>{courseData.courseContent?.length} sections • {courseData.courseContent?.subSection?.length} lectures •</span>
                    </div>
                    {courseData.courseContent.map((lesson) => (
                        <LessonAccordion key={lesson.id} lesson={lesson} />
                    ))}
                </div>

                 <div className="author-section">
                    <h2>Author</h2>
                    <div className="author-details">
                        <img src={courseData.instructor?.image} alt={courseData.instructor?.Fname} className="author-avatar" />
                        <div className="author-bio">
                            <h3>{courseData.instructor?.Fname} {courseData.instructor?.Lname}</h3>
                            <p>{courseData.instructor?.additionalDetails?.about}</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* --- SIDEBAR --- */}
            {/* This entire section will not render if the user is already enrolled */}
            {!isEnrolled && (
                 <div className="course-sidebar">
                    <div className="buy-card">
                        <div className="course-thumbnail-placeholder">
                            <img src={courseData.thumbnail} alt="" />
                        </div>
                        <p className="price">Rs. {courseData.price} /-</p>
                        <button className="add-to-cart-btn">Add to Cart</button>
                        <button className="buy-now-btn">Buy Now</button>
                        <p className="money-back-guarantee">30-Day Money-Back Guarantee</p>
                        
                        <div className="course-includes">
                            <h4>This course includes:</h4>
                            <ul>
                                <li><FaInfinity /> Full lifetime access</li>
                                <li><FaSignal /> Access on mobile and TV</li>
                                <li><FaCertificate /> Certificate of completion</li>
                            </ul>
                        </div>
                         <button className="share-btn">Share</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetails;