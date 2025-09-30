import { Response } from 'express';
import { Request } from 'express-jwt';
import customerModel from './customerModel';
import logger from '../config/logger';

export class CustomerController {
  getCustomer = async (req: Request, res: Response) => {
    if (req.auth) {
      // todo: add these fields to jwt in auth service.
      const { sub: userId, firstName, lastName, email } = req.auth;
      console.log('auth:', req.auth);

      // todo: implement service layer.
      const customer = await customerModel.findOne({ userId });

      if (!customer) {
        const newCustomer = await customerModel.create({
          userId,
          firstName,
          lastName,
          email,
          addresses: [],
        });

        logger.info('fetch product successfully!!', newCustomer?._id);
        res.json({
          code: 200,
          status: 'success',
          message: 'fetch product successfully!!',
          data: {
            customerDto: newCustomer,
          },
          error: false,
        });
      }
    }
  };

  addAddress = async (req: Request, res: Response) => {
    if (req.auth) {
      const { sub: userId } = req.auth;

      // todo: add service layer.
      const customer = await customerModel.findOneAndUpdate(
        {
          _id: req.params.id,
          userId,
        },
        {
          $push: {
            addresses: {
              text: req.body.address,
              // todo: implement isDefault field in future.
              isDefault: false,
            },
          },
        },
        { new: true },
      );

      // todo: add logging
      return res.json(customer);
    }
  };
}
