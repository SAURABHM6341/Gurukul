import React, { useState, useEffect, useRef, useCallback } from 'react';
import VideoSidebar from './VideoSidebar';
import ReviewModal from './ReviewModal';
import ReactPlayer from 'react-player/lazy';
import './LecturePage.css';
import { apiConnector } from '../../service/apiconnector';
import { getFullCourseByid, submitReview } from '../../service/apis';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { 
    FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress,
    FaFastForward, FaFastBackward, FaCog, FaClosedCaptioning, FaStickyNote
} from 'react-icons/fa';

const LecturePage = () => {
    const [courseData, setCourseData] = useState(null);
    const [currentVideo, setCurrentVideo] = useState(null);
    const [completedVideos, setCompletedVideos] = useState(new Set());
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [allVideosCompleted, setAllVideosCompleted] = useState(false);
    const [rated, setRated] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Video player state
    const [playing, setPlaying] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [volume, setVolume] = useState(0.8);
    const [muted, setMuted] = useState(false);
    const [played, setPlayed] = useState(0);
    const [loaded, setLoaded] = useState(0);
    const [duration, setDuration] = useState(0);
    const [seeking, setSeeking] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [watchTime, setWatchTime] = useState(0);
    const [notes, setNotes] = useState([]);
    const [showNotes, setShowNotes] = useState(false);
    const [newNote, setNewNote] = useState('');
    
    const playerRef = useRef(null);
    const playerWrapperRef = useRef(null);
    const controlsTimeoutRef = useRef(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const token = useSelector((state) => state?.auth?.token);
    const user = useSelector((state) => state?.profile?.user);
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const url = `${getFullCourseByid.FULL_COURSE_ID_API}/${id}`;
                const res = await apiConnector("GET", url, `Bearer ${token}`);

                if (res.data.success) {
                    setCourseData(res.data.course);
                    const course = res.data.course;
                    if (course.courseContent?.[0]?.subSection?.[0]) {
                        setCurrentVideo(course.courseContent[0].subSection[0]);
                    }
                    loadUserProgress(res.data.course);
                } else {
                    toast.error("Failed to load course");
                    navigate('/dashboard');
                }
            } catch (err) {
                toast.error("Course details cannot be fetched");
                console.error(err);
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id, token, navigate]);

    // Load user progress from localStorage (in real app, this would come from backend)
    const loadUserProgress = (course) => {
        const progressKey = `course_progress_${id}_${user?.id}`;
        const savedProgress = localStorage.getItem(progressKey);
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            setCompletedVideos(new Set(progress.completedVideos || []));
            // Resume from last watched video if available
            if (progress.lastWatchedVideo) {
                const lastVideo = findVideoById(course, progress.lastWatchedVideo);
                if (lastVideo) {
                    setCurrentVideo(lastVideo);
                }
            }
        }
    };

    // Save progress to localStorage
    const saveUserProgress = useCallback(() => {
        if (!user?.id || !currentVideo) return;
        
        const progressKey = `course_progress_${id}_${user.id}`;
        const progress = {
            completedVideos: Array.from(completedVideos),
            lastWatchedVideo: currentVideo._id,
            watchTime: watchTime,
            lastWatchedAt: Date.now()
        };
        localStorage.setItem(progressKey, JSON.stringify(progress));
    }, [id, user?.id, currentVideo, completedVideos, watchTime]);

    // Auto-save progress
    useEffect(() => {
        const interval = setInterval(saveUserProgress, 10000); // Save every 10 seconds
        return () => clearInterval(interval);
    }, [saveUserProgress]);

    // Helper function to find video by ID
    const findVideoById = (course, videoId) => {
        for (const section of course.courseContent || []) {
            for (const subSection of section.subSection || []) {
                if (subSection._id === videoId) {
                    return subSection;
                }
            }
        }
        return null;
    };

    const totalVideos = courseData?.courseContent?.reduce((acc, courseContent) => {
        return acc + (courseContent?.subSection?.length || 0);
    }, 0) || 0;



    // Effect to check if all videos are completed
    useEffect(() => {
        setAllVideosCompleted(completedVideos.size === totalVideos);
    }, [completedVideos, totalVideos]);

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
            courseData.courseContent.forEach(section => {
                section.subSection.forEach(sub => allVideoIds.add(sub._id));
            });
            setCompletedVideos(allVideoIds);
            setIsReviewModalOpen(true);
        } else {
            setCompletedVideos(new Set());
        }
    };
    
    const handleSubmitReview = async(reviewData) => {
        try {
            toast.loading("Submitting review...");
            const payload = {
                courseId: id,
                rating: reviewData.rating,
                review: reviewData.reviewText
            };
            
            const res = await apiConnector("POST", submitReview.SUBMIT_REVIEW_API, `Bearer ${token}`, payload);
            
            if (res.data.success) {
                toast.dismiss();
                toast.success("Thank you for your review!");
                setRated(true);
            } else {
                toast.dismiss();
                toast.error("Review submission failed or already rated");
            }
        } catch (error) {
            console.error(error);
            toast.dismiss();
            toast.error("Review submission failed");
        }
        setIsReviewModalOpen(false);
    };

    // Enhanced video player handlers
    const handlePlayPause = () => {
        setPlaying(!playing);
    };

    const handleRewind = () => {
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            playerRef.current.seekTo(Math.max(currentTime - 10, 0));
        }
    };

    const handleFastForward = () => {
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            playerRef.current.seekTo(Math.min(currentTime + 10, duration));
        }
    };

    const handleProgress = (state) => {
        if (!seeking) {
            setPlayed(state.played);
            setLoaded(state.loaded);
            setWatchTime(state.playedSeconds);
            
            // Auto-mark as completed when 90% watched
            if (state.played > 0.9 && currentVideo && !completedVideos.has(currentVideo._id)) {
                handleToggleVideoComplete(currentVideo._id);
                toast.success("Video completed! 🎉");
            }
        }
    };

    const handleSeekMouseDown = () => {
        setSeeking(true);
    };

    const handleSeekChange = (e) => {
        setPlayed(parseFloat(e.target.value));
    };

    const handleSeekMouseUp = (e) => {
        setSeeking(false);
        if (playerRef.current) {
            playerRef.current.seekTo(parseFloat(e.target.value));
        }
    };

    const handleVolumeChange = (e) => {
        setVolume(parseFloat(e.target.value));
    };

    const handleToggleMute = () => {
        setMuted(!muted);
    };

    const handlePlaybackRateChange = (rate) => {
        setPlaybackRate(rate);
        setShowSettings(false);
    };

    const handleFullscreen = () => {
        if (!fullscreen) {
            if (playerWrapperRef.current?.requestFullscreen) {
                playerWrapperRef.current.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        setFullscreen(!fullscreen);
    };

    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
            if (playing) {
                setShowControls(false);
            }
        }, 3000);
    };

    const handleVideoSelect = (video) => {
        setCurrentVideo(video);
        setPlayed(0);
        setWatchTime(0);
        saveUserProgress();
    };

    const handleNextVideo = () => {
        if (!courseData?.courseContent) return;
        
        let nextVideo = null;
        let found = false;
        
        for (const section of courseData.courseContent) {
            for (const subSection of section.subSection) {
                if (found) {
                    nextVideo = subSection;
                    break;
                }
                if (subSection._id === currentVideo?._id) {
                    found = true;
                }
            }
            if (nextVideo) break;
        }
        
        if (nextVideo) {
            handleVideoSelect(nextVideo);
            toast.success(`Now playing: ${nextVideo.title}`);
        } else {
            toast.success("Course completed! 🎉");
            setIsReviewModalOpen(true);
        }
    };

    const handlePreviousVideo = () => {
        if (!courseData?.courseContent) return;
        
        let previousVideo = null;
        
        for (const section of courseData.courseContent) {
            for (const subSection of section.subSection) {
                if (subSection._id === currentVideo?._id) {
                    break;
                }
                previousVideo = subSection;
            }
        }
        
        if (previousVideo) {
            handleVideoSelect(previousVideo);
            toast.success(`Now playing: ${previousVideo.title}`);
        }
    };

    const handleAddNote = () => {
        if (!newNote.trim() || !currentVideo) return;
        
        const note = {
            id: Date.now(),
            videoId: currentVideo._id,
            timestamp: playerRef.current?.getCurrentTime() || 0,
            content: newNote,
            createdAt: new Date().toISOString()
        };
        
        setNotes(prev => [...prev, note]);
        setNewNote('');
        toast.success("Note added!");
    };

    const formatTime = (seconds) => {
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, '0');
        if (hh) {
            return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
        }
        return `${mm}:${ss}`;
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            switch (e.key) {
                case ' ':
                    e.preventDefault();
                    handlePlayPause();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    handleRewind();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    handleFastForward();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setVolume(prev => Math.min(prev + 0.1, 1));
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    setVolume(prev => Math.max(prev - 0.1, 0));
                    break;
                case 'f':
                    e.preventDefault();
                    handleFullscreen();
                    break;
                case 'm':
                    e.preventDefault();
                    handleToggleMute();
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [playing]);

    if (loading) {
        return (
            <div className="lecture-page loading-state">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading course content...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="lecture-page">
            <VideoSidebar
                course={courseData}
                currentVideoId={currentVideo?._id}
                completedVideos={completedVideos}
                onVideoSelect={handleVideoSelect}
                onToggleComplete={handleToggleVideoComplete}
                onCourseComplete={handleCourseComplete}
                showReviewButton={allVideosCompleted}
                onAddReviewClick={() => setIsReviewModalOpen(true)}
                rated={rated}
            />

            <main className="video-main-content">
                <div 
                    className={`video-player-wrapper ${fullscreen ? 'fullscreen' : ''}`}
                    ref={playerWrapperRef}
                    onMouseMove={handleMouseMove}
                >
                    <ReactPlayer
                        ref={playerRef}
                        url={currentVideo?.videoUrl}
                        playing={playing}
                        volume={volume}
                        muted={muted}
                        playbackRate={playbackRate}
                        onProgress={handleProgress}
                        onDuration={setDuration}
                        onEnded={handleNextVideo}
                        onReady={() => toast.success("Video ready!")}
                        onError={(error) => {
                            console.error("Video error:", error);
                            toast.error("Error loading video");
                        }}
                        width="100%"
                        height="100%"
                        controls={false}
                        config={{
                            file: {
                                attributes: {
                                    controlsList: 'nodownload',
                                    disablePictureInPicture: true,
                                    onContextMenu: (e) => e.preventDefault()
                                }
                            }
                        }}
                    />
                    
                    {/* Custom Video Controls */}
                    <div className={`video-controls ${showControls ? 'visible' : 'hidden'}`}>
                        {/* Progress Bar */}
                        <div className="progress-container">
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step="any"
                                value={played}
                                onMouseDown={handleSeekMouseDown}
                                onChange={handleSeekChange}
                                onMouseUp={handleSeekMouseUp}
                                className="progress-bar"
                            />
                            <div className="progress-buffer" style={{ width: `${loaded * 100}%` }} />
                            <div className="progress-played" style={{ width: `${played * 100}%` }} />
                        </div>
                        
                        {/* Control Buttons */}
                        <div className="controls-row">
                            <div className="controls-left">
                                <button onClick={handlePreviousVideo} className="control-btn" title="Previous video">
                                    <FaFastBackward />
                                </button>
                                <button onClick={handleRewind} className="control-btn" title="Rewind 10s">
                                    <FaFastBackward style={{ fontSize: '0.8em' }} />
                                </button>
                                <button onClick={handlePlayPause} className="control-btn play-pause" title={playing ? "Pause" : "Play"}>
                                    {playing ? <FaPause /> : <FaPlay />}
                                </button>
                                <button onClick={handleFastForward} className="control-btn" title="Forward 10s">
                                    <FaFastForward style={{ fontSize: '0.8em' }} />
                                </button>
                                <button onClick={handleNextVideo} className="control-btn" title="Next video">
                                    <FaFastForward />
                                </button>
                                
                                {/* Volume Control */}
                                <div className="volume-control">
                                    <button onClick={handleToggleMute} className="control-btn" title={muted ? "Unmute" : "Mute"}>
                                        {muted ? <FaVolumeMute /> : <FaVolumeUp />}
                                    </button>
                                    <input
                                        type="range"
                                        min={0}
                                        max={1}
                                        step="any"
                                        value={muted ? 0 : volume}
                                        onChange={handleVolumeChange}
                                        className="volume-slider"
                                    />
                                </div>
                                
                                {/* Time Display */}
                                <div className="time-display">
                                    {formatTime(watchTime)} / {formatTime(duration)}
                                </div>
                            </div>
                            
                            <div className="controls-right">
                                <button 
                                    onClick={() => setShowNotes(!showNotes)} 
                                    className="control-btn" 
                                    title="Notes"
                                >
                                    <FaStickyNote />
                                </button>
                                
                                {/* Settings Dropdown */}
                                <div className="settings-dropdown">
                                    <button 
                                        onClick={() => setShowSettings(!showSettings)} 
                                        className="control-btn" 
                                        title="Settings"
                                    >
                                        <FaCog />
                                    </button>
                                    {showSettings && (
                                        <div className="settings-menu">
                                            <div className="settings-section">
                                                <span>Playback Speed</span>
                                                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                                                    <button
                                                        key={rate}
                                                        onClick={() => handlePlaybackRateChange(rate)}
                                                        className={playbackRate === rate ? 'active' : ''}
                                                    >
                                                        {rate}x
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <button onClick={handleFullscreen} className="control-btn" title={fullscreen ? "Exit fullscreen" : "Fullscreen"}>
                                    {fullscreen ? <FaCompress /> : <FaExpand />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Video Details Section */}
                <div className="video-details">
                    <div className="video-header">
                        <h1 className="video-title">{currentVideo?.title}</h1>
                        <div className="video-meta">
                            <span className="instructor">By {courseData?.instructor?.firstName} {courseData?.instructor?.lastName}</span>
                            <span className="duration">Duration: {currentVideo?.timeDuration}</span>
                            <span className="progress">{Math.round(played * 100)}% completed</span>
                        </div>
                    </div>
                    
                    <div className="video-description">
                        <h3>About this lecture</h3>
                        <p>{currentVideo?.description}</p>
                    </div>
                    
                    {/* Notes Section */}
                    {showNotes && (
                        <div className="notes-section">
                            <h3>My Notes</h3>
                            <div className="add-note">
                                <input
                                    type="text"
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Add a note at current time..."
                                    className="note-input"
                                />
                                <button onClick={handleAddNote} className="add-note-btn">
                                    Add Note
                                </button>
                            </div>
                            <div className="notes-list">
                                {notes
                                    .filter(note => note.videoId === currentVideo?._id)
                                    .map(note => (
                                        <div key={note.id} className="note-item">
                                            <div className="note-time">{formatTime(note.timestamp)}</div>
                                            <div className="note-content">{note.content}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onSubmit={handleSubmitReview}
                courseId={id}
                user={user}
            />
        </div>
    );
};

export default LecturePage;