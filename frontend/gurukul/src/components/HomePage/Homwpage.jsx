import React from 'react';
import './homepage.css';
import HeroImage from '../../assets/HeroImage.png'; // Replace with your actual image path
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation'
import AnimatedCodeBlock from '../typingAnimation.jsx'

function HeroSection() {
    return (
        <>
            <div className="hero-container">
                <Link to={"/signup"} >
                    <div className="becomeButton">
                        <button className="instructor-btn">Become an Instructor</button>
                    </div>
                </Link>
                <h1 className="hero-title">
                    Empower Your Future with <span className="highlight">Coding Skills</span>
                </h1>
                <p className="hero-description">
                    With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
                </p>
                <div className="hero-buttons">
                    <button className="primary-btn">Learn More</button>
                    <button className="secondary-btn">Book a Demo</button>
                </div>
                <div className="hero-image-container">
                    <div className="HeroGradient"></div>
                    <img src={HeroImage} alt="Students coding" className="hero-image" />
                </div>
            </div>
            <div className="BigContainerHome">
                <div className="unlockPotentialContainer">
                    <div className="unlockPotentialTexts">
                        <div className="unlockPotential-text-heading">
                            <h1>Unlock your <span className='highlight' >Coding Potential</span> with our online courses.</h1>
                        </div>
                        <div className="unlockPotential-text-subheading">Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you.</div>
                        <div className="unlockPotential-text-Buttons">
                            <div className="tryPotentialContainer">
                                <button>Try it Yourself →</button>
                            </div>
                            <div className="learnPotentialContainer">
                                <button>
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="unlockPotentialCodeandGlow">
                        <AnimatedCodeBlock/>

                    </div>
                </div>
                {/* comment */}
                <div className="unlockPotentialContainer StartCodingContainer">
                    <div className="unlockPotentialCodeandGlow">
                        <div className="code-block">
                             <AnimatedCodeBlock/>

                        </div>
                    </div>
                    <div className="unlockPotentialTexts">
                        <div className="unlockPotential-text-heading">
                            <h1>Start <span className='highlight' >Coding in Seconds</span></h1>
                        </div>
                        <div className="unlockPotential-text-subheading">Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson.</div>
                        <div className="unlockPotential-text-Buttons">
                            <div className="ContinueLessonsContainer">
                                <button>Continue Lessons →</button>
                            </div>
                            <div className="learnPotentialContainer">
                                <button>
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="powerofCode">
                    <div className="headingPowerofCode">
                        Unlock the <span> Power of Code</span>
                    </div>
                    <div className="subheading-powerofCode">
                        Learn to Build Anything You Can Imagine
                    </div>
                    <div className="cards-powerodCode">
                        <div className="learHtml-powerCode">
                            <div className="learnHtml-heading">
                                Learn HTML
                            </div>
                            <div className="learnHtml-subheading">
                                This course covers the basic concepts of HTML including creating and structuring web pages, adding text, links, images, and more.
                            </div>
                            <div className="LearnHtml-bottom">
                                <div className="learnBeginner">@Beginner</div>
                                <div className="LearnLessons">#6 Lessons</div>
                            </div>
                        </div>
                        <div className="learnCss-powerofCode">
                            <div className="learncss-heading">
                                Learn CSS
                            </div>
                            <div className="learnCss-subheading">
                                This course covers the basic concepts of HTML including creating and structuring web pages, adding text, links, images, and more.
                            </div>
                            <div className="LearnCSS-bottom">
                                <div className="learnBeginner">@Beginner</div>
                                <div className="LearnLessons">#6 Lessons</div>
                            </div>
                        </div>
                        <div className="responsive-webdesigns-powerofCode">
                            <div className="learnresponse-heading">
                                Responsive Web Designs
                            </div>
                            <div className="learnresponse-subheading">
                                This course covers the basic concepts of HTML including creating and structuring web pages, adding text, links, images, and more.
                            </div>
                            <div className="Learnresponse-bottom">
                                <div className="learnBeginner">@Beginner</div>
                                <div className="LearnLessons">#6 Lessons</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='catalogButton'>
                <div className="explorecatalogbutton">
                    <button>Explore Full Catalog</button>
                </div>
                <div className="catalogLearn">
                    <button>Learn More</button>
                </div>
            </div>
        </>
    );
}

export default HeroSection;
