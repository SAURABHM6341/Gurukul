import React, { useEffect, useState } from 'react';
import './courseDetail.css';
import { FaStar, FaRegStar, FaStarHalfAlt, FaInfoCircle, FaCheck, FaPlayCircle, FaChevronDown, FaRegClock, FaSignal, FaCertificate, FaInfinity } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { apiConnector } from '../../service/apiconnector';
import { getCourseByid, capturePayment, verifySignapi } from '../../service/apis';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;
import { addToCart, removeFromCart } from '../../context/slices/cartslice';
import { setUser } from '../../context/slices/profileSlice';
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
                    {/* <span>{totalLectures} lectures • {totalDuration}</span> */}
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
    const user = useSelector((state) => state?.profile?.user);
    const token = useSelector((state) => state?.auth?.token);
    const { id } = useParams();
    const navigate = useNavigate();
    const [courseData, setCourseData] = useState();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state?.cart?.cart);
    const fetchCourse = async () => {
        const url = getCourseByid.COURSE_ID_API.replace(":id", id);
        try {
            const res = await apiConnector("GET", url);
            if (res.data.success) {
                toast.dismiss();
                toast.success("course details fetched");
                console.log(res.data.course);
                setCourseData(res.data.course);
            }
            else {
                setCourseData(null);
            }

        } catch (err) {
            toast.dismiss();
            toast.error("course details fetch failed");
            console.log(err);
        }
    }
    useEffect(() => {
        fetchCourse();
    }, []);
    const [isEnrolled, setisEnrolled] = useState(false);
    useEffect(() => {
        if (user?.courses?.includes(courseData?._id)||user?.accountType==="Admin") {
            setisEnrolled(true);
        } else {
            setisEnrolled(false);
        }
    }, [user, courseData])
    const handleBuyNow = async (id) => {
        try {
            const payload = {
                courses: [id],
            }
            
            const response = await apiConnector("POST", capturePayment.PAYMENT_API, {
                Authorization: `Bearer ${token}`
            }, payload);
            
            if (response.data.success) {
                toast.success(response.data.message);
            }
            const data = response?.data;
            const options = {
                key: RAZORPAY_KEY,
                amount: courseData.price * 100,
                currency: "INR",
                name: courseData.courseName,
                description: courseData.courseDescription,
                    order_id: data.order,
                notes: {
                    courseIds: JSON.stringify([id]), // Store as JSON string array
                    userId: user._id,
                },
                prefill: {
                    name: `${user.Fname} ${user.Lname}`,
                    email: user.email,
                },
                handler: async function (response) {
                    try {
                        // Call your verification API with the response from Razorpay
                        const verifyResponse = await apiConnector("POST", verifySignapi.VERIFY_PAY_API, {
                            'Content-Type': 'application/json'
                        }, {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        
                        if (verifyResponse.data.success) {
                            toast.success("Payment successful! Course enrolled.");
                            
                            // Update user's courses in Redux store
                            const updatedUser = {
                                ...user,
                                courses: [...(user.courses || []), courseData._id]
                            };
                            dispatch(setUser(updatedUser));
                            
                            // Update localStorage as well
                            localStorage.setItem("user", JSON.stringify(updatedUser));
                            
                            // Remove course from cart if it was there
                            dispatch(removeFromCart(courseData._id));
                            
                            // No need to reload, state will update automatically
                        } else {
                            toast.error("Payment verification failed");
                        }
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        toast.error("Payment verification failed");
                    }
                },
                modal: {
                    ondismiss: function () {
                        toast.error("Payment cancelled");
                    }
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            console.error("Error initiating payment:", err);
            toast.error("Payment failed. Try again.");
        }
    };

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
    const isIncart = cartItems.some(item => item._id === courseData._id);
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
                    <span><FaInfoCircle /> Last updated {courseData.createdAt.split("T")[0]}</span>
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
            {(user?.accountType === "Student" || user?.accountType === "Admin") && (
                <div className="course-sidebar">
                    <div className="buy-card">
                        <div className="course-thumbnail-placeholder">
                            <img src={courseData.thumbnail} alt="" />
                        </div>

                        <p className="price">Rs. {courseData.price} /-</p>
                        {
                            (!isEnrolled && user?.accountType === "Student") && <>
                                {!isIncart && user?.accountType == "Student" && <>
                                    <button className="add-to-cart-btn" onClick={() => dispatch(addToCart(courseData))} >Add to Cart</button>
                                    <div className="cart-notice">
                                        <p className="cart-notice-text">
                                            <span className="notice-icon">ℹ️</span>
                                            Cart items will be cleared after 3 days or when you logout
                                        </p>
                                    </div>
                                </>}
                                {isIncart && user?.accountType == "Student" &&
                                    <button className="add-to-cart-btn" onClick={() => dispatch(removeFromCart(courseData._id))} >Remove from Cart</button>

                                }

                                <button className="buy-now-btn" onClick={() => handleBuyNow(id)} >Buy Now</button>
                                <p className="money-back-guarantee">30-Day Money-Back Guarantee</p>
                            </>
                        }
                        {
                            (isEnrolled) && <>
                            <button className="buy-now-btn" onClick={()=>navigate(`/videopage/${courseData._id}`)} >Go to Course</button>
                            </>
                        }
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