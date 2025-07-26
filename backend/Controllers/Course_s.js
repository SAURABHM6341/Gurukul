const courseSchema = require('../Models/course');
const userModel = require('../Models/User');
const tagModel = require('../Models/tags');
const mongoose = require('mongoose');
const {ImageUploader} = require('../Util/imageUploader');
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
            instructor: req.user._id,
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
                $push: { coursesCreated: courseCreated._id }
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
        console.error(err);
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
            courseDescription: true, thumbnail: true, price: true, instructor: true, tag: true
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
        const courseId = req.params.id;
        if (!courseId) {
            return res.status(400).json({
                message: "Please provide course ID",
                success: false
            });
        }
        const course = await courseSchema.findById(courseId)
            .populate({
                path: "instructor",
                populate:{
                    path: "additionalDetails",
                }
            })
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection", // 👈 populate the nested object inside Section
                }
            }).populate("ratingandReview").populate("tag").populate("studentEnrolled").exec();
        if (!course) {
            return res.status(404).json({
                message: "Course not found",
                success: false
            });
        }
        return res.status(200).json({
            message: "Course details fetched successfully",
            success: true,
            course: course
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error, please try again later",
            error: "err"
        });
    }
}