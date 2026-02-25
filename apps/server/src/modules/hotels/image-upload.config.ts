import * as fs from 'fs';
import * as path from 'path';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';


 
// 配置文件存储
export const multerOptions = {
  storage: diskStorage({
    destination: (req, file, callback) => {
      // 根据文件类型或其他逻辑设置存储目录
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images');
      // 确保目录存在
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
      // 生成唯一文件名
      const uniqueSuffix = `${uuidv4()}${path.extname(file.originalname)}`;
      callback(null, uniqueSuffix);
    },
  }),
  // 文件过滤器
  fileFilter: (req, file, callback) => {
    // 只允许图片文件
    if (!file.mimetype.match(/^(image\/jpeg|image\/png|image\/gif|image\/webp)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  },
  // 限制文件大小 (5MB)
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
};