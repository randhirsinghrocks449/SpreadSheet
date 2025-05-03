import express from 'express';
import {
    createSheet,
    getAllSheets,
    getSheetById,
    deleteSheet
} from '../controllers/spreadsheet.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/createSheet', auth, createSheet);
router.get('/getAllSheets', auth, getAllSheets);
router.get('/getSheetById/:id', auth, getSheetById);
router.delete('/deleteSheet/:id', auth, deleteSheet);

export default router;
