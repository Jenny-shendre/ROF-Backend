import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_url: process.env.CLOUDINARY_URL
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // Upload the file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // File has been uploaded successfully
        fs.unlinkSync(localFilePath); // Remove the locally saved temporary file
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); // Remove the locally saved temporary file if upload fails
        console.error("Cloudinary upload failed:", error.message);
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
};



const deleteOnCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;

        //delete file from cloudinary
        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: "auto"
        });
        return response;

    } catch (error) {
        console.log("delete on cloudinary failed", error);
        throw new Error(`Cloudinary deletion failed: ${error.message}`);
    }
};



export {uploadOnCloudinary, deleteOnCloudinary}