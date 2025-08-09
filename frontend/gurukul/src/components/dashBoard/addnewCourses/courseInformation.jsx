import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../../../service/apiconnector';
import { createCourse, categories, deleteEditCourse } from '../../../service/apis';
import { useSelector } from 'react-redux';

const CourseInformationForm = ({ courseData = null, setCourseData, onNext, isEditing }) => {
    const token = useSelector((state) => state.auth?.token);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [Catalog, setCatalog] = useState([]);
    const [courseInfo, setOriginalCourseData] = useState(courseData)
    useEffect(() => {
        // Set preview from existing thumbnail if editing
        if (isEditing && courseData?.thumbnail && !thumbnailPreview) {
            setThumbnailPreview(courseData.thumbnail);
        }
    }, [courseData, isEditing, thumbnailPreview]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await apiConnector("GET", categories.CATEGORIES_API);
                if (result?.data?.tags) {
                    setCatalog(result.data.tags);
                }
            } catch (err) {
                console.error("Could not fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    if (!courseData) {
        return <div>Loading form...</div>;
    }

    const handleChange = (e) => {
        setCourseData({ ...courseData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCourseData({ ...courseData, thumbnailfile: file });
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };
    const isCourseDataChanged = () => {
        const fieldsToCompare = ["courseName", "courseDescription", "price", "whatToLearn"];

        for (let field of fieldsToCompare) {
            if (courseData[field] !== courseInfo[field]) {
                return true;
            }
        }

        // Check if thumbnail file is newly selected
        if (courseData.thumbnailfile) {
            return true;
        }

        return false;
    }
    const handleNext = async () => {
        const { courseName, courseDescription, price, tag, thumbnailfile, whatToLearn, thumbnail } = courseData;
        if (!courseName.trim()) return toast.error("Course title is required");
        if (!courseDescription.trim()) return toast.error("Short description is required");
        if (!price) return toast.error("Price is required");
        if (!tag) return toast.error("Please select a category");
        if (!thumbnailfile && !isEditing) return toast.error("Course thumbnail is required");
        if (!whatToLearn.trim()) return toast.error("Please provide at least one benefit");

        if (isEditing) {
            if (!isCourseDataChanged()) {
                toast.success("No changes detected");
                return onNext();
            }

            try {
                toast.loading("Saving changes...");
                const payload = new FormData();
                payload.append("courseName", courseName);
                payload.append("courseDescription", courseDescription);
                payload.append("price", price);
                payload.append("whatToLearn", whatToLearn);
                if (thumbnailfile) {
                    console.log("running till here")
                    payload.append("thumbnail", thumbnailfile);
                }
                const res = await apiConnector("PUT", `${deleteEditCourse.UPDATE_COURSE_API}/${courseData._id}`, `Bearer ${token}`, payload);
                if (res?.data?.success) {
                    setCourseData({ ...res.data.course, thumbnailfile });
                    toast.dismiss();
                    toast.success("Course info updated");
                }
                else {
                    toast.dismiss();
                    toast.error("Failed to update course info");
                }
                onNext();
            } catch (err) {
                toast.dismiss();
                toast.error("Failed to update course info");
                console.error("Update error:", err);

            }
        }

        else {

            // Create new course logic
            toast.loading("Creating Course...");
            const payload = new FormData();
            payload.append("courseName", courseName);
            payload.append("courseDescription", courseDescription);
            payload.append("price", price);
            payload.append("tag", tag);
            payload.append("whatToLearn", whatToLearn);
            if (thumbnailfile) payload.append("thumbnail", thumbnailfile);

            try {
                const res = await apiConnector("POST", createCourse.CREATE_COURSE_API, `Bearer ${token}`, payload);
                toast.dismiss();
                if (res?.data?.success) {
                    toast.success("Course created successfully. Proceeding...");
                    setCourseData({ ...res.data.course, thumbnailfile });
                    onNext();
                } else {
                    toast.error("Course creation failed. Try again.");
                }
            } catch (err) {
                toast.dismiss();
                toast.error("Error creating course");
                console.error("API Error →", err);
            }
        }
    };

    return (
        <div>
            <h1>Course Information</h1>

            {/* Course Title */}
            <div className="form-group">
                <label>Course Title <span style={{ color: "red" }}>*</span></label>
                <input
                    type="text"
                    name="courseName"
                    className="form-input"
                    value={courseData.courseName}
                    onChange={handleChange}
                    placeholder="Enter Course Title"
                />
            </div>

            {/* Description */}
            <div className="form-group">
                <label>Short Description <span style={{ color: "red" }}>*</span></label>
                <textarea
                    name="courseDescription"
                    className="form-textarea"
                    value={courseData.courseDescription}
                    onChange={handleChange}
                    placeholder="Enter Description"
                ></textarea>
            </div>

            {/* Price */}
            <div className="form-group">
                <label>Price <span style={{ color: "red" }}>*</span></label>
                <input
                    type="number"
                    name="price"
                    className="form-input"
                    value={courseData.price}
                    onChange={handleChange}
                    placeholder="Enter Price"
                />
            </div>

            {/* Category */}
            {
                !isEditing && <div className="form-group">
                    <label>Category <span style={{ color: "red" }}>*</span></label>
                    <select
                        name="tag"
                        className="form-select"
                        value={courseData.tag}
                        onChange={handleChange}
                    >
                        <option value="">Select Category</option>
                        {Catalog.map((element, index) => (
                            <option key={element._id || index} value={element.name}>
                                {element.name}
                            </option>
                        ))}
                    </select>
                </div>

            }
            {/* Thumbnail */}
            <div className="form-group">
                <label>Course Thumbnail <span style={{ color: "red" }}>*</span></label>
                <div
                    className="thumbnail-uploader"
                    onClick={() => document.getElementById('thumbnail-input').click()}
                >
                    {thumbnailPreview ? (
                        <img
                            src={thumbnailPreview}
                            alt="Thumbnail Preview"
                            width="250"
                            height="150"
                            className="thumbnail-preview"
                        />
                    ) : (
                        <div className="thumbnail-placeholder">
                            <p>Drag and drop an image, or <span className="browse-link">Browse</span></p>
                            <small>Aspect ratio 16:9 | Recommended size 1024x576</small>
                        </div>
                    )}
                </div>
                <input
                    type="file"
                    id="thumbnail-input"
                    name="thumbnailfile"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
            </div>

            {/* What to Learn */}
            <div className="form-group">
                <label>Benefits of the course <span style={{ color: "red" }}>*</span></label>
                <input
                    type="text"
                    name="whatToLearn"
                    className="form-input"
                    value={courseData.whatToLearn}
                    onChange={handleChange}
                    placeholder="e.g. Learn React in 7 days"
                />
            </div>

            {/* Next Button */}
            <div className="form-actions">
                <button onClick={handleNext} className="form-btn primary">
                    {isEditing ? "Continue Editing" : "Next"}
                </button>
            </div>
        </div>
    );
};

export default CourseInformationForm;
