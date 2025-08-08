import React, { useState, useEffect } from 'react';
import VideoSidebar from './VideoSidebar';
import ReviewModal from './ReviewModal';
import ReactPlayer from 'react-player/lazy';
import './LecturePage.css';

// --- MOCK DATA (In a real app, this would come from an API) ---
const courseData = {
    id: "course01",
    title: "Learn Python 2025",
    sections: [
        {
            id: "sec01",
            title: "Python Tutorial",
            duration: "59min",
            subsections: [
                { id: "sub01", title: "Open a File on the Server", url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", description: "Learn the basics of file handling and opening files on a server using Python's built-in functions." },
                { id: "sub02", title: "File Write", url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", description: "This lesson covers how to write and append data to files, an essential skill for data logging and storage." },
                { id: "sub03", title: "Delete File", url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", description: "Understand the risks and methods for safely deleting files from your filesystem using Python." },
                { id: "sub04", title: "Data Types", url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4", description: "A deep dive into Python's fundamental data types, including integers, floats, strings, and booleans." },
            ]
        },
        {
            id: "sec02",
            title: "Modules",
            duration: "21min",
            subsections: [
                { id: "sub05", title: "NumPy Tutorial", url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", description: "Explore the powerful NumPy library for numerical computing and array manipulation." },
                { id: "sub06", title: "Pandas Tutorial", url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", description: "Learn how to use Pandas for data analysis and manipulation, a cornerstone of data science in Python." },
            ]
        }
    ]
};

const LecturePage = () => {
    const [currentVideo, setCurrentVideo] = useState(courseData.sections[0].subsections[0]);
    const [completedVideos, setCompletedVideos] = useState(new Set());
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [allVideosCompleted, setAllVideosCompleted] = useState(false);

    const totalVideos = courseData.sections.reduce((acc, section) => acc + section.subsections.length, 0);

    // Effect to check if all videos are completed
    useEffect(() => {
        setAllVideosCompleted(completedVideos.size === totalVideos);
    }, [completedVideos, totalVideos]);


    const handleVideoSelect = (video) => {
        setCurrentVideo(video);
    };

    const handleToggleVideoComplete = (videoId) => {
        const newCompletedVideos = new Set(completedVideos);
        if (newCompletedVideos.has(videoId)) {
            newCompletedVideos.delete(videoId);
        } else {
            newCompletedVideos.add(videoId);
        }
        setCompletedVideos(newCompletedVideos);
    };

    const handleCourseComplete = (isComplete) => {
        if (isComplete) {
            const allVideoIds = new Set();
            courseData.sections.forEach(section => {
                section.subsections.forEach(sub => allVideoIds.add(sub.id));
            });
            setCompletedVideos(allVideoIds);
            setIsReviewModalOpen(true);
        } else {
            setCompletedVideos(new Set());
        }
    };
    
    const handleSubmitReview = (reviewData) => {
        // In a real app, you would send this to your backend API
        console.log("Submitting review:", reviewData);
        alert("Thank you for your review!");
        setIsReviewModalOpen(false);
    };

    return (
        <div className="lecture-page">
            <VideoSidebar
                course={courseData}
                currentVideoId={currentVideo.id}
                completedVideos={completedVideos}
                onVideoSelect={handleVideoSelect}
                onToggleComplete={handleToggleVideoComplete}
                onCourseComplete={handleCourseComplete}
                showReviewButton={allVideosCompleted}
                onAddReviewClick={() => setIsReviewModalOpen(true)}
            />

            <main className="video-main-content">
                <div className="video-player-wrapper">
                    <ReactPlayer
                        url={currentVideo.url}
                        playing={true}
                        controls={true}
                        width="100%"
                        height="100%"
                    />
                </div>
                <div className="video-details">
                    <h1 className="video-title">{currentVideo.title}</h1>
                    <p className="video-description">{currentVideo.description}</p>
                </div>
            </main>

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onSubmit={handleSubmitReview}
            />
        </div>
    );
};

export default LecturePage;