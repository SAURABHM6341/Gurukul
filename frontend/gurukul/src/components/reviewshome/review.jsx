import React, { useState, useEffect } from "react";
import './review.css'
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function ReviewHome() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [reviewsPerSlide, setReviewsPerSlide] = useState(3);

    // 10 dummy reviews
    const reviews = [
        {
            id: 1,
            name: "Esther Howard",
            email: "esther.howard@example.com",
            avatar: "https://randomuser.me/api/portraits/women/1.jpg",
            message: "This platform completely transformed my coding journey! The instructors are amazing and the content is top-notch. I went from complete beginner to landing my first tech job in just 6 months.",
            rating: 5
        },
        {
            id: 2,
            name: "John Smith",
            email: "john.smith@example.com",
            avatar: "https://randomuser.me/api/portraits/men/2.jpg",
            message: "Excellent courses with practical projects. The React course helped me build my portfolio and get hired as a frontend developer. Highly recommend!",
            rating: 5
        },
        {
            id: 3,
            name: "Sarah Johnson",
            email: "sarah.johnson@example.com",
            avatar: "https://randomuser.me/api/portraits/women/3.jpg",
            message: "The best investment I made for my career. Clear explanations, hands-on projects, and great community support. Worth every penny!",
            rating: 5
        },
        {
            id: 4,
            name: "Michael Brown",
            email: "michael.brown@example.com",
            avatar: "https://randomuser.me/api/portraits/men/4.jpg",
            message: "I love the flexibility of learning at my own pace. The courses are well-structured and the instructors are very supportive.",
            rating: 4
        },
        {
            id: 5,
            name: "Emily Davis",
            email: "emily.davis@example.com",
            avatar: "https://randomuser.me/api/portraits/women/5.jpg",
            message: "Great platform for learning programming! The Python course was exactly what I needed to switch careers into data science.",
            rating: 5
        },
        {
            id: 6,
            name: "David Wilson",
            email: "david.wilson@example.com",
            avatar: "https://randomuser.me/api/portraits/men/6.jpg",
            message: "Outstanding quality content. The JavaScript fundamentals course laid a solid foundation for my web development journey.",
            rating: 4
        },
        {
            id: 7,
            name: "Lisa Anderson",
            email: "lisa.anderson@example.com",
            avatar: "https://randomuser.me/api/portraits/women/7.jpg",
            message: "The machine learning course exceeded my expectations. Complex topics explained in simple terms with practical examples.",
            rating: 5
        },
        {
            id: 8,
            name: "Robert Taylor",
            email: "robert.taylor@example.com",
            avatar: "https://randomuser.me/api/portraits/men/8.jpg",
            message: "Fantastic learning experience! The Node.js course helped me become a full-stack developer. Great value for money.",
            rating: 4
        },
        {
            id: 9,
            name: "Jennifer Martinez",
            email: "jennifer.martinez@example.com",
            avatar: "https://randomuser.me/api/portraits/women/9.jpg",
            message: "I appreciate the lifetime access and regular updates to course content. The instructors really care about student success.",
            rating: 5
        },
        {
            id: 10,
            name: "James Garcia",
            email: "james.garcia@example.com",
            avatar: "https://randomuser.me/api/portraits/men/10.jpg",
            message: "The CSS and design course transformed my frontend skills. Now I can create beautiful, responsive websites with confidence!",
            rating: 4
        },
        {
            id: 10,
            name: "James Garcia",
            email: "james.garcia@example.com",
            avatar: "https://randomuser.me/api/portraits/men/10.jpg",
            message: "The CSS and design course transformed my frontend skills. Now I can create beautiful, responsive websites with confidence!",
            rating: 4
        }
    ];

    // Auto-slide functionality
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => 
                (prev + 1) % Math.ceil(reviews.length / reviewsPerSlide)
            );
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, [reviews.length, reviewsPerSlide]);

    // Responsive reviews per slide
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setReviewsPerSlide(1);
            } else if (window.innerWidth < 1024) {
                setReviewsPerSlide(2);
            } else {
                setReviewsPerSlide(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalSlides = Math.ceil(reviews.length / reviewsPerSlide);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToSlide = (slideIndex) => {
        setCurrentSlide(slideIndex);
    };

    const renderStars = (rating) => {
        return (
            <>
                {[1, 2, 3, 4, 5].map(star => (
                    <FaStar 
                        key={star} 
                        color={star <= rating ? "#FACC15" : "#334155"} 
                    />
                ))}
            </>
        );
    };

    const getCurrentReviews = () => {
        const startIndex = currentSlide * reviewsPerSlide;
        return reviews.slice(startIndex, startIndex + reviewsPerSlide);
    };

    return (
        <div className="reviewContainer">
            <div className="ReviewConheading">
                Reviews from Other Learners
            </div>
            
            <div className="reviews-slider">
                <button className="slider-btn prev-btn" onClick={prevSlide}>
                    <FaChevronLeft />
                </button>
                
                <div className="reviewCards">
                    {getCurrentReviews().map((review) => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <img
                                    src={review.avatar}
                                    alt={review.name}
                                    className="review-avatar"
                                />
                                <div>
                                    <h4 className="review-name">{review.name}</h4>
                                    <p className="review-email">{review.email}</p>
                                </div>
                            </div>

                            <p className="review-message">
                                {review.message}
                            </p>

                            <div className="review-rating">
                                <span className="review-score">{review.rating}.0</span>
                                {renderStars(review.rating)}
                            </div>
                        </div>
                    ))}
                </div>
                
                <button className="slider-btn next-btn" onClick={nextSlide}>
                    <FaChevronRight />
                </button>
            </div>

            <div className="slider-dots">
                {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
}

export default ReviewHome;
