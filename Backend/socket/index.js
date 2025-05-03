import { handleCellUpdate } from "../utils/socket.utils.js";

export const socketHandler = (io) => {
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on('cellUpdated', (data) => {
            handleCellUpdate(socket, data, io);
        });
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};
