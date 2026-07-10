const { cloudinary } = require('../config/cloudinary');
const fs = require('fs');

const uploadToCloudinary = async (filePath, folder = 'nagrik360') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto',
    });

    // Delete local file after upload
    try {
      fs.unlinkSync(filePath);
    } catch (unlinkError) {
      console.warn('Failed to delete local file:', unlinkError.message);
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary Upload Error:', error.message);
    throw new Error('Failed to upload file to cloud storage');
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary Delete Error:', error.message);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };