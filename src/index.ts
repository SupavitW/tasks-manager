import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import * as dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan('short'));
app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors({
    credentials: true
}));

const mongoURL = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@restapi.vn0x7.mongodb.net/task_management?retryWrites=true&w=majority&appName=RESTAPI`;
mongoose.Promise = Promise;
mongoose.connect(mongoURL);

mongoose.connection.on('error', (error: Error) => {
    console.log(error);
})

//Router
import router from './router';
app.use('/', router());

// Middleware for error handling
const errorHandler = (err: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    console.log(`Error ${status}: ${message}`);
    console.log(err.stack);

    res.status(status).json({ "Error": message });
};

app.use(errorHandler);

const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`The server is running on ${PORT}`);
});

export default server;
