import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { globalErrorHandler } from './common/middleware/globalMiddleware';
import customerRouter from './customers/customerRouter';
import couponRouter from './coupon/couponRouter';
import orderRouter from './order/orderRouter';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from order service service!' });
});

app.use('/customers', customerRouter);
app.use('/coupon', couponRouter);
app.use('/order', orderRouter);

app.use(globalErrorHandler);

export default app;
