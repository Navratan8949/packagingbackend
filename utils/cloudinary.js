const cloudinary = require("cloudinary").v2;
const fs = require("fs");
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath || !(await fs.existsSync(localFilePath))){
            throw new Error("File not found at the specified path");
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "builder/images"
        });
        console.log("file uploaded successfully", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.log(error);
        fs.unlinkSync(localFilePath);
        return null;
    }
}

const deleteFromCloudinary = async(public_id)=>{
    try {
        await cloudinary.uploader.destroy(public_id);
        return true      
    } catch (error) {
        console.log(error)
        return false
    }
}
 
module.exports = {uploadOnCloudinary, deleteFromCloudinary};