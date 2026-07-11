const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = `${uuidv4()}-${Date.now()}${ext}`;
    cb(null, fileName);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|bmp|webp|svg/;
  const allowedAudioTypes = /mp3|wav|ogg|m4a|webm/;
  const allowedVideoTypes = /mp4|mov|avi|mkv/;

  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  const isImage = allowedImageTypes.test(ext);
  const isAudio = allowedAudioTypes.test(ext);
  const isVideo = allowedVideoTypes.test(ext);

  if (isImage || isAudio || isVideo) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only images (jpeg, jpg, png, gif, webp), audio (mp3, wav, ogg), and video (mp4, mov) are allowed.'
      ),
      false
    );
  }
};

// Determine file type
const determineFileType = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('audio/')) return 'audio';
  if (mimetype.startsWith('video/')) return 'video';
  return 'image';
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: fileFilter,
});

module.exports = { upload, determineFileType };