import React from "react";
function Allcourses() {
    return (
        <>
            <div className="coursesupper">
                <div className="coursename-description">
                    <div className="coursePath">
                        Home/Catalog/<span className="highlight" >TagName</span>
                    </div>
                    <div className="nameOfTag">
                        TagName
                    </div>
                    <div className="tagDescription">
                        this is the description of TAG
                    </div>
                </div>
                <div className="related-resources">
                    <div className="heading-resources">
                        Related Resources
                    </div>
                    <div className="resourcesList">
                        <ul>
                            <li>resource 1</li>
                            <li>resource 2</li>
                            <li>resource 3</li>
                            <li>resource 4</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="coursestartedContainer">
                <div className="displaycourseStarted">
                    <div className="headingCourseStarted">
                        
                    </div>
                </div>
                <div className="forwardButtonCorse">
                    <img src="" alt="" />
                </div>
            </div>
        </>
    );
}
export default Allcourses;