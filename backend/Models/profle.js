const mongoose = require('mongoose')
const profileScheme = new mongoose.Schema({
    gender:{
        type:String,
        required: true,
        enum:['Male','Female','Other', 'unspecified'],
        default:'unspecified',
    },
    dateOfBirth: {
        type: Date,
        default:null,
    },
    about:{
        type: String,
        trim: true,
    },
    contactNumber:{
        type: String,
        trim: true,
    },

});
module.exports = mongoose.model('profile', profileScheme);