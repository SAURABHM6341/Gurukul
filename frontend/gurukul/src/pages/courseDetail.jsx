import React from "react";
import Header from '../components/header/header'
import Footer from '../components/footr/footer'
import ReviewHome from '../components/reviewshome/review'
import CourseDetails from '../components/courseDetail/courseDetail'

function CourseDet() {
    return (<>
    <Header/>
    <CourseDetails/>
    <ReviewHome/>
    <Footer/>
    </>);
}
export default CourseDet;
