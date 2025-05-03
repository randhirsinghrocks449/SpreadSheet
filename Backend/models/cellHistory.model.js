import mongoose from 'mongoose';

const cellHistorySchema = new mongoose.Schema({
  spreadsheet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Spreadsheet',
    required: true,
  },
  cellId: {
    type: String,
    required: true,
  },
  previousValue: String,
  newValue: String,
  editedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const CellHistory = mongoose.model('CellHistory', cellHistorySchema);
export default CellHistory;
