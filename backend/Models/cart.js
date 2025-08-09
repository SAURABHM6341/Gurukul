const mongoose = require('mongoose');
const CartSchema = new mongoose.Schema({
email:{
    type:String,
    required: true,
},
course:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
    default: null,
}]
})
module.exports = mongoose.model("cart", CartSchema);
