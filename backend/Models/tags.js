const mongoose = require('mongoose');
const TagSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    Description:{
        type:String,
        required: true,
    },
    course:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
        default: null,
    }],
});
module.exports = mongoose.model('Tag', TagSchema);