import multer from 'multer';

const upload = multer({
  storage: multer.diskStorage({}),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
});

export default upload;
