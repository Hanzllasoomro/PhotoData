import express from 'express';
import { detailsExtractor } from '../controllers/aiController.js';
import { upload } from '../configs/multer.js';

const aiRouter = express.Router();

aiRouter.post('/details-extract', upload.single('image'), detailsExtractor);

export default aiRouter;
