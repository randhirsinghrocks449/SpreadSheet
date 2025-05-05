import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import { PORT as SERVERPORT } from './config/env.js';
import { socketHandler } from './socket/index.js';
import { Server } from 'socket.io';
import { setIO } from './helper/socket.js';

const PORT = SERVERPORT || 3001;

const handleError = (error) => {
  console.error('Error occurred:', error);
  process.exit(1);
};

const connectDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
  } catch (error) {
    handleError(error);
  }
};

const startServer = () => {
  try {
    const server = http.createServer(app);
    const io = new Server(server, {});
    socketHandler(io)
    setIO(io);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    process.on('unhandledRejection', (error) => {
      console.error('Unhandled Promise Rejection:', error);
      handleError(error);
    });
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      handleError(error);
    });
  } catch (error) {
    handleError(error);
  }
};

const init = async () => {
  await connectDatabase();
  startServer();
};

init();
