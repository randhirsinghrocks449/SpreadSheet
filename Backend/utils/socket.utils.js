// sockets/handlers.js

import { updateCellValue } from "../utils/spreadSheet.utils.js";

export const handleCellUpdate = async (socket, data) => {
  try {
    const updateResult = await updateCellValue(data);

    // Broadcast to others and echo back to sender
    socket.broadcast.emit('cellUpdated', updateResult);
  } catch (error) {
    console.error('Error handling cell update:', error);
    socket.emit('error', { message: error.message || 'Internal Error' });
  }
};
