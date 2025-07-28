import React from "react";
import './review.css'
import { FaStar } from 'react-icons/fa';
function ReviewHome() {
    return (
        <>
            <div className="reviewContainer">
                <div className="heading">
                    Reviews from Other Learners
                </div>
                <div className="reviewCards">
                    <div className="review-card">
                        <div className="review-header">
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="Esther Howard"
                                className="review-avatar"
                            />
                            <div>
                                <h4 className="review-name">Esther Howard</h4>
                                <p className="review-email">felicia.reid@example.com</p>
                            </div>
                        </div>

                        <p className="review-message">
                            Everyone’s on the same page. Many of our people are not very organized naturally, so Learn codings is a godsend!
                        </p>

                        <div className="review-rating">
                            <span className="review-score">4.5</span>
                            {[1, 2, 3, 4].map(star => (
                                <FaStar key={star} color="#FACC15" />
                            ))}
                            <FaStar color="#334155" /> {/* Gray last star */}
                        </div>
                    </div>
                    <div className="review-card">
                        <div className="review-header">
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="Esther Howard"
                                className="review-avatar"
                            />
                            <div>
                                <h4 className="review-name">Esther Howard</h4>
                                <p className="review-email">felicia.reid@example.com</p>
                            </div>
                        </div>

                        <p className="review-message">
                            Everyone’s on the same page. Many of our people are not very organized naturally, so Learn codings is a godsend!
                        </p>

                        <div className="review-rating">
                            <span className="review-score">4.5</span>
                            {[1, 2, 3, 4].map(star => (
                                <FaStar key={star} color="#FACC15" />
                            ))}
                            <FaStar color="#334155" /> {/* Gray last star */}
                        </div>
                    </div>
                    <div className="review-card">
                        <div className="review-header">
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="Esther Howard"
                                className="review-avatar"
                            />
                            <div>
                                <h4 className="review-name">Esther Howard</h4>
                                <p className="review-email">felicia.reid@example.com</p>
                            </div>
                        </div>

                        <p className="review-message">
                            Everyone’s on the same page. Many of our people are not very organized naturally, so Learn codings is a godsend!
                        </p>

                        <div className="review-rating">
                            <span className="review-score">4.5</span>
                            {[1, 2, 3, 4].map(star => (
                                <FaStar key={star} color="#FACC15" />
                            ))}
                            <FaStar color="#334155" /> {/* Gray last star */}
                        </div>
                    </div>
                    <div className="review-card">
                        <div className="review-header">
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="Esther Howard"
                                className="review-avatar"
                            />
                            <div>
                                <h4 className="review-name">Esther Howard</h4>
                                <p className="review-email">felicia.reid@example.com</p>
                            </div>
                        </div>

                        <p className="review-message">
                            Everyone’s on the same page. Many of our people are not very organized naturally, so Learn codings is a godsend!
                        </p>

                        <div className="review-rating">
                            <span className="review-score">4.5</span>
                            {[1, 2, 3, 4].map(star => (
                                <FaStar key={star} color="#FACC15" />
                            ))}
                            <FaStar color="#334155" /> {/* Gray last star */}
                        </div>
                    </div>
                    <div className="review-card">
                        <div className="review-header">
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="Esther Howard"
                                className="review-avatar"
                            />
                            <div>
                                <h4 className="review-name">Esther Howard</h4>
                                <p className="review-email">felicia.reid@example.com</p>
                            </div>
                        </div>

                        <p className="review-message">
                            Everyone’s on the same page. Many of our people are not very organized naturally, so Learn codings is a godsend!
                        </p>

                        <div className="review-rating">
                            <span className="review-score">4.5</span>
                            {[1, 2, 3, 4].map(star => (
                                <FaStar key={star} color="#FACC15" />
                            ))}
                            <FaStar color="#334155" /> {/* Gray last star */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default ReviewHome;