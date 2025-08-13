import React from 'react';
import './newCourse.css';
import { changestatus } from '../../../service/apis'
import { apiConnector } from '../../../service/apiconnector';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const PublishCourseForm = ({ courseData, setCourseData }) => {
    const token = useSelector((state) => state.auth?.token);
    const navigate = useNavigate();
    const handlePublishChange = (e) => {
        setCourseData({ ...courseData, status: e.target.checked ? 'published' : 'draft' });
    };
    const onSubmit = async () => {
        try {
            toast.dismiss();
            toast.loading("Updating course status...");
            const payload = { courseId: courseData._id, status: courseData.status };
            const response = await apiConnector("POST", changestatus.CHANGE_STATUS_API, {
                Authorization: `Bearer ${token}`
            }, payload);
            if (response.data.success) {
                toast.dismiss();
                toast.success("course is saved as per preference");
                console.log(response.data.course);
                navigate('/dashboard');
            }
        } catch (error) {
            console.log(error);
            toast.dismiss();
            toast.error("error occured");
        }
    }
    return (
        <div>
            <h2>Publish Settings</h2>
            <div className="form-group publishform">
                <div className="publishcheckform">
                    <div> <input
                        type="checkbox"
                        checked={courseData.status === 'published'}
                        onChange={handlePublishChange}
                        className='publishCheck' /></div>
                    <div><label className="checkbox-label"> Make this Course Public
                    </label></div>

                </div>
                <p>Checking this box will make your course visible to all students.</p>
            </div>

            <div className="form-actions">
                <button onClick={onSubmit} className="form-btn primary">Save </button>
            </div>
        </div>
    );
};

export default PublishCourseForm;