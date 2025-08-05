import React from 'react';
import './newCourse.css';
const PublishCourseForm = ({ courseData, setCourseData, onSubmit, onBack }) => {

    const handlePublishChange = (e) => {
        setCourseData({ ...courseData, status: e.target.checked ? 'Published' : 'Draft' });
    };

    return (
        <div>
            <h2>Publish Settings</h2>
            <div className="form-group publishform">
                <div className="publishcheckform">
                   <div> <input
                    type="checkbox"
                    checked={courseData.status === 'Published'}
                    onChange={handlePublishChange}
                    className='publishCheck'/></div>
                <div><label className="checkbox-label"> Make this Course Public
                </label></div>

                </div>
                <p>Checking this box will make your course visible to all students.</p>
            </div>

            <div className="form-actions">
                <button onClick={onBack} className="form-btn">Back</button>
                <button className="form-btn">Save as Draft</button>
                <button onClick={onSubmit} className="form-btn primary">Save and Publish</button>
            </div>
        </div>
    );
};

export default PublishCourseForm;