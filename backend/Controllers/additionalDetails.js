const profileScheme = require('../Models/profle');
const userSchema = require('../Models/User');
const { ImageUploader } = require('../Util/imageUploader');
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
        const userDetails = await userSchema.findById(id).populate("additionalDetails").exec();
        if(!userDetails){
            return res.status(400).json({
                message:"user not found",
                success:false
            });
        }
        return res.status(200).json({
            message:"user details are below",
            success:true,
            userDetails
        });
    }catch(err){
        return res.status(500).json({
            message:"internal server error",
            success:false
        })
    }
}

exports.updateProfileImage = async (req, res) => {
  try {
    const image = req.files?.image;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    const fileType = image.name.split('.').pop().toLowerCase();
    const supportedFormats = ["jpeg", "jpg", "png"];

    if (!supportedFormats.includes(fileType)) {
      return res.status(400).json({
        success: false,
        message: "File type not supported. Please upload jpeg, jpg, or png",
      });
    }

    if (image.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "File is too large. Max size allowed is 5MB",
      });
    }

    // Upload image to cloudinary
    const uploadedImage = await ImageUploader(image, process.env.CLOUDINARY_COURSE_FOLDER);

    // Update user document
    const updatedUser = await userSchema.findByIdAndUpdate(
      req.user.id,
      { image: uploadedImage.secure_url },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      updatedUser
    });

  } catch (error) {
    console.error("Image update error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating profile image",
    });
  }
};
