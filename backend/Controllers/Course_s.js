const courseSchema = require('../Models/course');
const userModel = require('../Models/User');
const tagModel = require('../Models/tags');
const sectionModel = require('../Models/section');
const subSectionModel = require('../Models/SubSection');
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
        const courses = await courseSchema.find(
            { status: "published" },
            {
                courseName: true,
                courseDescription: true,
                thumbnail: true,
                price: true,
                instructor: true,
                tag: true,
                createdAt: true,
                status: true
            }
        ).populate("instructor").exec();

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
            .populate("ratingandReview")
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
        const allEnrolled = await userModel.findById(user_id).populate(
            {
                path: "courses",
                populate: {
                    path: "courseContent",
                    populate: {
                        path: "subSection",
                    }
                }
            }
        ).exec();
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
        const { ids } = req.body; // array of courseIds

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
        const { courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required.",
            });
        }

        const course = await courseSchema.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            }
        }).exec();
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
            });
        }

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
        const allowedFields = [
            "courseName",
            "courseDescription",
            "whatToLearn",
            "price",
        ];
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                course[field] = req.body[field];
            }
        });

        await course.save();
        console.log("Updated Course:", course);
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

exports.changeStatus = async (req, res) => {
    try {
        const { courseId, status } = req.body;
        if (!courseId) {
            return res.status(401).json({
                message: "please provide courseId",
                success: false,
            })
        }
        const course = await courseSchema.findById(courseId).populate('instructor');
        const oldStatus = course.status;
        course.status = status;
        await course.save();
        
        // Send email notification to instructor about status change
        if (oldStatus !== status) {
            const mailSender = require('../Util/mailsender');
            const instructor = course.instructor;
            
            let emailTitle, emailBody;
            
            if (status === 'published') {
                emailTitle = "🎉 Course Published - Gurukul";
                emailBody = `
                    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
                        <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 30px; text-align: center; border-radius: 15px 15px 0 0;">
                            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">🎉 Course Published!</h1>
                            <p style="color: #c6f6d5; margin: 10px 0 0 0; font-size: 16px;">Gurukul - Centralized Learning Platform</p>
                        </div>
                        
                        <div style="background-color: white; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <h2 style="color: #2d3748; margin-bottom: 20px; font-size: 24px;">Congratulations!</h2>
                            
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                Hi <strong>${instructor.firstName} ${instructor.lastName}</strong>,
                            </p>
                            
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                Great news! Your course "<strong>${course.courseName}</strong>" has been successfully published and is now live on Gurukul platform.
                            </p>
                            
                            <div style="background-color: #f0fff4; border-left: 4px solid #48bb78; padding: 20px; margin: 30px 0; border-radius: 5px;">
                                <h3 style="color: #2f855a; margin: 0 0 15px 0; font-size: 18px;">📚 Course Details</h3>
                                <ul style="color: #2f855a; margin: 0; padding-left: 20px; font-size: 14px;">
                                    <li><strong>Course Name:</strong> ${course.courseName}</li>
                                    <li><strong>Price:</strong> ₹${course.price}</li>
                                    <li><strong>Status:</strong> Published ✅</li>
                                    <li><strong>Published Date:</strong> ${new Date().toLocaleDateString()}</li>
                                </ul>
                            </div>
                            
                            <h3 style="color: #2d3748; font-size: 18px; margin: 30px 0 15px 0;">🚀 What's next?</h3>
                            <ol style="color: #4a5568; font-size: 16px; line-height: 1.6; padding-left: 20px;">
                                <li>Students can now enroll in your course</li>
                                <li>Monitor your course performance in the instructor dashboard</li>
                                <li>Engage with students through discussions</li>
                                <li>Update course content as needed</li>
                            </ol>
                            
                            <div style="text-align: center; margin: 40px 0;">
                                <a href="${process.env.FRONTEND_URL}/instructor/dashboard" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block;">
                                    View Instructor Dashboard
                                </a>
                            </div>
                            
                            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                                <p style="color: #718096; font-size: 14px; text-align: center; margin: 0;">
                                    Keep creating amazing content!<br>
                                    <strong>The Gurukul Team</strong><br>
                                    🎓 Empowering educators worldwide
                                </p>
                            </div>
                        </div>
                    </div>
                `;
            } else if (status === 'draft') {
                emailTitle = "📝 Course Status Updated - Gurukul";
                emailBody = `
                    <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
                        <div style="background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%); padding: 30px; text-align: center; border-radius: 15px 15px 0 0;">
                            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">📝 Course Moved to Draft</h1>
                            <p style="color: #fed7cc; margin: 10px 0 0 0; font-size: 16px;">Gurukul - Centralized Learning Platform</p>
                        </div>
                        
                        <div style="background-color: white; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <h2 style="color: #2d3748; margin-bottom: 20px; font-size: 24px;">Course Status Updated</h2>
                            
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                Hi <strong>${instructor.firstName} ${instructor.lastName}</strong>,
                            </p>
                            
                            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                Your course "<strong>${course.courseName}</strong>" has been moved back to draft status. This means it's currently not visible to students on the platform.
                            </p>
                            
                            <div style="background-color: #fef5e7; border-left: 4px solid #f6ad55; padding: 20px; margin: 30px 0; border-radius: 5px;">
                                <h3 style="color: #c05621; margin: 0 0 15px 0; font-size: 18px;">📚 Course Details</h3>
                                <ul style="color: #c05621; margin: 0; padding-left: 20px; font-size: 14px;">
                                    <li><strong>Course Name:</strong> ${course.courseName}</li>
                                    <li><strong>Status:</strong> Draft 📝</li>
                                    <li><strong>Updated Date:</strong> ${new Date().toLocaleDateString()}</li>
                                </ul>
                            </div>
                            
                            <h3 style="color: #2d3748; font-size: 18px; margin: 30px 0 15px 0;">🔧 What you can do now:</h3>
                            <ol style="color: #4a5568; font-size: 16px; line-height: 1.6; padding-left: 20px;">
                                <li>Review and edit your course content</li>
                                <li>Add more lectures or improve existing ones</li>
                                <li>Update course description and pricing</li>
                                <li>Request republishing when ready</li>
                            </ol>
                            
                            <div style="text-align: center; margin: 40px 0;">
                                <a href="${process.env.FRONTEND_URL}/instructor/edit-course/${course._id}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block;">
                                    Edit Course
                                </a>
                            </div>
                            
                            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                                <p style="color: #718096; font-size: 14px; text-align: center; margin: 0;">
                                    Keep improving your content!<br>
                                    <strong>The Gurukul Team</strong><br>
                                    🎓 Supporting educators every step of the way
                                </p>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            // Send email notification
            try {
                await mailSender(instructor.email, emailTitle, emailBody);
                console.log(`Course status change email sent to ${instructor.email}`);
            } catch (emailError) {
                console.error("Error sending course status email:", emailError);
                // Don't fail the status change if email fails
            }
        }
        
        return res.status(200).json({
            success: true,
            message: "status changed",
            course
        });
    } catch (err) {
        return res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}



exports.getfullCourseDetailsById = async (req, res) => {
    try {
        const { id: courseId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: `Invalid course ID format: ${courseId}`,
            });
        }
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
                }
            })
            .populate("ratingandReview")
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
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required", success: false });
        }

        // Find the course and check for ownership (CRITICAL security check)
        const course = await courseSchema.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found", success: false });
        }

        if (course.instructor.toString() !== userId) {
            return res.status(403).json({
                message: "You are not authorized to delete this course",
                success: false
            });
        }

        // --- Efficient Deletion Logic (without transaction) ---

        // 1. Collect all Section IDs from the course
        const sectionIds = course.courseContent;

        if (sectionIds && sectionIds.length > 0) {
            // 2. Find all sections and collect their sub-section IDs
            const sections = await sectionModel.find({ _id: { $in: sectionIds } });
            const subSectionIds = sections.flatMap(section => section.subSection);

            // 3. Delete all subsections in one go
            if (subSectionIds && subSectionIds.length > 0) {
                await subSectionModel.deleteMany({ _id: { $in: subSectionIds } });
            }

            // 4. Delete all sections in one go
            await sectionModel.deleteMany({ _id: { $in: sectionIds } });
        }
        //un-enroll all students from this course

        await userModel.updateMany(
            { courses: courseId },
            { $pull: { courses: courseId } }
        );
        console.log(`Un-enrolled students from course: ${courseId}`);


        // 6. Delete the course itself
        await courseSchema.findByIdAndDelete(courseId);

        return res.status(200).json({
            message: "Course deleted successfully",
            success: true,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error, please try again later",
            success: false,
            error: error.message,
        });
    }
};