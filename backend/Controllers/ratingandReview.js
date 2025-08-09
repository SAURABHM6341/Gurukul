const mongoose = require("mongoose");
const ratingModel = require('../Models/rating&review');
const courseModel = require('../Models/course');
const userModel = require('../Models/User');
//rating creation
exports.createRating = async (req, res) => {
    try {
        const { courseId, rating, review } = req.body;
        const userId = req.user.id;
        if (!courseId || !rating || !review) {
            return res.status(400).json({ message: "All fields are required" });
        }
        //check if user and course exist
        const user = await userModel.findById(userId);
        const course = await courseModel.findById(courseId);
        if (!user || !course) {
            return res.status(404).json({ message: "User or Course not found" });
        }
        // check if user is enrolled in this course or not 
        if (!course.studentEnrolled.includes(user._id)) {
            return res.status(403).json({ message: "You are not enrolled in this course" });
        }
        // check if user has already rated this course
        const existingRating = await ratingModel.findOne({ User: user._id, course: course._id });
        if (existingRating) {
            return res.status(400).json({ message: "You have already rated this course" });
        }
        // create new rating
        const newRating = await ratingModel.create({
            User: user._id,
            course: course._id,
            rating,
            review
        });
        //update the course with the new rating
        const newCourse = await courseModel.findByIdAndUpdate(courseId, {
            $push: { ratingandReview: newRating._id }
        },{new: true});
        return res.status(200).json({
            message: "Rating created successfully",
            rating: newRating,
            success:true
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            success:false
        })
    }
}

// get avg rating of a course

exports.getAvgRating = async (req, res) => {
    try {
        const { courseId } = req.body;

        // Validate input
        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        // Check if course exists
        const courseExists = await courseModel.findById(courseId);
        if (!courseExists) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Aggregation to calculate average rating
        const result = await ratingModel.aggregate([
            {
                $match: {
                    course: courseExists._id,
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 },
                },
            },
        ]);

        // If no ratings exist yet
        if (!result.length) {
            return res.status(200).json({
                message: "No ratings found for this course",
                averageRating: "0.00",
                totalReviews: 0,
            });
        }

        // Send response
        const { averageRating, totalReviews } = result[0];
        return res.status(200).json({
            message: "Average rating fetched successfully",
            averageRating: averageRating.toFixed(2),
            totalReviews,
        });

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
};

// get all ratings of a course
exports.getAllRatings = async (req, res) => {
    try {
        const { courseId } = req.body;
        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }
        // find the course
        const course = await courseModel.findById(courseId).populate('ratingandReview');
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        // return all ratings
        return res.status(200).json({
            message: "Ratings fetched successfully",
            ratings: course.ratingandReview
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }

}

// get all ratings of all user and course
exports.getAllRatingsAndReviews = async (req, res) => {
    try {
        const allRatings = await ratingModel.find({}).sort({ rating: "desc" })
            .populate(
                {
                    path: "User",
                    select: "Fname Lname email image"
                })
            .populate(
                {
                    path: "course",
                    select: "courseName"
                })
            .exec();
            if(!allRatings || allRatings.length === 0) {
                return res.status(404).json({
                    message: "No ratings and reviews found",
                    success: false
                });
            }
            return res.status(200).json({
                message: "All ratings and reviews fetched successfully",
                ratings: allRatings
            });
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });

    }
}
// delete rating
exports.deleteRating = async (req,res)=>{
    try{
        const {ratingId,courseId} = req.body;
        if(!ratingId|| !courseId){
            return res.status(400).json({
                message: "Rating ID is required",
                success: false
            });
        }
        const course = await courseModel.findById(courseId);
        if(!course){
            return res.status(404).json({
                message: "Course not found",
                success: false
            });
        }
        // pull the rating from course ratingandReviews
        const ratingExists = course.ratingandReview.includes(ratingId);
        if(!ratingExists){
            return res.status(404).json({
                message: "Rating not found in this course",
                success: false
            });
        }
        // remove the rating from course and delete the rating
        const ratingIdObj = new mongoose.Types.ObjectId(ratingId);
        await courseModel.findByIdAndUpdate(courseId, {
            $pull: { ratingandReview: ratingIdObj }
        });
        const rating = await ratingModel.findByIdAndDelete(ratingId);
        if(!rating){
            return res.status(404).json({
                message: "Rating not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Rating deleted successfully",
            success: true
        });

    }catch(err){
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
}