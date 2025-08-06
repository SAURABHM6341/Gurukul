import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './newCourse.css';

// Import the step components
import CourseInformationForm from './courseInformation';
import CourseBuilderForm from './CourseBuilderForm';
import PublishCourseForm from './PublishCourseForm';


const AddCourse = ({onBack}) => {
    const [step, setStep] = useState(1);
    const [courseData, setCourseData] = useState({
        courseName: '',
        courseDescription: '',
        price: '',
        tag: '',
        whatToLearn: '',
        status: 'Draft',
        courseContent: [],
        _id:"",
        thumbnail:"",
        thumbnailfile:null
    });



    const handleNext = () => {
        setStep(prev => prev + 1);
    };
    

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return <CourseInformationForm courseData={courseData} setCourseData={setCourseData} onNext={handleNext} />;
            case 2:
                return <CourseBuilderForm courseData={courseData} setCourseData={setCourseData} onNext={handleNext}  />;
            case 3:
                return <PublishCourseForm courseData={courseData} setCourseData={setCourseData}   />;
            default:
                return <div>Unknown Step</div>;
        }
    };
    
    return (
        <div className="add-course-container">
            <p onClick={onBack} style={{ color: "#facc15", textDecoration: "underline", cursor: "pointer" }}>
                    Back to MyCourse
                </p>
            <div className="add-course-stepper">
                <div className={`step ${step >= 1 ? 'active' : ''}`}>
                    <div className="step-number">1</div>
                    <div className="step-label">Course Information</div>
                </div>
                <div className={`step-connector ${step > 1 ? 'active' : ''}`}></div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}>
                    <div className="step-number">2</div>
                    <div className="step-label">Course Builder</div>
                </div>
                <div className={`step-connector ${step > 2 ? 'active' : ''}`}></div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <div className="step-label">Publish</div>
                </div>
            </div>

            <div className="add-course-content">
                {renderStepContent()}
            </div>
        </div>
    );
};

export default AddCourse;