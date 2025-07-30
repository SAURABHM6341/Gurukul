import React from 'react';
import './JobSkills.css';
import jobImg from '../../assets/job-skills.png'; // update with actual path
import leaderImg from '../../assets/fi-sr-badge.png';
import ResponsibilityImg from '../../assets/fi-sr-graduation-cap.png';
import FlexibilityImg from '../../assets/fi-sr-diamond.png'
import problemImg from '../../assets/Subtract.png'
function JobSkills() {
  const timeline = [
    {
      logo: leaderImg,
      Heading: "Leadership",
      Description: "Fully committed to the success company"
    },
    {
      logo: ResponsibilityImg,
      Heading: "Responsibility",
      Description: "Students will always be our top priority"
    },
    {
      logo: FlexibilityImg,
      Heading: "Flexibility",
      Description: "The ability to switch is an important skill"
    },
    {
      logo: problemImg,
      Heading: "Solve the problem",
      Description: "Code your way to a solution"
    }
  ];
  return (
    <div className="job-section">
      <div className="job-left">
        <h2>Get the skills you need for a <span>job that is in demand.</span></h2>
        <p>The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.</p>
        <button className="yellow-btn">Learn More</button>

        <div className="features">{

          timeline.map((element, index) => {
            return (
              <>
            <div key={index} className='timlineAll'>
              <div className="imageTimeline">
                <img src={element.logo} alt="" />
              </div>
              <div className="TextTimeline">
                <div className="HeadingTimeline">
                  {element.Heading}
                </div>
                <div className="subHeadingTimeline">
                  {element.Description}
                </div>
              </div>
            </div>
            <div className="dashedLines"></div>  </>
          );
          })
        }

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
