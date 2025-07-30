import React from "react";
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
                        Tell us more about yourself and what you’re got in mind.
                    </div>
                </div>
                <div className="getintouchForm">
                    <form>
                        <div className="FnameandLname">
                            <div className="FnameForm">
                                <label htmlFor="">First Name</label>
                                <input type="text" name="" id="" placeholder="Enter First Name" required/>
                            </div>

                            <div className="LnameForm">
                                <label htmlFor="">Last Name</label>
                                <input type="text" name="" id="" placeholder="Enter Last Name" required/>
                            </div>
                        </div>

                        <div className="EmailAddressForm">
                            <label htmlFor="">Email Address</label>
                            <input type="text" name="" id="" placeholder="Enter Email Address" required/>
                        </div>

                        <div className="phoneandcodeForm">
                            <label htmlFor="">Phone Number</label>
                            <div className="inputNumberForm">
                                <select name="" id="" defaultValue={+91}>
                                <option value="">+91</option>
                                <option value="">+1</option>
                                <option value="">other to be added</option>
                            </select>
                            <input type="text" name="" id="" placeholder="Enter Phone Number" required/>
                            </div>
                        </div>

                        <label htmlFor="">Message</label>
                        <div className="messageForm">
                            <input type="text" name="" id="" placeholder="Enter Your Message" required/>
                        </div>
                    </form>

                </div>
                <div className="getintouchButton">
                    <button>Send Message</button>
                </div>
            </div>
            </div>

        </div>
    </>);
}
export default ContactUs;