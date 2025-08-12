import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaStar } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

const ReviewModal = ({ isOpen, onClose, onSubmit,user }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');


    if (!isOpen) return null;

    const handleFormSubmit = () => {
        if (rating === 0 || !reviewText) {
            toast.dismiss();
            toast.error("Please provide a rating and a review.");
            return;
        }
        onSubmit({ rating, reviewText });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><IoClose /></button>
                <div className="modal-header">
                    <h3>Add Review</h3>
                </div>
                <div className="modal-body">
                    <div className="user-info">
                        <img src={user?.image} alt="User" className="user-avatar" />
                        <div>
                            <p className="user-name">{user.Fname} {user.Lname}</p>
                            <p className="posting-status">Posting Publicly</p>
                        </div>
                    </div>
                    <div className="star-rating">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <FaStar
                                    key={index}
                                    className="star-icon"
                                    color={ratingValue <= (hoverRating || rating) ? "#FFD60A" : "#e4e5e9"}
                                    size={30}
                                    onMouseEnter={() => setHoverRating(ratingValue)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(ratingValue)}
                                />
                            );
                        })}
                    </div>
                    <textarea
                        className="review-textarea"
                        placeholder="Share details of your own experience for this course"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                    />
                </div>
                <div className="modal-footer">
                    <button className="modal-btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="modal-btn-submit" onClick={handleFormSubmit}>Submit Review</button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;