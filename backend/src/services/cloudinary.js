import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET, // Click 'View API Keys' above to copy your API secret
});

// Upload the Profile
const uploadFile = async (path, folder, resourceType) => {
  try {
    const data = await cloudinary.uploader.upload(path, {
      folder: folder,
      resource_type: resourceType,
    });
    return { url: data.secure_url, publicId: data.public_id };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//Deletes a file, will be used when editing post file or profile
const deleteFile = async (path, folder) => {
  try {
    await cloudinary.uploader
      .destroy(path, { folder: folder, invalidate: true })
      .then((result) => console.log(result));
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export { uploadFile, deleteFile };
