// routes/upload.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// 업로드 폴더 설정 (없으면 생성)
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// multer 저장소 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // uploads 폴더에 저장
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // .jpg, .png 등
    const base = path.basename(file.originalname, ext);
    const uniqueSuffix = Date.now();
    cb(null, `${base}-${uniqueSuffix}${ext}`);
  },
});

// 이미지 파일만 허용하도록 필터링
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("이미지 파일만 업로드할 수 있습니다.")); // 에러 -> 4일차 실패 케이스에 사용
  }
};

const upload = multer({ storage, fileFilter });

// 이미지 업로드 API
// POST /api/upload/image
router.post("/image", upload.single("image"), (req, res) => {
  // multer가 파일 정보를 req.file에 넣어준다.
  const file = req.file;
  const imageUrl = `/uploads/${file.filename}`; // 서버에서 접근 가능한 경로

  res.status(201).json({
    url: imageUrl,
    filename: file.filename,
  });
});

export default router;
