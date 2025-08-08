import React, { useState } from 'react';
import { IoIosArrowDown } from "react-icons/io";
import { FaRegSquare, FaCheckSquare } from "react-icons/fa";

// This is a sub-component for the accordion sections
const CourseSection = ({ section, completedVideos, currentVideoId, onVideoSelect, onToggleComplete }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="course-section">
            <div className="section-header" onClick={() => setIsOpen(!isOpen)}>
                <span>{section.title}</span>
                <div className="section-meta">
                    <span>{section.duration}</span>
                    <IoIosArrowDown className={`chevron-icon ${isOpen ? 'open' : ''}`} />
                </div>
            </div>
            {isOpen && (
                <ul className="subsections-list">
                    {section.subsections.map((sub) => {
                        const isCompleted = completedVideos.has(sub.id);
                        const isActive = currentVideoId === sub.id;

                        return (
                            <li key={sub.id} className={`subsection-item ${isActive ? 'active' : ''}`}>
                                <div className="subsection-title-wrapper" onClick={() => onVideoSelect(sub)}>
                                    {isCompleted ?
                                        <FaCheckSquare className="checkbox-icon completed" onClick={(e) => { e.stopPropagation(); onToggleComplete(sub.id); }} /> :
                                        <FaRegSquare className="checkbox-icon" onClick={(e) => { e.stopPropagation(); onToggleComplete(sub.id); }} />
                                    }
                                    <span className={`subsection-title ${isCompleted ? 'strikethrough' : ''}`}>
                                        {sub.title}
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

// --- Main Sidebar Component ---
const VideoSidebar = ({ course, completedVideos, currentVideoId, onVideoSelect, onToggleComplete, onCourseComplete, showReviewButton, onAddReviewClick }) => {
    const isCourseCompleted = completedVideos.size === course.sections.reduce((acc, s) => acc + s.subsections.length, 0);

    return (
        <aside className="video-sidebar">
            <div className="sidebar-header">
                <div className='course-title-wrapper' onClick={() => onCourseComplete(!isCourseCompleted)}>
                    {isCourseCompleted ? 
                        <FaCheckSquare className="checkbox-icon completed" /> : 
                        <FaRegSquare className="checkbox-icon" />
                    }
                    <h2 className='course-title'>{course.title}</h2>
                </div>
                {showReviewButton && (
                    <button className="add-review-btn" onClick={onAddReviewClick}>
                        Add Review
                    </button>
                )}
            </div>
            <div className="sections-container">
                {course.sections.map((section) => (
                    <CourseSection
                        key={section.id}
                        section={section}
                        completedVideos={completedVideos}
                        currentVideoId={currentVideoId}
                        onVideoSelect={onVideoSelect}
                        onToggleComplete={onToggleComplete}
                    />
                ))}
            </div>
        </aside>
    );
};

export default VideoSidebar;