import {React,useState} from "react";
import ReviewHome from '../reviewshome/review.jsx';
import About1 from '../../assets/aboutsUs1.png';
import About2 from '../../assets/aboutUs2.png';
import About3 from '../../assets/aboutUs3.png';
import About4 from '../../assets/foundingStory.png'
import {toast} from 'react-hot-toast'
import { apiConnector } from "../../service/apiconnector.js";
import { submitquery } from "../../service/apis.js";
import './aboutus.css';
function AboutUs() {
        const [formData, setFormData] = useState({
            Fname: "",
            Lname: "",
            email: "",
            countryCode: "+91",
            phonenumber: "",
            userMessage: "",
        });
        const [loading, setLoading] = useState(false);
    
    
        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        };
        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true); // Start loading
    
            const payload = {
                ...formData,
                fullPhone: `${formData.countryCode}${formData.phonenumber}`
            };
    
            try {
                const response = await apiConnector("POST", submitquery.SUBMIT_QUERY_API, null, payload);
                if (response.data.success) {
                    toast.success("Query submitted successfully!");
                } else {
                    toast.error("Query submission failed.");
                }
            } catch (error) {
                toast.error("An error occurred while submitting the query.");
                console.log(error);
            } finally {
                setLoading(false); // End loading
            }
        }
    return (<>
        <div className="aboutus">
            <div className="aboutUsUpper">
                <div className="headingUpper"><h3>About Us</h3></div>
                <div className="uppertextHeading">
                    Driving Innovation in Online Education for a <span className="highlight" >Brighter Future</span>
                </div>
                <div className="smallTextupper">
                    GrurKul is at the forefront of driving innovation in online education. We're passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.
                </div>
            </div>
            <div className="imagesAboutUs">
                <img src={About1} alt="" />
                <img src={About2} alt="" />
                <img src={About3} alt="" />
            </div>
            <div className="aboutUsQuotes">
                <h2>"We are passionate about revolutionizing the way we learn. Our innovative platform <span className="highlight" >combines technology</span>, <span className="red-highlight" >expertise</span>, and community to create an <span className="yellow-highlight" >unparalleled educational experience.</span> "</h2>
            </div>
            <div className="FoundingStory-AboutUs">
                <div className="FoundingStoryText">
                    <div className="FoundingStoryText1">
                        <h1>Our Founding Story </h1>
                    </div>
                    <div className="FoundingStoryText2">
                        <p>Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.</p>
                    </div>
                    <div className="FoundingStoryText3">
                        <p>As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. We believed that education should not be confined to the walls of a classroom or restricted by geographical boundaries. We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.</p>
                    </div>
                </div>
                <div className="FOundingStoryImage">
                    <img src={About4} alt="" />
                </div>
            </div>
            <div className="mission-vision">
                <div className="visionTexts">
                    <div className="VisionTexts1">
                        <p>Our Vision</p>
                    </div>
                    <div className="VisionTexts2">
                        <p>With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content, fostering a dynamic and interactive learning experience.</p>
                    </div>
                </div>
                <div className="MissionTexts">
                    <div className="MissionTexts1">
                        <p>Our Mission</p>
                    </div>
                    <div className="MissionTexts2">
                        <p>our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.</p>
                    </div>
                </div>

            </div>
            <div className="ribbonOuterContainer">
                <div className="statsRibbon">
                    <div className="ActiveStudents stripeee ">
                        <div className="NumberRibbon">5K</div>
                        <div className="RibbonSubheading">Active Students</div>
                    </div>
                    <div className="Mentors stripeee ">
                        <div className="NumberRibbon">10+</div>
                        <div className="RibbonSubheading">Mentors</div>
                    </div>
                    <div className="Courses stripeee ">
                        <div className="NumberRibbon">200+</div>
                        <div className="RibbonSubheading">Courses</div>
                    </div>
                    <div className="Awards stripeee ">
                        <div className="NumberRibbon">50+</div>
                        <div className="RibbonSubheading">Awards</div>
                    </div>
                </div>
            </div>
            <div className="WorldClassLearning">
                <div className="WorldClassLearning-upper">
                    <div className="WorldClassLearning-upper-text">
                        <div className="WorldClassLearningHEading">World-Class Learning for <span className="highlight-gradientBlue" >Anyone, Anywhere</span></div>
                        <div className="WorldClassLearningtexts">GuruKul partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.</div>
                        <div className="WorldClassLearningButtons">
                            <button>Learn More</button>
                        </div>
                    </div>
                    <div className="WorldClassLearning-upper-tiles">
                        <div className="WorldClassLearning-tile1 worldTile">
                            <div className="WorldClassLearningtileheading">Curriculum Based on Industry Needs</div>
                            <div className="WorldClassLearningtiletexts">Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.</div>
                        </div>
                        <div className="WorldClassLearning-tile2 worldTile">
                            <div className="WorldClassLearningtileheading">Our Learning
                                Methods</div>
                            <div className="WorldClassLearningtiletexts">The learning process uses the namely online and offline.</div>
                        </div>
                    </div>
                </div>
                <div className="WorldClassLearning-lower">
                    <div className="worldTile-tile3 worldTile">
                        <div className="WorldClassLearningtileheading">Certification</div>
                        <div className="WorldClassLearningtiletexts">You will get a certificate that can be used as a certification during job hunting.</div>
                    </div>
                    <div className="worldTile-tile4 worldTile">
                        <div className="WorldClassLearningtileheading">Rating
                            "Auto-grading"</div>
                        <div className="WorldClassLearningtiletexts">You will immediately get feedback during the learning process without having to wait for an answer or response from the mentor.</div>
                    </div>
                    <div className="worldTile-tile5 worldTile">
                        <div className="WorldClassLearningtileheading">Ready to
                            Work</div>
                        <div className="WorldClassLearningtiletexts">Connected with over 150+ hiring partners, you will have the opportunity to find a job after graduating from our program.</div>
                    </div>
                </div>
            </div>
            <div className="getIntouch">
                <div className="getintouchTexts">
                    <div className="getintouchHeading">
                        Get in Touch
                    </div>
                    <div className="getintouchsubTexts">
                        We’d love to here for you, Please fill out this form.
                    </div>
                </div>
                <div className="getintouchForm">
                        <form onSubmit={handleSubmit} >
                            <div className="FnameandLname">
                                <div className="FnameForm">
                                    <label htmlFor="">First Name</label>
                                    <input onChange={handleChange} type="text" name="Fname" value={formData.Fname} placeholder="Enter First Name" required />
                                </div>

                                <div className="LnameForm">
                                    <label htmlFor="">Last Name</label>
                                    <input onChange={handleChange} type="text" name="Lname" value={formData.Lname} placeholder="Enter Last Name" required />
                                </div>
                            </div>

                            <div className="EmailAddressForm">
                                <label htmlFor="">Email Address</label>
                                <input onChange={handleChange} type="text" name="email" value={formData.email} placeholder="Enter Email Address" required />
                            </div>

                            <div className="phoneandcodeForm">
                                <label htmlFor="">Phone Number</label>
                                <div className="inputNumberForm">
                                    <select name="countryCode" onChange={handleChange} value={formData.countryCode}>
                                        <option value="+91">+91</option>
                                        <option value="+1">+1</option>
                                        <option value="custom">Other</option>
                                    </select>

                                    <input type="text" onChange={handleChange} name="phonenumber" value={formData.phonenumber} placeholder="Enter Phone Number" required />
                                </div>
                            </div>

                            <label htmlFor="">Message</label>
                            <div className="messageForm">
                                <input type="text" onChange={handleChange} name="userMessage" value={formData.userMessage} placeholder="Enter Your Message" required />
                            </div>
                            <div className="getintouchButton">
                                <button type='submit' disabled={loading}>
                                    {loading ? "Submitting..." : "Send Message"}
                                </button>
                            </div>

                        </form>

                    </div>
            </div>
            <ReviewHome />
        </div>
    </>);
}
export default AboutUs;