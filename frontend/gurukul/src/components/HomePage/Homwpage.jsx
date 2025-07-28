import React from 'react';
import './homepage.css';
import HeroImage from '../../assets/HeroImage.png'; // Replace with your actual image path

function HeroSection() {
    return (
        <>
            <div className="hero-container">
                <button className="instructor-btn">Become an Instructor</button>
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
                    <div className="code-block">
                        <pre>
                            <code>
                                <span className="yellow">&lt;!DOCTYPE html&gt;</span><br />
                                <span className="white">&lt;html&gt;</span><br />
                                <span className="white">  &lt;head&gt;&lt;title&gt;</span><span className="gray">Example</span><span className="white">&lt;/title&gt;</span><br />
                                <span className="white">  &lt;link </span>
                                <span className="red">rel</span>=<span className="green">"stylesheet"</span> <span className="red">href</span>=<span className="green">"styles.css"</span><span className="white">&gt;</span><br />
                                <span className="white">  &lt;/head&gt;</span><br />
                                <span className="white">  &lt;body&gt;</span><br />
                                <span className="white">    &lt;h1&gt;&lt;a </span><span className="red">href</span>=<span className="green">"/"</span><span className="white">&gt;</span><span className="gray">Header</span><span className="white">&lt;/a&gt;&lt;/h1&gt;</span><br />
                                <span className="white">    &lt;nav&gt;</span><br />
                                <span className="white">      &lt;a </span><span className="red">href</span>=<span className="green">"one/"</span><span className="white">&gt;</span><span className="gray">One</span><span className="white">&lt;/a&gt;</span>
                                <span className="white">&lt;a </span><span className="red">href</span>=<span className="green">"two/"</span><span className="white">&gt;</span><span className="gray">Two</span><span className="white">&lt;/a&gt;</span>
                                <span className="white">&lt;a </span><span className="red">href</span>=<span className="green">"three/"</span><span className="white">&gt;</span><span className="gray">Three</span><span className="white">&lt;/a&gt;</span><br />
                                <span className="white">    &lt;/nav&gt;</span><br />
                                <span className="white">  &lt;/body&gt;</span><br />
                                <span className="white">&lt;/html&gt;</span>
                            </code>
                        </pre>
                    </div>
                </div>
            </div>
            {/* comment */}
            <div className="unlockPotentialContainer StartCodingContainer">
                <div className="unlockPotentialCodeandGlow">
                    <div className="code-block">
                        <pre>
                            <code>
                                <span className="yellow">&lt;!DOCTYPE html&gt;</span><br />
                                <span className="white">&lt;html&gt;</span><br />
                                <span className="white">  &lt;head&gt;&lt;title&gt;</span><span className="gray">Example</span><span className="white">&lt;/title&gt;</span><br />
                                <span className="white">  &lt;link </span>
                                <span className="red">rel</span>=<span className="green">"stylesheet"</span> <span className="red">href</span>=<span className="green">"styles.css"</span><span className="white">&gt;</span><br />
                                <span className="white">  &lt;/head&gt;</span><br />
                                <span className="white">  &lt;body&gt;</span><br />
                                <span className="white">    &lt;h1&gt;&lt;a </span><span className="red">href</span>=<span className="green">"/"</span><span className="white">&gt;</span><span className="gray">Header</span><span className="white">&lt;/a&gt;&lt;/h1&gt;</span><br />
                                <span className="white">    &lt;nav&gt;</span><br />
                                <span className="white">      &lt;a </span><span className="red">href</span>=<span className="green">"one/"</span><span className="white">&gt;</span><span className="gray">One</span><span className="white">&lt;/a&gt;</span>
                                <span className="white">&lt;a </span><span className="red">href</span>=<span className="green">"two/"</span><span className="white">&gt;</span><span className="gray">Two</span><span className="white">&lt;/a&gt;</span>
                                <span className="white">&lt;a </span><span className="red">href</span>=<span className="green">"three/"</span><span className="white">&gt;</span><span className="gray">Three</span><span className="white">&lt;/a&gt;</span><br />
                                <span className="white">    &lt;/nav&gt;</span><br />
                                <span className="white">  &lt;/body&gt;</span><br />
                                <span className="white">&lt;/html&gt;</span>
                            </code>
                        </pre>
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
