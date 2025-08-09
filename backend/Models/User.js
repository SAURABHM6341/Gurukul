const mongoose = require('mongoose');
const Userschema = new mongoose.Schema({
    Fname: {
        type: String,
        required: true,
        trim: true,
    },
    Lname: {
        type: String,
        required: false,
        trim: true,
        default: '',
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    confirmPassword: {
        type: String,
        required: true,
        trim: true,
    },
    accountType: {
        type: String,
        required: true,
        enum: ['Student', 'Instructor', 'Admin'],
        default: 'Student',
    },
    additionalDetails: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile'
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "course"
    }],
    image: {
        type: String,
        required: true,
    },
    courseProgress: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "courseProgress"
    }],
    markedForDeletion: {
        type: Boolean,
        default: false,
    },
    deletionScheduledAt: {
        type: Date,
    },

});
module.exports = mongoose.model('User', Userschema);