import express from 'express';
import authenticate from '../common/middleware/authenticate';
import { OrderController } from './orderController';
import { createMessageBroker } from '../common/factories/brokerFactory';
import { asyncWrapper } from '../common/utils/wrapper';
const router = express.Router();

const orderController = new OrderController();

router.post('/', authenticate, asyncWrapper(orderController.create));
// router.get("/", authenticate, asyncWrapper(orderController.getAll));
// router.get("/mine", authenticate, asyncWrapper(orderController.getMine));
// router.get("/:orderId", authenticate, asyncWrapper(orderController.getSingle));
// router.patch(
//   "/change-status/:orderId",
//   authenticate,
//   asyncWrapper(orderController.changeStatus),
// );

export default router;
