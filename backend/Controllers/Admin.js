const User = require('../Models/User');
const Course = require('../Models/course');
const profile = require('../Models/profle');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const reqUserId = req.user.id;
        const reqUser = await User.findById(reqUserId);
        if (!reqUser) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        const users = await User.find()
            .populate('additionalDetails')
            .populate('courses')
            .sort({ createdAt: -1 }).exec();

        return res.status(200).json({
            success: true,
            message: 'All users fetched successfully',
            data: users
        });
    } catch (error) {
        console.error('Error fetching all users:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
};

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const reqUserId = req.user.id;
        const reqUser = await User.findById(reqUserId);
        if (!reqUser) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        const students = await User.find({ accountType: 'Student' })
            .populate('additionalDetails')
            .populate('courses')
            .sort({ createdAt: -1 }).exec();
        if (!students) {
            return res.status(404).json({
                success: false,
                message: 'No students found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'All students fetched successfully',
            data: students
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch students',
            error: error.message
        });
    }
};

// Get all instructors
exports.getAllInstructors = async (req, res) => {
    try {
        const reqUserId = req.user.id;
        const reqUser = await User.findById(reqUserId);
        if (!reqUser) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        const instructors = await User.find({ accountType: 'Instructor' })
            .populate('additionalDetails')
            .populate({
                path: 'courses',
                populate: {
                    path: 'studentEnrolled',
                    select: 'Fname Lname email'
                }
            })
            .sort({ createdAt: -1 }).exec();
        if (!instructors) {
            return res.status(404).json({
                success: false,
                message: 'No instructors found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'All instructors fetched successfully',
            data: instructors
        });
    } catch (error) {
        console.error('Error fetching instructors:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch instructors',
            error: error.message
        });
    }
};

// Get user details by ID
exports.getUserDetails = async (req, res) => {
    try {
        const reqUserId = req.user.id;
        const reqUser = await User.findById(reqUserId);
        if (!reqUser) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        const { userId } = req.params;

        const user = await User.findById(userId)
            .populate('additionalDetails')
            .populate({
                path: 'courses',
                populate: {
                    path: 'instructor',
                    select: 'Fname Lname email'
                }
            })
            .populate('courseProgress')
            .exec();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // If user is instructor, get courses created by them
        let createdCourses = [];
        if (user.accountType === 'Instructor') {
            createdCourses = await Course.find({ instructor: userId })
                .populate('studentEnrolled', 'Fname Lname email')
                .populate('tag').exec();
        }

        return res.status(200).json({
            success: true,
            message: 'User details fetched successfully',
            data: {
                user,
                createdCourses
            }
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch user details',
            error: error.message
        });
    }
};

// Get all courses for admin
exports.getAllCourses = async (req, res) => {
    try {
        const reqUserId = req.user.id;
        const reqUser = await User.findById(reqUserId);
        if (!reqUser) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }
        const courses = await Course.find()
            .populate('instructor', 'Fname Lname email')
            .populate('category')
            .populate('tag')
            .populate('studentEnrolled', 'Fname Lname email')
            .sort({ createdAt: -1 }).exec();
        if (!courses) {
            return res.status(404).json({
                success: false,
                message: 'No courses found'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'All courses fetched successfully',
            data: courses
        });
    } catch (error) {
        console.error('Error fetching all courses:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch courses',
            error: error.message
        });
    }
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ accountType: 'Student' });
        const totalInstructors = await User.countDocuments({ accountType: 'Instructor' });
        const totalAdmins = await User.countDocuments({ accountType: 'Admin' });
        const totalCourses = await Course.countDocuments();

        // Get recent registrations (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentRegistrations = await User.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        return res.status(200).json({
            success: true,
            message: 'Dashboard statistics fetched successfully',
            data: {
                totalUsers,
                totalStudents,
                totalInstructors,
                totalAdmins,
                totalCourses,
                recentRegistrations
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        });
    }
};
