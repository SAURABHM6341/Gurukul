const mongoose = require('mongoose');
const Tag = require('../Models/tags');
const courseModel = require('../Models/course');
exports.createTagOrCategory = async (req, res) => {
    try {
        const { tagname, Description } = req.body;
        if (!tagname || !Description) {
            return res.status(400).json({ message: 'Tag name or Description is required' });
        }
        const existingTag = await Tag.findOne({ name: tagname });
        if (existingTag) {
            return res.status(400).json({ message: 'Tag already exists' });
        }
        const newTag = await Tag.create({
            name: tagname,
            Description: Description,
        });
        if (!newTag) {
            return res.status(500).json({ message: 'Failed to create tag' });
        }
        res.status(201).json({ message: 'Tag created successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error||path is controllers/tags.js' });
    }
}
exports.getallTag_s = async (req, res) => {
    try {
        const tags = await Tag.find({}, { name: true, Description: true });
        if (!tags || tags.length === 0) {
            return res.status(404).json({ message: 'No tags found' });
        }
        res.status(200).json({
            message: 'Tags retrieved successfully',
            tags
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error||path is controllers/tags.js' });
    }
}
exports.tagpageDetails = async (req, res) => {
    try {
        const { tagId } = req.body;
        if (!tagId) {
            return res.status(400).json({ message: 'Tag ID is required' });
        }
        // fetch course of this tag
        const tag = await Tag.findById(tagId).populate(
            {
                path: 'course',
                select: 'courseName courseDescription thumbnail price',
            }
        ).exec();
        if (!tag) {
            return res.status(404).json({
                message: 'Tag not found',
                success: false
            });
        }
        // now different categories
        const differentCategories = await Tag.find({ _id: { $ne: tagId } }).populate('course').exec();

        // top selling course

        const topSellingCourses = await courseModel.aggregate([
            {
                $project: {
                    courseName: 1,
                    price: 1,
                    thumbnail: 1,
                    instructor: 1,
                    studentCount: { $size: '$studentEnrolled' }
                }
            },
            { $sort: { studentCount: -1 } },
            { $limit: 10 }
        ]);
        res.status(200).json({
            message: 'Tag details retrieved successfully',
            tag,
            differentCategories,
            topSellingCourses
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error||path is controllers/tags.js' });
    }
}