import React from 'react';
import { FaStar } from 'react-icons/fa';
import './courcard.css';

const CourseCard = ({ course }) => {
  const ratingStars = Array.from({ length: 5 }, (_, index) => (
    <FaStar key={index} className={index < course.averageRating ? 'star-filled-course' : 'star-empty-course'} />
  ));
console.log("course card ", course);
  return (
    <div className="course-card-course">
      <img src={course.thumbnail} alt={`${course.courseName} thumbnail`} className="course-card-image-course" />
      <div className="course-card-content-course">
        <h3 className="course-card-title-course">{course.courseName}</h3>
        <div className="course-card-rating-course">
          {ratingStars}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;