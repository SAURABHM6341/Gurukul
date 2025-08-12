import React from 'react';
import './becomeInstructor.css';
import instructorImg from '../../assets/instructorImg.png'; // update with actual path
import { useNavigate } from 'react-router-dom';

const BecomeInstructor = () => {
  const navigate = useNavigate();

  const handleStartTeaching = () => {
    navigate('/signup');
  };

  return (
    <div className="instructor-section">
      <img src={instructorImg} alt="Instructor" className="instructor-image" />
      <div className="instructor-content">
        <h2>Become an <span>instructor</span></h2>
        <p>Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.</p>
        <button className="yellow-btn" onClick={handleStartTeaching}>Start Teaching Today →</button>
      </div>
    </div>
  );
};

export default BecomeInstructor;
