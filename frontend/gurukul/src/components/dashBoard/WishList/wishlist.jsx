import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../../../context/slices/cartslice'; // Make sure the path is correct
import './wishlist.css';
import { apiConnector } from '../../../service/apiconnector';
import { getCartCourses, capturePayment, verifySignapi } from '../../../service/apis';
import toast from 'react-hot-toast';
import { setUser } from '../../../context/slices/profileSlice';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;



const Wishlist = () => {
    const {
        cart,
        total, totalItems } = useSelector((state) => state.cart);
    const [courses, setCourses] = useState([]);
    const [checkout, setCheckout] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.profile.user);
    const token = useSelector((state) => state.auth.token);
    const handleRemoveFromCart = (courseId) => {
        dispatch(removeFromCart(courseId));
        console.log("Removing course:", courseId);
    };
    const fetchCartCourses = async () => {
        
        try {
            const payload = {
            ids: cart
                .map(course => course._id)
        }
            console.log(cart);
            const response = await apiConnector("POST", getCartCourses.CART_COURSES_API, {
                Authorization: `Bearer ${token}`
            }, payload);
            if (response?.data?.success) {
                toast.dismiss();
                toast.success("cart items fetched");
                console.log(response?.data?.courses);
                setCourses(response?.data?.courses);
            }
            else {
                console.log("could not fetch");
            }
        } catch (error) {
            toast.dismiss();
            toast.error("cart items fetch failed");
            console.log("could not fetch ", error);
        }
    }
    useEffect(() => {
        if (cart.length > 0 && token) fetchCartCourses();
        if (cart.length == 0 && token) setCourses([]);
    }, [cart]);

    const handleBuyNow = () => {
        setCheckout(true);
    }
    const handleBack = () => {
        setCheckout(false);
    }

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        
        if (courses.length === 0) {
            toast.error("No courses in cart");
            return;
        }

        try {
            // Get course IDs from the courses array
            const courseIds = courses.map(course => course._id);
            
            const payload = {
                courses: courseIds,
            };
            
            const response = await apiConnector("POST", capturePayment.PAYMENT_API, {
                Authorization: `Bearer ${token}`
            }, payload);
            
            if (response.data.success) {
                toast.success(response.data.message);
            }
            
            const data = response?.data;
            const options = {
                key: RAZORPAY_KEY,
                amount: total * 100, // Convert to paisa
                currency: "INR",
                name: "Gurukul - Multiple Courses",
                description: `Payment for ${courses.length} course(s)`,
                order_id: data.order,
                notes: {
                    courseIds: JSON.stringify(courseIds), // Store as JSON string array
                    userId: user._id,
                },
                prefill: {
                    name: `${user.Fname} ${user.Lname}`,
                    email: user.email,
                },
                handler: async function (response) {
                    try {
                        // Call verification API with the response from Razorpay
                        const verifyResponse = await apiConnector("POST", verifySignapi.VERIFY_PAY_API, {
                            'Content-Type': 'application/json'
                        }, {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        
                        if (verifyResponse.data.success) {
                            toast.success("Payment successful! All courses enrolled.");
                            
                            // Update user's courses in Redux store
                            const updatedUser = {
                                ...user,
                                courses: [...(user.courses || []), ...courseIds]
                            };
                            dispatch(setUser(updatedUser));
                            
                            // Update localStorage as well
                            localStorage.setItem("user", JSON.stringify(updatedUser));
                            
                            // Remove all courses from cart
                            courseIds.forEach(courseId => {
                                dispatch(removeFromCart(courseId));
                            });
                            
                            // Reset checkout state
                            setCheckout(false);
                            setCourses([]);
                            
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


    return (
        <div className="wishlist-container">
            {
                !checkout && (<><h1>My Wishlist</h1>
                    <p className="course-count">{totalItems} Courses in Wishlist</p></>
                )
            }
            {
                checkout && (
                    <>
                        <div className="backButton" onClick={handleBack} >Back to WishList</div>
                        <h1>Checkout</h1>
                        <p className="course-count"> Order Summary</p>
                    </>
                )
            }


            <div className="wishlist-content">
                {/* Left Column: Cart Items */}
                <div className="wishlist-items">
                    {/* {cart.length > 0 ? ( */}
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <div key={course._id} className="wishlist-item">
                                <img src={course.thumbnail} alt={course.courseName} className="item-thumbnail" />
                                <div className="item-details">
                                    <p className="item-title">{course.courseName}</p>
                                    <p className="item-creator">by {course.instructor.Fname + " " + course.instructor.Lname}</p>
                                    <div className="item-rating">
                                        <span>
                                            {course.averageRating}
                                        </span>
                                        {/* Star Icons */}
                                        <div className="stars">★★★★★</div>
                                        <span>
                                            ({course.totalReviews} Reviews)
                                        </span>
                                    </div>
                                    <p className="item-meta">
                                        {course.courseContent.length} Lessons
                                    </p>
                                </div>
                                <div className="item-actions">
                                    {!checkout && (
                                        <button onClick={() => handleRemoveFromCart(course._id)} className="remove-btn">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 15.8333C5 16.75 5.75 17.5 6.66667 17.5H13.3333C14.25 17.5 15 16.75 15 15.8333V5.83331H5V15.8333ZM15.8333 3.33331H12.9167L12.0833 2.5H7.91667L7.08333 3.33331H4.16667V4.99998H15.8333V3.33331Z" fill="#EF476F" /></svg>
                                            Remove
                                        </button>
                                    )
                                    }
                                    <p className="item-price">Rs. {course.price.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Your wishlist is empty...</p>
                    )}
                </div>

                {/* Right Column: Checkout Summary */}
                {/* {totalItems > 0 && ( */}
                {courses.length > 0 && !checkout && (
                    <div className="wishlist-summary">
                        <p className="summary-title">Total:</p>
                        <p className="summary-total-price">Rs. {total.toLocaleString('en-IN')}</p>
                        <p className="summary-original-price">Rs. {(total * 1.2).toLocaleString('en-IN')}</p>
                        <button className="buy-now-btn" onClick={handleBuyNow} >Buy Now</button>
                    </div>
                )}
                {
                    courses.length > 0 && checkout && (
                        <div className="payment-card">
                            <div className="payment-header">
                                <h2>Payment Details</h2>
                                <p>Complete your purchase details and providing your payment details to us.</p>
                            </div>
                            <form className="payment-form" onSubmit={handlePaymentSubmit}>
                                <div className="form-group">
                                    <label htmlFor="fullName">
                                        Full Name <span className="asterisk">*</span>
                                    </label>
                                    <input type="text" id="fullName" placeholder="Enter Full Name" />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">
                                        Email ID <span className="asterisk">*</span>
                                    </label>
                                    <input type="email" id="email" placeholder="Enter Email ID" />
                                </div>

                                <div className="total-section">
                                    <p>Total</p>
                                    <p>{total.toLocaleString('en-IN')}</p>
                                </div>

                                <button type="submit" className="pay-button">
                                    Pay Rs. {total.toLocaleString('en-IN')}
                                </button>
                            </form>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Wishlist;