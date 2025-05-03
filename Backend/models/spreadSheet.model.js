// models/spreadsheet.js
import mongoose from 'mongoose';

const cellSchema = new mongoose.Schema({
  cellId: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    default: '',
  },
  formula: {
    type: String,
    default: '',
  },
}, { _id: false });

const spreadsheetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  cells: [cellSchema],
}, {
  timestamps: true,
});

const Spreadsheet = mongoose.model('Spreadsheet', spreadsheetSchema);
export default Spreadsheet;
