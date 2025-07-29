import React from "react";
import ReviewHome from '../reviewshome/review.jsx';
import './contact.css';
import globeLogo from '../../assets/globeLogo.png';
import calllogo from '../../assets/calllogo.png';
import chatlogo from '../../assets/chatlogo.png';
function ContactUs() {
    return (<>
        <div className="contact">
            <div className="contactleft">
                <div className="chatwithUs">
                    <div className="chatphoto">
                        <img src={chatlogo} alt="" />
                    </div>
                    <div className="chatTexts">
                        <div className="chattextheading">Chat on us</div>
                        <div className="chattextSubheading">Our friendly team is here to help. @mail address</div>
                    </div>
                </div>
                <div className="VisitUs">
                    <div className="globephoto">
                       <img src={globeLogo} alt="" />
                    </div>
                    <div className="globeTexts">
                        <div className="Globetextheading">Visit us</div>
                        <div className="GlobetextSubheading">
                            Come and say hello at our office HQ. Here is the location/ address
                        </div>
                    </div>
                </div>
                <div className="CallUs">
                    <div className="Callphoto">
                        <img src={calllogo} alt="" />
                    </div>
                    <div className="callTexts">
                        <div className="calltextheading">Call us</div>
                        <div className="calltextSubheading">Mon - Fri From 8am to 5pm
                            +123 456 7890
                        </div>
                    </div>
                </div>

            </div>
            <div className="contactright">
                <div className="getIntouch">
                    <div className="getintouchTexts">
                        <div className="getintouchHeading">
                            Got a Idea? We’ve got the skills. Let’s team up
                        </div>
                        <div className="getintouchsubTexts">
                            Tall us more about yourself and what you’re got in mind.
                        </div>
                    </div>
                    <div className="getintouchForm">
                        <form>
                            <label htmlFor="">First Name</label>
                            <input type="text" name="" id="" placeholder="Enter First Name" />

                            <label htmlFor="">Last Name</label>
                            <input type="text" name="" id="" placeholder="Enter Last Name" />

                            <label htmlFor="">Email Address</label>
                            <input type="text" name="" id="" placeholder="Enter Email Address" />

                            <label htmlFor="">Phone Number</label>
                            <select name="" id="" defaultValue={+91}>
                                <option value="">+91</option>
                                <option value="">+1</option>
                                <option value="">other to be added  </option>
                            </select>
                            <input type="text" name="" id="" placeholder="Enter Phone Number" />

                            <label htmlFor="">Message</label>
                            <input type="text" name="" id="" placeholder="Enter Your Message" />
                        </form>

                    </div>
                    <div className="getintouchButton">
                        <button>Send Message</button>
                    </div>
                </div>
            </div>

        </div>
        <ReviewHome />
    </>);
}
export default ContactUs;