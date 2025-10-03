import { NextFunction } from 'express';
import { Request, Response } from 'express';

export class OrderController {
  create = async (req: Request, res: Response, next: NextFunction) => {
    return res.json({ success: true });
  };
}
