import React, { useState, useEffect } from 'react';
import VideoSidebar from './VideoSidebar';
import ReviewModal from './ReviewModal';
import ReactPlayer from 'react-player/lazy';
import './LecturePage.css';
import { apiConnector } from '../../service/apiconnector';
import { getFullCourseByid,submitReview } from '../../service/apis';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast'
// --- MOCK DATA (In a real app, this would come from an API) ---

const LecturePage = () => {
    const [courseData, setCourseData] = useState(null);
    const { id } = useParams();
    const token = useSelector((state) => state?.auth?.token);
    const user = useSelector((state) => state?.profile?.user);
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                toast.loading("Loading course...");
                const url = `${getFullCourseByid.FULL_COURSE_ID_API}/${id}`;
                console.log("api url is", url);

                const res = await apiConnector("GET", url, `Bearer ${token}`);

                if (res.data.success) {
                    toast.dismiss();
                    toast.success("Course fetched");
                    console.log(res.data);
                    setCourseData(res.data.course)
                    const course11 = res.data.course;
                    setCurrentVideo(course11.courseContent[0].subSection[0]);
                } else {
                    toast.dismiss();
                    toast.error("Fetching failed");
                }
            } catch (err) {
                toast.dismiss();
                toast.error("Course details cannot be fetched");
                console.log(err);
            }
        };

        fetchCourse();
    }, [id]);

    const [currentVideo, setCurrentVideo] = useState(null);
    const [completedVideos, setCompletedVideos] = useState(new Set());
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [allVideosCompleted, setAllVideosCompleted] = useState(false);

    const totalVideos = courseData?.courseContent?.reduce((acc, courseContent) => {
        return acc + (courseContent?.subSection?.length || 0);
    }, 0) || 0;



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
            courseData.courseContent.forEach(section => {
                section.subSection.forEach(sub => allVideoIds.add(sub._id));
            });
            setCompletedVideos(allVideoIds);
            setIsReviewModalOpen(true);
        } else {
            setCompletedVideos(new Set());
        }
    };
    const [rated,setRated] = useState(false);
    const handleSubmitReview = async(reviewData) => {
      try {
          toast.loading("Submitting review:", reviewData);
        const payload = {
            courseId:id,
            rating:reviewData.rating,
            review:reviewData.reviewText
        }
        // console.log("urls is ",submitReview.SUBMIT_REVIEW_API )
        const res = await apiConnector("POST",submitReview.SUBMIT_REVIEW_API,`Bearer ${token}`,payload);
        console.log("response", res.data);
        if(res.data.success){
            toast.dismiss();
            toast.success("Thank you for your review!");
            setRated(true);
        }
        else{
            toast.dismiss();
            toast.error("review submission failed or already rated");
        }
      } catch (error) {
        console.log(error);
        toast.dismiss();
            toast.error("review submission failed");
      }
        setIsReviewModalOpen(false);
    };

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
                <div className="video-player-wrapper">
                    <video
                        src={currentVideo?.videoUrl}
                        controls
                        controlsList="nodownload"
                        disablePictureInPicture
                        onContextMenu={(e) => e.preventDefault()}
                        width="100%"
                        height="100%"
                    />
                </div>
                <div className="video-details">
                    <h1 className="video-title">{currentVideo?.title}</h1>
                    <p className="video-description">{currentVideo?.description}</p>
                    <p>By - {courseData?.instructor?.Fname}</p>
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