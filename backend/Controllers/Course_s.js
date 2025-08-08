const courseSchema = require('../Models/course');
const userModel = require('../Models/User');
const tagModel = require('../Models/tags');
const mongoose = require('mongoose');
const { ImageUploader } = require('../Util/imageUploader');
// create course
exports.createCourse = async (req, res) => {
    try {
        // data fetching
        const { courseName, courseDescription, whatToLearn, price, tag } = req.body;
        // data validation
        if (!courseName || !courseDescription || !whatToLearn || !price || !tag) {
            return res.status(400).json({
                message: "Please fill all the fields",
                success: false
            });
        }
        //image fetching and validation
        const image = req.files.thumbnail;

        if (!image) {
            return res.status(400).json({
                message: "thumbnail is required",
                success: false
            });
        }
        console.log("running")
        //tags validation for testing purpose only as tag is drop down so only valid tag will show
        const tagResponse = await tagModel.findOne({ name: tag });
        if (!tagResponse) {
            return res.status(404).json({
                message: "tag not found, please enter valid tag",
                success: false
            })
        }
        // image ka validation
        let fileType = image.name.split('.')[1].toLowerCase();
        const supportedFormats = ["jpeg", "jpg", "png"];
        if (!supportedFormats.includes(fileType)) {
            return res.status(400).json({
                message: "file type not supported, please upload valid file",
                success: false
            })
        }
        if (image.size > 5 * 1024 * 1024) {
            return res.status(400).json({
                message: "file is too large, max limit is 5 MB only",
                success: false
            })
        }
        // uploaded image to cloudinary
        const imageResponse = await ImageUploader(image, process.env.CLOUDINARY_COURSE_FOLDER);
        //course creation
        const courseCreated = await courseSchema.create({
            courseName,
            courseDescription: courseDescription,
            instructor: req.user.id,
            whatToLearn: whatToLearn,
            courseContent: [],
            price,
            thumbnail: imageResponse.secure_url,
            ratingandReview: [],
            tag: tagResponse._id,
            studentEnrolled: []
        });
        // add course entry in instructor profile that this course is created by instructor ot Instructor has created this course, student ke loye course list only bought courses hi dikheneg
        await userModel.findByIdAndUpdate(
            { _id: req.user.id },

            {
                $push: { courses: courseCreated._id }
            },
            { new: true }
        );
        // tag model me bhi add kro ki ye tag iss course me use hua h 
        await tagModel.findByIdAndUpdate({ _id: tagResponse._id },
            {
                $push: {
                    course: courseCreated._id
                }
            },
            { new: true }
        )
        //returned response
        return res.status(200).json({
            message: "course created successfully now please maintain the course by adding chapter ",
            success: true,
            course: courseCreated
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Internal server error, please try again later",
            error: "err"
        });
    }
}

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await courseSchema.find({}, {
            courseName: true,
            courseDescription: true, thumbnail: true, price: true, instructor: true, tag: true,createdAt:true
        }).populate("instructor").exec();
        if (courses.length === 0) {
            return res.status(404).json({
                message: "No courses found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Courses fetched successfully",
            success: true,
            courses: courses
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error, please try again later",
            error: "err"
        });
    }
}
exports.getCourseDetailsById = async (req, res) => {
    try {
        const { id: courseId } = req.params;

        // Best practice: Validate the courseId format first
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: `Invalid course ID format: ${courseId}`,
            });
        }

        // Fetch the course and populate all necessary fields
        const course = await courseSchema.findById(courseId)
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                }
            })
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                    select: "title timeDuration"
                }
            })
            .populate("ratingandReview") // This is required for the calculation
            .populate("tag")
            .populate("studentEnrolled")
            .exec();

        // Handle case where the course doesn't exist
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // --- RATING CALCULATION LOGIC ---
        const reviews = course.ratingandReview || [];
        const totalReviews = reviews.length;
        let averageRating = 0;

        if (totalReviews > 0) {
            const totalRatingValue = reviews.reduce(
                (acc, review) => acc + review.rating,
                0
            );
            averageRating = totalRatingValue / totalReviews;
        }

        // Create the final response object with the added rating data
        const courseDataWithRating = {
            ...course.toObject(), // Convert Mongoose doc to a plain JS object
            averageRating: parseFloat(averageRating.toFixed(2)),
            totalReviews: totalReviews,
        };
        // --- END OF CALCULATION ---

        // Return the successful response with the enhanced course data
        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            course: courseDataWithRating, // Send the object with the new properties
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error, please try again later",
        });
    }
}
exports.getAllEnrolledCourses = async (req, res) => {
    try {
        const user_id = req.user.id;
        const allEnrolled = await userModel.findById(user_id).populate("courses").exec();
        if (!allEnrolled) {
            return res.status(404).json({
                message: "Seems Like You Haven't Bought any Course Yet!"
                , success: false
            })
        }
        return res.status(200).json({
            message: "Enrolled courses fetched Successfully!",
            success: true,
            allEnrolled
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error, please try again later",
            error: "err"
        });
    }
}

exports.getCoursesByIds = async (req, res) => {
    try {
        const {ids} = req.body; // array of courseIds

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide an array of course IDs",
            });
        }

        // 1. Fetch courses from the database
        let courses = await courseSchema.find({ _id: { $in: ids } })
            .populate({
                path: "instructor",
                populate: { path: "additionalDetails" },
            })
            .populate({
                path: "courseContent",
                populate: { path: "subSection" },
            })
            .populate("ratingandReview")
            .populate("tag")
            .populate("studentEnrolled")
            .lean()
            .exec();

        // 2. VALIDATION: Check if all requested courses were found
        if (courses.length !== ids.length) {
            // This block runs if one or more course IDs were not found

            // For a more helpful error, find which IDs were missing
            const foundIds = new Set(courses.map(course => course._id.toString()));
            const missingIds = ids.filter(id => !foundIds.has(id));

            return res.status(404).json({
                success: false,
                message: `One or more courses not found. Missing IDs: ${missingIds.join(", ")}`,
            });
        }

        // 3. Process each course to calculate and add rating details (only if all were found)
        const coursesWithRatings = courses.map(course => {
            const totalReviews = (course.ratingandReview || []).length;

            let averageRating = 0;
            if (totalReviews > 0) {
                const totalRatingValue = course.ratingandReview.reduce(
                    (acc, review) => acc + review.rating,
                    0
                );
                averageRating = totalRatingValue / totalReviews;
            }

            return {
                ...course,
                averageRating: parseFloat(averageRating.toFixed(2)),
                totalReviews: totalReviews,
            };
        });

        return res.status(200).json({
            success: true,
            message: "Courses with ratings fetched successfully",
            courses: coursesWithRatings,
        });

    } catch (err) {
        console.error("Error fetching multiple courses with ratings:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required.",
            });
        }

        const course = await courseSchema.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
            });
        }

        const allowedFields = [
            "courseName",
            "courseDescription",
            "whatToLearn",
            "price",
            "status",
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                course[field] = req.body[field];
            }
        });


        if (req.files && req.files.thumbnail) {
            const imageResponse = await ImageUploader(
                req.files.thumbnail,
                process.env.CLOUDINARY_COURSE_FOLDER
            );

            if (!imageResponse?.secure_url) {
                return res.status(500).json({
                    success: false,
                    message: "Thumbnail upload failed.",
                });
            }

            course.thumbnail = imageResponse.secure_url;
        }

        await course.save();

        return res.status(200).json({
            success: true,
            message: "Course updated successfully.",
            course,
        });

    } catch (err) {
        console.error("Error in course update:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error. " + err.message,
        });
    }

}

exports.changeStatus =async(req,res)=>{
    try{
        const {courseId,status} = req.body;
        if(!courseId){
            return res.status(401).json({
                message:"please provide courseId",
                success:false,
            })
        }
        const course = await courseSchema.findById(courseId);
        course.status = "published";
        course.save();
        return res.status(200).json({
            success:true,
            message:"status changed",
            course
        });
    }catch(err){
        return res.status(500).json({
            message:"internal server error",
            success:false
        })
    }
}


// exports.checkEnroll = async(req,res)=>{
//     try {
//         const {UserId,CourseId} = req.body;
//         const user = await userModel.findById(UserId);
//         if(user.courses.includes(CourseId))
//     } catch (error) {
        
//     }
// }