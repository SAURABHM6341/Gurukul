const mongoose = require('mongoose');
const rateandReviewSchema = new mongoose.Schema({
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "course",
        required: true,
    },
    rating:{
        type:Number,
        required: true,
    },
    review:{
        type:String,
        required: true,
    },
});
module.exports = mongoose.model('RateandReview', rateandReviewSchema);