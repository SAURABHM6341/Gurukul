const sectionModel = require('../Models/section');
const subSectionModel = require('../Models/SubSection');
const courseModel = require('../Models/course');
const userModel = require('../Models/User');
exports.createSection = async (req, res) => {
    try {
        const {sectionName,courseId} = req.body;
        if (!sectionName) {
            return res.status(400).json({
                message: "Please fill all the fields",
                success: false
            });
        }
        const section = await sectionModel.create({
            sectionName: sectionName,
            subSection: []
        });
        if (!section) {
            return res.status(500).json({
                message: "section creation failed, please try again",
                success: false
            });
        }
        // update course;
        const updatedCourse = await courseModel.findByIdAndUpdate(courseId,{
            $push:{
                courseContent:section._id
            }
        },{new: true});

        // i want to polulate section and subcsection in course
        // how to do that
        return res.status(200).json({
            message: "Section created successfully",
            success: true,
            section
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}
// edit section

exports.editSection = async (req, res) => {
    try {
        const {sectionName} = req.body;
        const {sectionId} = req.params;
        if (!sectionId || !sectionName) {
            return res.status(400).json({
                message: "Section ID and new name are required",
                success: false
            });
        }
        /*  below is one way to id by findbyidandupdate and one more way is to change manually and call save() because it triggers middleware so it can be more useful */
        // const section = await sectionModel.findByIdAndUpdate(
        //     sectionId,
        //     { sectionName: sectionNewName },
        //     { new: true });
        const section = await sectionModel.findById(sectionId);
        if (!section) {
            return res.status(404).json({
                message: "Section cannot be updated or not found",
                success: false
            });
        }
        section.sectionName = sectionName;   // updating the section name
        await section.save();  // saving the updated section
        if (!section) {
            return res.status(500).json({
                message: "Section update failed, please try again",
                success: false
            });
        }
        return res.status(200).json({
            message: "Section updated successfully",
            success: true,
            section
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}


// delete section
exports.deleteSection = async (req, res) => {
    //optimisation: once a section is deleted then all its subsection and all video from subsection should be deleted 
    // similary if course is deleted then all its section and subsection should be deleted
    // but for now we will just delete section and not its subsection 
    try {
        const courseId = req.params.courseId;
        const sectionId = req.body.sectionId;
        if (!sectionId) {
            return res.status(400).json({
                message: "Section ID is required",
                success: false
            });
        }
        const subsections = await sectionModel.findById(sectionId).select('subSection');
        const section = await sectionModel.findByIdAndDelete(sectionId);
        if (subsections) {
            await subSectionModel.deleteMany({ _id: { $in: subsections.subSection } });
        }

        // remove section from course
        await courseModel.findByIdAndUpdate(courseId,{
            $pull:{
                courseContent: sectionId
            }
        }, {new: true});
        return res.status(200).json({
            message: "Section deleted successfully",
            success: true
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

//get all sections of a course
exports.getAllSections = async (req, res) => {
    const courseId = req.params.courseId;
    const courses = await courseModel.findById(courseId).select('courseContent');
    const sectionId  = courses.courseContent;
    if (!sectionId || sectionId.length === 0) {
        return res.status(404).json({
            message: "No sections found for this course",
            success: false
        });
    }
    const user = await userModel.findById(req.user.id);
    if(!user.courses.includes(courseId)){
        return res.status(403).json({
            message: "You are not enrolled in this course",
            success: false
        });
    }
    const sections = await sectionModel.find({_id: {$in: sectionId}}).populate('subSection');
    return res.status(200).json({
        message: "Sections fetched successfully",
        success: true,
        sections
    });
}