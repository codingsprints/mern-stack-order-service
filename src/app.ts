import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { globalErrorHandler } from './common/middleware/globalMiddleware';
import customerRouter from './customers/customerRouter';
import couponRouter from './coupon/couponRouter';
import orderRouter from './order/orderRouter';
import paymentRouter from './payment/paymentRouter';
import { configENV } from './config/config';

const app = express();

const ALLOWED_DOMAINS = [configENV.adminUI, configENV.clientUI];

app.use(
  cors({
    origin: ALLOWED_DOMAINS as string[],
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
app.use('/orders', orderRouter);
app.use('/payments', paymentRouter);

app.use(globalErrorHandler);

export default app;
