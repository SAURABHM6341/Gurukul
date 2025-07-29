import React from "react";
import  HeroSection  from '../components/HomePage/Homwpage.jsx'
import Header from "../components/header/header.jsx";
import LanguageProgress from "../components/swiss/swiss.jsx";
import JobSkills from "../components/jobSkills/JobSkills.jsx";
import BecomeInstructor from "../components/becomeInstructor/becomeInstructor";
import ReviewHome from "../components/reviewshome/review.jsx";
import Footer from "../components/footr/footer.jsx";111827
function HomePage() {
    return (
        <>
            <Header />
            <HeroSection />
            <LanguageProgress />
            <JobSkills />
            <BecomeInstructor />
            <ReviewHome />
            <Footer />

        </>
    );
}
export default HomePage;