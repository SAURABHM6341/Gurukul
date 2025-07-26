const profileScheme = require('../Models/profle');
const userSchema = require('../Models/User');
//tested
// edit the users additonal details
exports.editDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            gender,
            dateOfBirth,
            about = "",
            contactNumber = "Not Available"
        } = req.body;
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
                success: false
            });
        }
        const user = await userSchema.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }
        const profileId = user.additionalDetails;
        const updatedDetails = await profileScheme.findByIdAndUpdate(profileId, {
            gender: gender,
            dateOfBirth: dateOfBirth,
            about: about,
            contactNumber: contactNumber
        }, { new: true });
        await user.populate('additionalDetails');

        return res.status(200).json({
            message: "Additional details updated successfully",
            success: true,
            updatedDetails: updatedDetails,
            user: user
        });
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: err.message
        });
    }
}

// get all user details

exports.getallDetails = async (req,res)=>{
    try{
        const id  = req.user.id;
        const user = await userSchema.findById(id).populate("additionalDetails").exec();
        if(!user){
            return res.status(400).json({
                message:"user not found",
                success:false
            });
        }
        return res.status(200).json({
            message:"user details are below",
            success:true,
            user
        });
    }catch(err){
        return res.status(500).json({
            message:"internal server error",
            success:false
        })
    }
}