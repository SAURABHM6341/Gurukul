import React from 'react';
import './JobSkills.css';
import jobImg from '../../assets/job-skills.png'; // update with actual path

const JobSkills = () => {
  return (
    <div className="job-section">
      <div className="job-left">
        <h2>Get the skills you need for a <span>job that is in demand.</span></h2>
        <p>The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.</p>
        <button className="yellow-btn">Learn More</button>

        <div className="features">
          <div><strong>🎯 Leadership</strong><br />Fully committed to the success company</div>
          <div><strong>🎓 Responsibility</strong><br />Students will always be our top priority</div>
          <div><strong>💎 Flexibility</strong><br />The ability to switch is an important skill</div>
          <div><strong>💡 Solve the problem</strong><br />Code your way to a solution</div>
        </div>
      </div>

      <div className="job-right">
        <img src={jobImg} alt="Job Skill" />
        <div className="job-stats">
          <div><strong>10</strong><br />Years Experience</div>
          <div><strong>250</strong><br />Types of Courses</div>
        </div>
      </div>
    </div>
  );
};

export default JobSkills;
