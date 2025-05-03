import Spreadsheet from '../models/spreadSheet.model.js';
import { asyncHandler } from '../utils/catchAsync.utils.js';

export const createSheet = asyncHandler(async (req, res) => {
    const { name, rows = 10, columns = 10 } = req.body;
    const userId = req.user._id;

    const existingSheet = await Spreadsheet.findOne({ name, owner: userId });
    if (existingSheet) {
        res.status(400);
        throw new Error('You already have a spreadsheet with this name');
    }

    const cells = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            cells.push({
                cellId: `${row}-${col}`,
                value: '',
                formula: '',
            });
        }
    }
    const spreadsheet = await Spreadsheet.create({
        name,
        owner: userId,
        cells,
    });

    res.status(201).json(spreadsheet);
});

export const getAllSheets = asyncHandler(async (req, res) => {
    const spreadsheets = await Spreadsheet.find({ owner: req.user._id });
    res.status(200).json(spreadsheets);
});

export const getSheetById = asyncHandler(async (req, res) => {
    const spreadsheet = await Spreadsheet.findOne({
        _id: req.params.id,
    });
    if (!spreadsheet) {
        res.status(404);
        throw new Error('Spreadsheet not found');
    }
    res.status(200).json(spreadsheet);
});

export const deleteSheet = asyncHandler(async (req, res) => {
    await Spreadsheet.deleteOne({
        _id: req.params.id,
    });
    res.status(200).json({ mss: 'Success' });
});

