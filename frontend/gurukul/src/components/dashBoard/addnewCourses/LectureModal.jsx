import React, { useState, useEffect } from 'react';
import './lectureModal.css';

const LectureModal = ({ lectureData, onClose, onSave }) => {
    // This state now includes the _id to track if we are editing
    const [formData, setFormData] = useState({
        _id: null,
        title: '',
        description: '',
        timeDuration: '',
        video: null // Holds a NEW video file if selected
    });

    // This state holds the URL for the video preview
    const [videoPreview, setVideoPreview] = useState(null);

    // This effect runs when the modal opens or the lecture data changes
    useEffect(() => {
        if (lectureData) {
            // EDITING MODE: Populate form with existing lecture data
            setFormData({
                _id: lectureData._id || null,
                title: lectureData.title || '',
                description: lectureData.description || '',
                timeDuration: lectureData.timeDuration || '',
                video: null // Reset new video file input
            });
            
            // If there's an existing video URL, set it for the preview
            if (lectureData.videoUrl) {
                setVideoPreview(lectureData.videoUrl);
            }
        } else {
            // ADDING MODE: Ensure the form is completely empty
            setFormData({
                _id: null,
                title: '',
                description: '',
                timeDuration: '',
                video: null
            });
            setVideoPreview(null);
        }
    }, [lectureData]);

    // This effect creates a preview URL for a NEWLY selected video file
    useEffect(() => {
        if (formData.video) {
            const url = URL.createObjectURL(formData.video);
            setVideoPreview(url);

            // Cleanup function to prevent memory leaks
            return () => URL.revokeObjectURL(url);
        }
    }, [formData.video]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, video: file });
        }
    };

    const handleSave = () => {
        // Now, formData includes the _id when editing
        onSave(formData);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>{lectureData ? 'Editing Lecture' : 'Adding Lecture'}</h2>
                
                {/* --- IMPROVED VIDEO UPLOAD SECTION --- */}
                <div className="form-group">
                    <label>Lecture Video <span style={{ color: "red" }}>*</span></label>
                    <div className="video-upload-area">
                        {videoPreview ? (
                            // If there is a preview, show the video player
                            <video
                                key={videoPreview} // Key ensures player updates when src changes
                                controls
                                width="100%"
                                src={videoPreview}
                                style={{ borderRadius: "8px", border: "1px solid #ccc" }}
                            />
                        ) : (
                            // Otherwise, show a placeholder that can be clicked
                            <div 
                                className="video-placeholder" 
                                onClick={() => document.getElementById('videoInput').click()}
                            >
                                Drag & Drop or Click to Choose File
                            </div>
                        )}
                    </div>
                    {/* Hidden file input, triggered by the UI elements */}
                    <input 
                        type="file" 
                        id='videoInput' 
                        style={{ display: 'none' }} 
                        accept="video/*"
                        onChange={handleFileChange} 
                    />
                    {/* A clear button to trigger the file selection */}
                    <button 
                        className="form-btn" 
                        onClick={() => document.getElementById('videoInput').click()} 
                        style={{marginTop: "10px"}}
                    >
                        {videoPreview ? "Change Video" : "Upload Video"}
                    </button>
                </div>
                {/* --- END OF VIDEO UPLOAD SECTION --- */}

                <div className="form-group">
                    <label htmlFor="title">Lecture Title <span style={{ color: "red" }}>*</span></label>
                    <input type="text" id="title" name="title" required className="form-input" value={formData.title} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="timeDuration">Video Playback Time <span style={{ color: "red" }}>*</span></label>
                    <input required type="text" id="timeDuration" name="timeDuration" placeholder="e.g., 10:35" className="form-input" value={formData.timeDuration} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Lecture Description <span style={{ color: "red" }}>*</span></label>
                    <textarea required id="description" name="description" className="form-textarea" value={formData.description} onChange={handleChange}></textarea>
                </div>

                <div className="modal-actions">
                    <button onClick={onClose} className="form-btn">Cancel</button>
                    <button onClick={handleSave} className="form-btn primary">
                        {lectureData ? 'Save Changes' : 'Save Lecture'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LectureModal;