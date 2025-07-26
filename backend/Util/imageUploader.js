const cloudinary = require('cloudinary').v2;
require('dotenv').config();
exports.ImageUploader = async (file, folder,quality,height,width) => {
    try {
        if(quality){
            options.quality = quality;
        }
        if(height && width) {
            options.height = height;
            options.width = width;
        }
        const options = {folder};
        options.resource_type = 'auto'; // Automatically detect resource type (image, video, etc.)
        return await cloudinary.uploader.upload(file.tempFilePath, options);
    } catch (err) {
        console.error("Error in ImageUploader:", err);
        throw err;
    }
}