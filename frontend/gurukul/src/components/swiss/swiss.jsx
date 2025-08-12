import React from 'react';
import './swiss.css';
import calenderImg from '../../assets/calender.png'
import { useNavigate } from 'react-router-dom';

const LanguageProgress = () => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    navigate('/aboutus');
  };

  return (
    <div className="lang-section">
      <h2>Your swiss knife for <span>learning any language</span></h2>
      <p>Using spin making learning multiple languages easy. With 20+ languages, realistic voice-over, progress tracking, custom schedule and more.</p>
      
      <div className="lang-cards">
        <div className="card blue-card">
          <div className="progressText">
            <h4>Know your progress</h4>
          </div>
          <div className="downcard">
            <p>🖥 HTML</p>
            <div className='current-league'>your current league</div>
          <div className="stats">
            <div className='stats-1 stats12' ><strong>420</strong><br />Spin earned</div>
            <div className='stats-2 stats12'><strong>1254</strong><br />Minutes in app</div>
          </div>
          </div>
        </div>

        <div className="card pink-card">
          <div className="headingyellow">
            <h4>Compare with others</h4>
          </div>
          <div className="nameofstudents">
            <div>Wade Warren</div>
            <div>Jane Cooper</div>
            <div>Eleanor Pena</div>
            <div>Ralph Edwards</div>
          </div>
        </div>

        <div className="card yellow-card">
          <div className="textyellowcard">
            <h4>Plan your lessons</h4>
          </div>
          <div className="imageyellowcard">
            <img src={calenderImg} alt="" height="" width="270px"
            style={{transform:'rotate(-9deg)'}}
            />
          </div>
        </div>
      </div>

      <button className="yellow-btn" onClick={handleLearnMore}>Learn More</button>
    </div>
  );
};

export default LanguageProgress;
