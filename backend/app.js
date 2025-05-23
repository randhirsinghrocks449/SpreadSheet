import express from 'express';
import cors from 'cors';
import { errorHandler } from './helper/error.js';
import authRoutes from './routes/auth.routes.js';
import spreadSheetRoutes from './routes/spreadsheet.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send({ msg: "Server is Running" });
});
app.use('/api/auth', authRoutes);
app.use('/api/spreadSheet', spreadSheetRoutes)
app.use(errorHandler);

export default app;
