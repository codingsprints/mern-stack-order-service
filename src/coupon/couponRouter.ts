import express from 'express';
import authenticate from '../common/middleware/authenticate';
import { CouponController } from './couponController';
import { asyncWrapper } from '../common/utils/wrapper';

const router = express.Router();
const couponController = new CouponController();
// CRUD
router.post('/', authenticate, asyncWrapper(couponController.create));
router.put('/:id', authenticate, asyncWrapper(couponController.update));
router.get('/', authenticate, asyncWrapper(couponController.list));
router.delete('/:id', authenticate, asyncWrapper(couponController.delete));

// Verify
router.post('/verify', authenticate, asyncWrapper(couponController.verify));

export default router;
