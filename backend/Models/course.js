const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema({
    courseName:{
        type:String,
        required: true,
        trim: true,
    },
    courseDescription: {
        type: String,
        required: true,
        trim: true,
    },
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    whatToLearn: {
        type: String,
        required: true,
        trim: true,
    },
    courseContent:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"section",
    }],
    ratingandReview:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RateandReview",

    }],
    price:{
        type:Number,
        required: true,
        default: 0,
    },
    thumbnail:{
        type: String,
        required: true,
    },
    tag:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Tag",
    },
    studentEnrolled:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    status: {
        type: String,
        enum: ["draft", "published", "inactive"],
        default: "draft",
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.models.course || mongoose.model('course', courseSchema);