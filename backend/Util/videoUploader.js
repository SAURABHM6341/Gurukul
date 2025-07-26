const cloudinary = require('cloudinary').v2;
 exports.videoUpload = async (video,folder) => {
    const options = {
        resource_type: "auto", // Automatically detect the media format
        folder
    }
    return await cloudinary.uploader.upload(video.tempFilePath, options);
}