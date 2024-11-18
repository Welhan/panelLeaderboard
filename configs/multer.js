const multer = require("multer");
const path = require("path");

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/images"); // Save images in 'uploads/images'
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filenames
  },
});

// Configure storage for xlsx files
const xlsxStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/xlsx"); // Save Excel files in 'uploads/xlsx'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to check MIME types
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .png, and .xlsx files are allowed!"), false);
  }
};

// Multer upload functions
const uploadImage = multer({ storage: imageStorage, fileFilter });
const uploadXlsx = multer({ storage: xlsxStorage, fileFilter });

module.exports = { uploadImage, uploadXlsx };
