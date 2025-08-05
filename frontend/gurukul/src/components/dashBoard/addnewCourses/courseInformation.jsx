import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast'
import { apiConnector } from '../../../service/apiconnector';
import { createCourse, categories } from '../../../service/apis';
import { useSelector } from 'react-redux'
const CourseInformationForm = ({ courseData = null, setCourseData, onNext }) => {

    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    if (!courseData) {
        return <div>Loading form...</div>; // Prevent render crash
    }

    const handleChange = (e) => {
        setCourseData({ ...courseData, [e.target.name]: e.target.value });
    };
    const token = useSelector((state) => state.auth?.token)
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCourseData({ ...courseData, thumbnailfile: file });
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };
    const CourseCreate = async () => {
        const payload = new FormData();
        payload.append("courseName", courseData.courseName);
        payload.append("courseDescription", courseData.courseDescription);
        payload.append("price", courseData.price);
        payload.append("tag", courseData.tag);
        payload.append("whatToLearn", courseData.whatToLearn);

        if (courseData.thumbnailfile) {
            payload.append("thumbnail", courseData.thumbnailfile); 
        }
        try {
    const res = await apiConnector("POST", createCourse.CREATE_COURSE_API, `Bearer ${token}`, payload);
    console.log("API Response", res);

    if (res?.data?.success) {
        toast.dismiss();
        toast.success("Course creation successful. Proceeding...");
        setCourseData({ ...res.data.course, thumbnailfile: courseData.thumbnailfile }); 
        onNext();
    } else {
        toast.dismiss();
        toast.error("Course creation failed. Please try again.");
        console.log("Unexpected response:", res?.data);
    }
} catch (err) {
    toast.dismiss();
    toast.error("Something went wrong while creating the course.");
    console.error("Error while creating course →", err);
}
    }
    const handleNext = () => {
        const { courseName, courseDescription, price, tag, thumbnailfile, whatToLearn } = courseData;

        if (!courseName.trim()) {
            toast.dismiss();
            toast.error("Course title is required");
            return;
        }
        if (!courseDescription.trim()) {
            toast.dismiss();
            toast.error("Short description is required");
            return;
        }
        if (!price) {
            toast.dismiss();
            toast.error("Price is required");
            return;
        }
        if (!tag) {
            toast.dismiss();
            toast.error("Please select a category");
            return;
        }
        if (!thumbnailfile) {
            toast.dismiss();
            toast.error("Course thumbnail is required");
            return;
        }
        if (!whatToLearn.trim()) {
            toast.dismiss();
            toast.error("Please provide at least one benefit");
            return;
        }
        CourseCreate();
    };
    const [Catalog,setCatalog] = useState([]);
    const fetchCategories = async () => {
            try {
                const result = await apiConnector("GET", categories.CATEGORIES_API)
                console.log("print result catalog", result)
                if (result?.data?.tags) {
                    setCatalog(result.data.tags);
                } else {
                    setCatalog([]);
                }
            } catch (err) {
                console.log("could not fetch the lists", err);
            }
        };
        useEffect(() => {
            fetchCategories();
        }, []);
    return (
        <div>
            <div>
                <h1>Course Information</h1>
                {/* Course Title */}
                <div className="form-group">
                    <label htmlFor="courseName">Course Title <span style={{ color: "red" }} >*</span></label>
                    <input
                        type="text"
                        id="courseName"
                        name="courseName"
                        className="form-input"
                        value={courseData.courseName}
                        onChange={handleChange}
                        placeholder="Enter Course Title"
                        required
                    />
                </div>

                {/* Course Short Description */}
                <div className="form-group">
                    <label htmlFor="courseDescription">Course Short Description<span style={{ color: "red" }} >*</span> </label>
                    <textarea
                        id="courseDescription"
                        name="courseDescription"
                        className="form-textarea"
                        value={courseData.courseDescription}
                        onChange={handleChange}
                        placeholder="Enter Description"
                        required
                    ></textarea>
                </div>

                {/* Price */}
                <div className="form-group">
                    <label htmlFor="price">Price<span style={{ color: "red" }} >*</span></label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        className="form-input"
                        value={courseData.price}
                        onChange={handleChange}
                        placeholder="Enter Price"
                        required
                    />
                </div>

                {/* Category */}
                <div className="form-group">
                    <label htmlFor="tag">Category <span style={{ color: "red" }} >*</span></label>
                     <select  id="tag"
                        name="tag"
                        className="form-select"
                        value={courseData.tag}
                        onChange={handleChange}
                        required>
                            <option value="">Select Category</option>
                    {
                            Catalog.length > 0 ? (
                                Catalog.map((element, index) =>

                                   
                                        <option >
                                        {element.name}
                                    </option>
                               
                                )
                            ) : (<div className="categoriestags" ></div>)
                        }
                             </select>
                </div>

                {/* Course Thumbnail Uploader */}
                <div className="form-group">
                    <label htmlFor="thumbnail-input">Course Thumbnail <span style={{ color: "red" }} >*</span></label>

                    <div
                        className="thumbnail-uploader"
                        onClick={() => document.getElementById('thumbnail-input').click()}
                    >
                        {thumbnailPreview ? (
                            <img
                                src={thumbnailPreview}
                                alt="Thumbnail Preview"
                                width={"250px"}
                                height={"150px"}
                                className="thumbnail-preview"
                            />
                        ) : (
                            <div className="thumbnail-placeholder">
                                <p>
                                    Drag and drop an image, or{" "}
                                    <span className="browse-link">Browse</span>
                                </p>
                                <small>Aspect ratio 16:9 | Recommended size 1024x576</small>
                            </div>
                        )}
                    </div>
                    <input
                        required
                        type="file"
                        id="thumbnail-input"
                        name="thumbnailfile"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: "none" }} // hide input properly
                    />
                </div>


                {/* Benefits of the course (Dynamic List) */}
                <div className="form-group">
                    <label>Benefits of the course <span style={{ color: "red" }} >*</span></label>
                    <input
                        type="text"
                        className="form-input"
                        name="whatToLearn"
                        value={courseData.whatToLearn}
                        onChange={handleChange}
                        placeholder="Enter a benefit"
                        required
                    />


                </div>


                {/* Form Actions */}
                <div className="form-actions">
                    <button onClick={handleNext} className="form-btn primary">Next</button>
                </div>
            </div>
        </div>
    );
};

export default CourseInformationForm;