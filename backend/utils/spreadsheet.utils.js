import Spreadsheet from '../models/spreadsheet.model.js';
import CellHistory from '../models/cellHistory.model.js';

export const updateCellValue = async (data) => {
    try {
        const { userId, cellId, newValue, spreadsheetId } = data
        const spreadsheet = await Spreadsheet.findById(spreadsheetId);
        if (!spreadsheet) throw new Error('Spreadsheet not found');

        const cell = spreadsheet.cells.find(c => c.cellId === cellId);
        if (!cell) throw new Error('Cell not found');

        const oldValue = cell.value;
        cell.value = newValue;
        await spreadsheet.save();

        await saveCellHistory(spreadsheetId, cellId, oldValue, newValue, userId);

        return { cellId, newValue, oldValue, spreadsheetId };
    } catch (error) {
        throw new Error(`Error updating cell: ${error.message}`);
    }
};

const saveCellHistory = async (spreadsheetId, cellId, oldValue, newValue, userId) => {
    try {
        const history = new CellHistory({
            spreadsheet: spreadsheetId,
            cellId,
            previousValue: oldValue,
            newValue,
            editedBy: userId,
        });
        await history.save();
    } catch (error) {
        throw new Error(`Error saving cell history: ${error.message}`);
    }
};
