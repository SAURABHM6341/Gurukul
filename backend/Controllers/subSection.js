const subSectionModel = require('../Models/SubSection');
const sectionModel = require('../Models/section');
const userModel = require('../Models/User');
const { videoUpload } = require('../Util/videoUploader');
const { updateCourse } = require('./Course_s');
const cloudinary = require('cloudinary').v2; // Import cloudinary for video deletion
// create sub section
exports.createSubSection = async (req, res) => {
    try {
        const { title, timeDuration, description } = req.body;
        const sectionId = req.body.sectionId || req.params.sectionId; // sectionId can be passed in body or params
        const lecture = req.files.video;
        // data validation
        if (!title || !timeDuration || !description || !sectionId) {
            return res.status(400).json({
                message: "Please fill all the fields",
                success: false
            });
        }
        if (!lecture) {
            return res.status(400).json({
                message: "Please upload a video file",
                success: false
            });
        }
        const supportedFormats = ["mp4", "avi", "mov", "mkv"];
        const fileType = lecture.name.split('.')[1].toLowerCase();
        if (!supportedFormats.includes(fileType)) {
            return res.status(400).json({
                message: "Unsupported video format, please upload a valid video file",
                success: false
            });
        }
        if (lecture.size > 100000000) { // 100 MB
            return res.status(400).json({
                message: "Video file size should be less than 100 MB",
                success: false
            });
        }

        //upload video to cloudinary get the url
        const videoResponse = await videoUpload(lecture, process.env.CLOUDINARY_VIDEO_FOLDER);
        if (!videoResponse || !videoResponse.secure_url) {
            return res.status(500).json({
                message: "Failed to upload video, please try again later",
                success: false
            });
        }
        const videoUrl = videoResponse.secure_url;
        // section validation
        const sectionResponse = await sectionModel.findById(sectionId);
        if (!sectionResponse) {
            return res.status(404).json({
                message: "Section not found, please enter valid section ID",
                success: false
            })
        }
        // sub section creation
        const subSectionCreated = await subSectionModel.create({
            title,
            timeDuration,
            description,
            videoUrl,
        })
        // how will you populate sub section in section 
        if (!subSectionCreated) {
            return res.status(500).json({
                message: "Internal server error, please try again later",
                success: false
            });
        }
        const subSectionId = subSectionCreated._id;
        // update section with sub section
        sectionResponse.subSection.push(subSectionId);
        await sectionResponse.save();
        return res.status(200).json({
            message: "Sub section created successfully",
            success: true,
            subSectionCreated
        });

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({
            message: "Internal server error, please try again later",
            success: false,
            error: err.message
        });
    }
}
//edit subsection
exports.editSubSection = async (req, res) => {
    try {
        const subSectionId = req.params.id;
        const { title, timeDuration, description } = req.body;
        const subSectionResponse = await subSectionModel.findById(subSectionId);
        if (!subSectionResponse) {
            return res.status(404).json({
                message: "Sub section not found, please enter valid sub section ID",
                success: false
            });
        }
        //edit me jitna part bheja jayega sirf wahi update hoga
        // means edit wale form me ham kuchh mandatory nhi rkhenge jo bhejoge wahi edit hoga 
        if (title) {
            subSectionResponse.title = title;
        }
        if (description) {
            subSectionResponse.description = description;
        }
        if (timeDuration) {
            subSectionResponse.timeDuration = timeDuration;
        }
        if (req.files && req.files.video) {
            const videoFile = req.files.video;
            const supportedFormats = ["mp4", "avi", "mov", "mkv"];
            const fileType = videoFile.name.split('.')[1].toLowerCase();
            if (!supportedFormats.includes(fileType)) {
                return res.status(400).json({
                    message: "Unsupported video format, please upload a valid video file",
                    success: false
                });
            }
            if (videoFile.size > 100000000) { // 100 MB
                return res.status(400).json({
                    message: "Video file size should be less than 100 MB",
                    success: false
                });
            }

            //upload video to cloudinary get the url
            const videoResponse = await videoUpload(videoFile, process.env.CLOUDINARY_VIDEO_FOLDER);
            if (!videoResponse || !videoResponse.secure_url) {
                return res.status(500).json({
                    message: "Failed to upload video, please try again later",
                    success: false
                });
            }
            const videoUrl = videoResponse.secure_url;
            const oldVideoUrl = subSectionResponse.videoUrl;
            subSectionResponse.videoUrl = videoUrl;
            
            // delete old video from cloudinary
            if (oldVideoUrl) {
                //extract public id from cloudinary url
                const extractPublicIdFromCloudinaryUrl = (url) => {
                    const parts = url.split('/');
                    const fileName = parts.pop().split('.')[0]; // 'lecture.mp4' → 'lecture'
                    const versionIndex = parts.findIndex(p => /^v\d+$/.test(p));
                    const publicIdParts = parts.slice(versionIndex + 1);
                    publicIdParts.push(fileName);
                    return publicIdParts.join('/');
                };

                const publicId = extractPublicIdFromCloudinaryUrl(oldVideoUrl);
                await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });

            }
        }
        await subSectionResponse.save();
        return res.status(200).json({
            message: "Sub section updated successfully",
            success: true,
            data: subSectionResponse
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error, please try again later",
            success: false,
            error: err.message
        });

    }
}

// delete subsection
exports.deleteSubSection = async (req, res) => {
    try {
        const { id } = req.params;
        const sectionId = req.body.sectionId;
        const subSectionResponse = await subSectionModel.findById(id);
        if (!subSectionResponse) {
            return res.status(404).json({
                message: "Sub section not found, please enter valid sub section ID",
                success: false
            });
        }
       const section =  await sectionModel.findByIdAndUpdate(sectionId,{
            $pull:{
                subSection: id
            }
        },{ new: true });
        // delete video from cloudinary
        const videoUrl = subSectionResponse.videoUrl;
        if (videoUrl) {
            const extractPublicIdFromCloudinaryUrl = (url) => {
                const parts = url.split('/');
                const fileName = parts.pop().split('.')[0]; // 'lecture.mp4' → 'lecture'
                const versionIndex = parts.findIndex(p => /^v\d+$/.test(p));
                const publicIdParts = parts.slice(versionIndex + 1);
                publicIdParts.push(fileName);
                return publicIdParts.join('/');
            };

            const publicId = extractPublicIdFromCloudinaryUrl(videoUrl);
            await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        }
        await subSectionModel.findByIdAndDelete(id);
        return res.status(200).json({
            message: "video deleted successfully",
            success: true
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error, please try again later",
            success: false,
            error: err.message
        });
    }
}
// get all subsections of a section
exports.getAllSubSections = async (req, res) => {
    try {
        const sectionId = req.params.sectionId;
        if (!sectionId) {
            return res.status(400).json({
                message: "Section ID is required",
                success: false
            });
        }
        const user = await userModel.findById(req.user.id);
        if (!user.courses.includes(courseId)) {
            return res.status(403).json({
                message: "You are not enrolled in this course",
                success: false
            });
        }
        const section = await sectionModel.findById(sectionId).populate('subSection');
        if (!section) {
            return res.status(404).json({
                message: "Section not found",
                success: false
            });
        }
        if (!section.subSection || section.subSection.length === 0) {
            return res.status(404).json({
                message: "No sub sections found for this section",
                success: false
            });
        }
        return res.status(200).json({
            message: "Sub sections fetched successfully",
            success: true,
            data: section.subSection
        });
    } catch (err) {

    }
}