const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
    User:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseName:{
        type: String,
        required: true,
    },
    Price:{
        type:String,
        required:true,
    },
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"course",
        required: true
    },
    address:{
        type: String,
        required: true,
    },
    pincode:{
        type: String,
        required: true,
    }

});
module.exports = mongoose.model('invoice', invoiceSchema);