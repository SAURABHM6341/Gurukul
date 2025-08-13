import React, { useState, useEffect } from 'react';
import LectureModal from './LectureModal'; // Your existing modal component
import { FaPlus, FaPencilAlt, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './courseBuilder.css';
import { apiConnector } from '../../../service/apiconnector';
import toast from 'react-hot-toast';
import { createsubsection, editsubsection, createsection, editsection } from '../../../service/apis'
import { useSelector } from 'react-redux';

const CourseBuilderForm = ({ courseData = null, setCourseData, onNext, isEditing }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [currentSectionId, setCurrentSectionId] = useState(null);
    const [expandedSections, setExpandedSections] = useState(new Set());
    const [isLoading, setIsLoading] = useState(false); // New loading state
    const [videoCache, setVideoCache] = useState({});
    console.log("Course Data:", courseData);
    const token = useSelector((state) => state?.auth?.token);
    //apis
    const createOrUpdateSectionAPI = async (sectionData) => {
        const isNew = String(sectionData._id).startsWith('section');
        const url = isNew
            ? createsection.CREATE_SECTION_API
            : editsection.EDIT_SECTION_API + `/${sectionData._id}`;

        const method = isNew ? 'POST' : 'PUT';
        console.log("Saving section:", sectionData.sectionName);
        const payload = { sectionName: sectionData.sectionName, courseId: courseData._id };
        console.log(courseData);
        try {
            const response = await apiConnector(method, url, {
                Authorization: `Bearer ${token}`
            }, payload);
            if (response.data.success) {
                toast.dismiss();
                toast.success("Lesson Created Successfully, uploading Videos if any");
                console.log(response.data.section);
                return response?.data?.section;
            }
            else {
                toast.dismiss();
                toast.error("section cannot be created");
            }
        } catch (err) {
            console.log(err);
        }

    };

    const createOrUpdateLectureAPI = async (lectureData, sectionId) => {
        let result;
        try {
            // Step 1: Determine if it's a new lecture or an edit
            const isNew = !lectureData._id || String(lectureData._id).startsWith('sub');

            let url;
            let method;

            // Step 2: Set the URL and Method based on Create vs Edit
            if (isNew) {
                // This is a CREATE operation
                url = `${createsubsection.CREATE_SUBSECTION_API}/${sectionId}`;
                method = 'POST';
            } else {
                // This is an EDIT operation
                url = `${editsubsection.EDIT_SUBSECTION_API}/${lectureData._id}`;
                method = 'PUT';
            }

            // Step 3: Determine the payload type (FormData for files, JSON for text)
            let payload;

            console.log("video = ", lectureData.video);
            if (lectureData.video) {
                // If a new video file is present, ALWAYS use FormData
                payload = new FormData();
                payload.append('video', lectureData.video);
                payload.append('title', lectureData.title);
                payload.append('description', lectureData.description);
                payload.append('timeDuration', lectureData.timeDuration);
                // The sectionId is only needed for creation, but sending it for edits is harmless
                payload.append('sectionId', sectionId);
                // Don't set Content-Type header manually, browser does it for FormData
            } else {
                payload = new FormData();
                payload.append('title', lectureData.title);
                payload.append('description', lectureData.description);
                payload.append('timeDuration', lectureData.timeDuration);
                // The sectionId is only needed for creation, but sending it for edits is harmless
                payload.append('sectionId', sectionId);
            }

            // Step 4: Make the API call
            const response = await apiConnector(method, url, {
                Authorization: `Bearer ${token}`
            }, payload);

            if (response?.data?.success) {
                toast.success("Lecture saved.");
                result = response.data.subSectionCreated;
            } else {
                toast.error(response?.data?.message || "Failed to save lecture.");
            }

        } catch (error) {
            console.error("LECTURE SAVE ERROR............", error);
            toast.error("Could not save lecture.");
        }
        return result;
    };




    const handleAddSection = () => {
        const newSection = {
            _id: `section${Date.now()}`,
            sectionName: `New Section ${courseData?.courseContent?.length + 1}`,
            subSection: []
        };
        setCourseData({ ...courseData, courseContent: [...courseData.courseContent, newSection] });
    };

    const handleDeleteSection = async (sectionId) => {
        // Check if this is a temporary section (not saved to server yet)
        const isTemporary = String(sectionId).startsWith('section');
        
        if (isTemporary) {
            // This is a local/temporary section, just remove from state
            const updatedContent = courseData.courseContent.filter(s => s._id !== sectionId);
            setCourseData({ ...courseData, courseContent: updatedContent });
            toast.success("Section removed");
            return;
        }

        // This is a saved section, make API call to delete from server
        try {
            toast.loading("Deleting section...");
            const payload = { sectionId };
            const response = await apiConnector("DELETE", editsection.DELETE_SECTION_API + `/${courseData._id}`,{
                Authorization: `Bearer ${token}`
            }, payload);
            if (response?.data?.success) {
                toast.dismiss();
                toast.success("Section deleted successfully");
                const updatedContent = courseData.courseContent.filter(s => s._id !== sectionId);
                setCourseData({ ...courseData, courseContent: updatedContent });
            } else {
                toast.dismiss();
                toast.error(response?.data?.message || "Failed to delete section.");
            }
        } catch (err) {
            toast.dismiss();
            toast.error("Failed to delete section.");
            console.error(err);
        }

    };

    const handleDeleteLecture = async (sectionId, lectureId) => {
        // Check if this is a temporary lecture (not saved to server yet)
        const isTemporary = !lectureId || String(lectureId).startsWith('sub');
        
        if (isTemporary) {
            // This is a local/temporary lecture, just remove from state
            const updatedContent = courseData.courseContent.map(section => {
                if (section._id === sectionId) {
                    const updatedSubSection = section.subSection.filter(lec => lec._id !== lectureId);
                    return { ...section, subSection: updatedSubSection };
                }
                return section;
            });
            setCourseData({ ...courseData, courseContent: updatedContent });
            toast.success("Lecture removed");
            
            // Also remove from video cache if it exists
            if (videoCache[lectureId]) {
                const newVideoCache = { ...videoCache };
                delete newVideoCache[lectureId];
                setVideoCache(newVideoCache);
            }
            return;
        }

        // This is a saved lecture, make API call to delete from server
        try {
            toast.loading("Deleting lecture...");
            const response = await apiConnector("DELETE", editsubsection.DELETE_SUBSECTION_API + `/${lectureId}`, {
                Authorization: `Bearer ${token}`
            }, { sectionId });
            if (response?.data?.success) {
                toast.dismiss();
                toast.success("Lecture deleted successfully");
                const updatedContent = courseData.courseContent.map(section => {
                    if (section._id === sectionId) {
                        const updatedSubSection = section.subSection.filter(lec => lec._id !== lectureId);
                        return { ...section, subSection: updatedSubSection };
                    }
                    return section;
                });
                setCourseData({ ...courseData, courseContent: updatedContent });
                console.log("res", response);
            } else {
                toast.dismiss();
                toast.error(response?.data?.message || "Failed to delete lecture.");
            }
        } catch (err) {
            toast.dismiss();
            toast.error("Failed to delete lecture.");
            console.error(err);
        }

    };

    const handleToggleSection = (sectionId) => {
        const newExpandedSections = new Set(expandedSections);
        if (newExpandedSections.has(sectionId)) {
            newExpandedSections.delete(sectionId);
        } else {
            newExpandedSections.add(sectionId);
        }
        setExpandedSections(newExpandedSections);
    };

    const handleAddLecture = (sectionId) => {
        setCurrentSectionId(sectionId);
        setCurrentLecture(null);
        setIsModalOpen(true);
    };

    const handleEditLecture = (sectionId, lecture) => {
        setCurrentSectionId(sectionId);
        setCurrentLecture(lecture);
        setIsModalOpen(true);
    };

    const handleSaveLecture = (lectureData) => {
        const lectureId = currentLecture?._id || `sub${Date.now()}`;

        // Cache the raw video file
        if (lectureData.video instanceof File) {
            setVideoCache(prev => ({ ...prev, [lectureId]: lectureData.video }));
        }

        const updatedContent = courseData.courseContent.map(section => {
            if (section._id === currentSectionId) {
                let updatedSubSection;
                if (currentLecture) {
                    // Edit existing lecture
                    updatedSubSection = section.subSection.map(sub =>
                        sub._id === currentLecture._id
                            ? { ...sub, ...lectureData, _id: currentLecture._id }
                            : sub
                    );
                } else {
                    // Add new lecture
                    const newLecture = { ...lectureData, _id: lectureId };
                    updatedSubSection = [...section.subSection, newLecture];
                }
                return { ...section, subSection: updatedSubSection };
            }
            return section;
        });

        setCourseData({ ...courseData, courseContent: updatedContent });
        setIsModalOpen(false);
    };

    /**
     * Handles the entire process of saving sections and lectures to the server
     * before proceeding to the next step.
     */
    const handleNext = async () => {
        const updatedContent = [...courseData.courseContent];
        setIsLoading(true);
        try {
            for (let i = 0; i < updatedContent.length; i++) {
                const section = updatedContent[i];
                const savedSection = await createOrUpdateSectionAPI(section);
                // Update the section in our copy with the response (which may have a new ID)
                updatedContent[i] = { ...savedSection, subSection: [] }; // Reset lectures, we will repopulate

                const newSectionId = savedSection._id; // Use the permanent ID for lecture calls

                // 2. For the processed section, call the Lecture API for each of its lectures
                for (let j = 0; j < section.subSection.length; j++) {
                    const lecture = section.subSection[j];
                    const rawVideo = videoCache[lecture._id];
                    const lectureWithVideo = { ...lecture, video: rawVideo || lecture.video };

                    const savedLecture = await createOrUpdateLectureAPI(lectureWithVideo, newSectionId);
                    // Add the saved lecture to our updated section copy
                    updatedContent[i].subSection.push(savedLecture);
                }
            }

            // 3. After all loops are done, update the state and proceed
            console.log("All content saved. Final structure:", updatedContent);
            console.log("Course Data before setting:", courseData);
            setCourseData({ ...courseData, courseContent: updatedContent });
            console.log("Course Data after setting:", courseData);
            onNext(); // Call the original onNext prop to move to the next form step

        } catch (error) {
            console.error("Failed to save course content:", error);
            // Optionally, show an error message to the user
            alert("There was an error saving the course. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        if (isEditing && courseData?.courseContent?.length) {
            const defaultExpanded = new Set(courseData.courseContent.map(section => section._id));
            setExpandedSections(defaultExpanded);
        }
    }, [isEditing, courseData]);

    return (
        <div className="course-builder-container">
            <h2 className="course-builder-heading">Course Builder</h2>
            <div className="sections-list">
                {courseData?.courseContent?.map(section => (
                    <div key={section._id} className="section-wrapper">
                        <div className="section-header">
                            <div className="section-title">
                                <span className="drag-handle">::</span>
                                <input
                                    type="text"
                                    className="section-name-input"
                                    value={section?.sectionName}
                                    onChange={(e) => {
                                        const updatedContent = courseData.courseContent.map(s => s._id === section._id ? { ...s, sectionName: e.target.value } : s);
                                        setCourseData({ ...courseData, courseContent: updatedContent });
                                    }}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="section-actions">
                                <button className="icon-btn" disabled={isLoading}><FaPencilAlt /></button>
                                <button className="icon-btn" onClick={() => handleDeleteSection(section._id)} disabled={isLoading}><FaTrash /></button>
                                <span className="section-divider">|</span>
                                <button className="icon-btn" onClick={() => handleToggleSection(section._id)} disabled={isLoading}>
                                    {expandedSections.has(section._id) ? <FaChevronUp /> : <FaChevronDown />}
                                </button>
                            </div>
                        </div>

                        {expandedSections.has(section._id) && (
                            <div className="lectures-container">
                                {section.subSection?.map(lecture => (
                                    <div key={lecture._id} className="lecture-item">
                                        <div className="lecture-title">
                                            <span className="drag-handle">::</span>
                                            {lecture.title}
                                        </div>
                                        <div className="lecture-actions">
                                            <button className="icon-btn" onClick={() => handleEditLecture(section._id, lecture)} disabled={isLoading}><FaPencilAlt /></button>
                                            <button className="icon-btn" onClick={() => handleDeleteLecture(section._id, lecture._id)} disabled={isLoading}><FaTrash /></button>
                                        </div>
                                    </div>
                                ))}
                                <button className="add-lecture-btn" onClick={() => handleAddLecture(section._id)} disabled={isLoading}>
                                    <FaPlus /> Add Lecture
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button onClick={handleAddSection} className="form-btn primary create-section-btn" disabled={isLoading}>
                <FaPlus /> Create Section
            </button>

            {isLoading && <p className="loading-message">Saving course content, please wait...</p>}

            <div className="form-actions">
                <button onClick={handleNext} className="form-btn primary" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Next'}
                </button>
            </div>

            {isModalOpen && (
                <LectureModal
                    lectureData={currentLecture}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveLecture}
                />
            )}
        </div>
    );
};

export default React.memo(CourseBuilderForm);