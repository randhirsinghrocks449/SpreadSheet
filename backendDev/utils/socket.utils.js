import { updateCellValue } from "./spreadsheet.utils.js";

export const handleCellUpdate = async (socket, data) => {
  try {
    const updateResult = await updateCellValue(data);
    
    socket.broadcast.emit('cellUpdated', updateResult);
  } catch (error) {
    console.error('Error handling cell update:', error);
    socket.emit('error', { message: error.message || 'Internal Error' });
  }
};
