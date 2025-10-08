import { Request, Response } from 'express';
import couponModel from './couponModel';
import createHttpError from 'http-errors';

export class CouponController {
  create = async (req: Request, res: Response) => {
    const { title, code, validUpto, discount, tenantId } = req.body;
    const { role, tenant } = (req as any).auth;

    // Authorization
    if (role === 'manager' && Number(tenant) !== Number(tenantId)) {
      throw createHttpError(
        403,
        'Managers can only create coupons for their own tenant',
      );
    }

    const coupon = await couponModel.create({
      title,
      code,
      discount,
      validUpto,
      tenantId,
    });

    res.status(201).json({
      code: 201,
      status: 'success',
      message: 'Coupon created successfully',
      data: { couponDto: coupon },
      error: false,
    });
  };

  // todo: Complete CRUD assignment. This will be used in dashboard.
  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, code, validUpto, discount, tenantId } = req.body;
    const { role, tenant } = (req as any).auth;

    const coupon = await couponModel.findById(id);
    if (!coupon) throw createHttpError(404, 'Coupon not found');

    // Authorization
    if (role === 'manager' && Number(tenant) !== coupon.tenantId) {
      throw createHttpError(
        403,
        'Managers can only update coupons for their own tenant',
      );
    }

    coupon.title = title ?? coupon.title;
    coupon.code = code ?? coupon.code;
    coupon.validUpto = validUpto ?? coupon.validUpto;
    coupon.discount = discount ?? coupon.discount;
    coupon.tenantId = tenantId ?? coupon.tenantId;

    await coupon.save();

    res.json({
      code: 200,
      status: 'success',
      message: 'Coupon updated successfully',
      data: { couponDto: coupon },
      error: false,
    });
  };

  // 🔹 Get List
  list = async (req: Request, res: Response) => {
    const { role, tenant } = (req as any).auth;
    let coupons;

    if (role === 'admin') {
      coupons = await couponModel.find({});
    } else if (role === 'manager') {
      coupons = await couponModel.find({ tenantId: tenant });
    }

    res.json({
      code: 200,
      status: 'success',
      message: 'Coupons fetched successfully',
      data: { couponDto: coupons },
      error: false,
    });
  };

  // 🔹 Delete Coupon
  delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role, tenant } = (req as any).auth;

    const coupon = await couponModel.findById(id);
    if (!coupon) throw createHttpError(404, 'Coupon not found');

    // Authorization
    if (role === 'manager' && Number(tenant) !== coupon.tenantId) {
      throw createHttpError(
        403,
        'Managers can only delete coupons for their own tenant',
      );
    }

    await coupon.deleteOne();

    res.json({
      code: 200,
      status: 'success',
      message: 'Coupon deleted successfully',
      data: { couponDto: coupon },
      error: false,
    });
  };

  verify = async (req: Request, res: Response) => {
    const { code, tenantId } = req.body;

    if (!code || !tenantId) {
      throw createHttpError(400, 'invalid coupon');
    }

    const coupon = await couponModel.findOne({ code, tenantId });
    if (!coupon) {
      throw createHttpError(400, 'Coupon does not exist');
    }

    const currentDate = new Date();
    const couponDate = new Date(coupon.validUpto);

    if (currentDate <= couponDate) {
      return res.json({
        valid: true,
        discount: coupon.discount,
        message: 'Applied',
      });
    }

    return res.json({ valid: false, discount: 0, message: 'invalid coupon' });
  };
}
