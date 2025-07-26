const mongoose = require('mongoose');
const courseProgressScheme = new mongoose.Schema({
    CourseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
    },
    CompletedVideos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubSection",
        }
    ]


});
moudule.exports = mongoose.model('courseProgress', courseProgressScheme);
