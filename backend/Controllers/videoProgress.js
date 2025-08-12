const User = require('../Models/User');
const CourseProgress = require('../Models/courseProgress');
const SubSection = require('../Models/SubSection');

// Update video watch progress
exports.updateVideoProgress = async (req, res) => {
    try {
        const { courseId, videoId, watchTime, isCompleted } = req.body;
        const userId = req.user.id;

        // Validation
        if (!courseId || !videoId || watchTime === undefined) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Find or create course progress
        let courseProgress = await CourseProgress.findOne({
            CourseId: courseId,
            userId: userId
        });

        if (!courseProgress) {
            courseProgress = await CourseProgress.create({
                CourseId: courseId,
                userId: userId,
                CompletedVideos: [],
                videoProgress: {}
            });
        }

        // Update video progress
        if (!courseProgress.videoProgress) {
            courseProgress.videoProgress = {};
        }

        courseProgress.videoProgress[videoId] = {
            watchTime: watchTime,
            lastWatched: new Date(),
            isCompleted: isCompleted || false
        };

        // Add to completed videos if marked as completed
        if (isCompleted && !courseProgress.CompletedVideos.includes(videoId)) {
            courseProgress.CompletedVideos.push(videoId);
        }

        await courseProgress.save();

        return res.status(200).json({
            success: true,
            message: "Progress updated successfully",
            data: courseProgress
        });

    } catch (error) {
        console.error("Error updating video progress:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get user's progress for a course
exports.getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        const courseProgress = await CourseProgress.findOne({
            CourseId: courseId,
            userId: userId
        }).populate('CompletedVideos');

        if (!courseProgress) {
            return res.status(200).json({
                success: true,
                message: "No progress found",
                data: {
                    CourseId: courseId,
                    CompletedVideos: [],
                    videoProgress: {},
                    completionPercentage: 0
                }
            });
        }

        // Calculate completion percentage
        const totalVideos = await SubSection.countDocuments({
            // You might need to adjust this query based on your schema
        });

        const completionPercentage = totalVideos > 0 
            ? (courseProgress.CompletedVideos.length / totalVideos) * 100 
            : 0;

        return res.status(200).json({
            success: true,
            message: "Progress retrieved successfully",
            data: {
                ...courseProgress.toObject(),
                completionPercentage: Math.round(completionPercentage)
            }
        });

    } catch (error) {
        console.error("Error getting course progress:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Mark video as completed
exports.markVideoCompleted = async (req, res) => {
    try {
        const { courseId, videoId } = req.body;
        const userId = req.user.id;

        if (!courseId || !videoId) {
            return res.status(400).json({
                success: false,
                message: "Course ID and Video ID are required"
            });
        }

        // Find or create course progress
        let courseProgress = await CourseProgress.findOne({
            CourseId: courseId,
            userId: userId
        });

        if (!courseProgress) {
            courseProgress = await CourseProgress.create({
                CourseId: courseId,
                userId: userId,
                CompletedVideos: [videoId],
                videoProgress: {
                    [videoId]: {
                        isCompleted: true,
                        completedAt: new Date()
                    }
                }
            });
        } else {
            // Add to completed videos if not already completed
            if (!courseProgress.CompletedVideos.includes(videoId)) {
                courseProgress.CompletedVideos.push(videoId);
            }

            // Update video progress
            if (!courseProgress.videoProgress) {
                courseProgress.videoProgress = {};
            }

            courseProgress.videoProgress[videoId] = {
                ...courseProgress.videoProgress[videoId],
                isCompleted: true,
                completedAt: new Date()
            };

            await courseProgress.save();
        }

        return res.status(200).json({
            success: true,
            message: "Video marked as completed",
            data: courseProgress
        });

    } catch (error) {
        console.error("Error marking video as completed:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Get video analytics for instructors
exports.getVideoAnalytics = async (req, res) => {
    try {
        const { courseId } = req.params;
        const instructorId = req.user.id;

        // Verify instructor owns the course
        const Course = require('../Models/course');
        const course = await Course.findById(courseId);
        
        if (!course || course.instructor.toString() !== instructorId) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        // Get all progress records for this course
        const progressRecords = await CourseProgress.find({
            CourseId: courseId
        }).populate('userId', 'firstName lastName email');

        // Calculate analytics
        const analytics = {
            totalStudents: progressRecords.length,
            completionRates: {},
            avgWatchTime: {},
            dropOffPoints: {}
        };

        // Process each progress record
        progressRecords.forEach(progress => {
            if (progress.videoProgress) {
                Object.entries(progress.videoProgress).forEach(([videoId, data]) => {
                    if (!analytics.completionRates[videoId]) {
                        analytics.completionRates[videoId] = { completed: 0, total: 0 };
                    }
                    if (!analytics.avgWatchTime[videoId]) {
                        analytics.avgWatchTime[videoId] = { total: 0, count: 0 };
                    }

                    analytics.completionRates[videoId].total++;
                    if (data.isCompleted) {
                        analytics.completionRates[videoId].completed++;
                    }

                    if (data.watchTime) {
                        analytics.avgWatchTime[videoId].total += data.watchTime;
                        analytics.avgWatchTime[videoId].count++;
                    }
                });
            }
        });

        // Calculate percentages and averages
        Object.keys(analytics.completionRates).forEach(videoId => {
            const rate = analytics.completionRates[videoId];
            rate.percentage = rate.total > 0 ? (rate.completed / rate.total) * 100 : 0;
        });

        Object.keys(analytics.avgWatchTime).forEach(videoId => {
            const watch = analytics.avgWatchTime[videoId];
            watch.average = watch.count > 0 ? watch.total / watch.count : 0;
        });

        return res.status(200).json({
            success: true,
            message: "Analytics retrieved successfully",
            data: analytics
        });

    } catch (error) {
        console.error("Error getting video analytics:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
