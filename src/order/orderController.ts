import { NextFunction } from 'express';
import { Request, Response } from 'express';
import productCacheModel from '../common/cache/productCache/productCacheModel';
import {
  CartItem,
  ProductPricingCache,
  Topping,
  ToppingPriceCache,
} from '../common/types';
import toppingCacheModel from '../common/cache/toppingCache/toppingCacheModel';
import couponModel from '../coupon/couponModel';
import orderModel from './orderModel';
import { DELIVERY_CHARGES, TAXES_PERCENT } from '../common/constants/constants';
import { OrderStatus, PaymentStatus } from './orderTypes';

export class OrderController {
  private getCurrentToppingPrice = (
    topping: Topping,
    toppingPricings: ToppingPriceCache[],
  ) => {
    const currentTopping = toppingPricings.find(
      (current) => topping.id === current.toppingId,
    );

    if (!currentTopping) {
      // todo: Make sure the item is in the cache else, maybe call catalog service.
      return topping.price;
    }

    return currentTopping.price;
  };
  private getItemTotal = (
    item: CartItem,
    cachedProductPrice: ProductPricingCache,
    toppingsPricings: ToppingPriceCache[],
  ) => {
    const toppingsTotal = item.chosenConfiguration.selectedToppings.reduce(
      (acc, curr) => {
        return acc + this.getCurrentToppingPrice(curr, toppingsPricings);
      },
      0,
    );

    const productTotal = Object.entries(
      item.chosenConfiguration.priceConfiguration,
    ).reduce((acc, [key, value]) => {
      const price =
        cachedProductPrice?.priceConfiguration[key]?.availableOptions[value];
      return acc + price!;
    }, 0);

    return productTotal + toppingsTotal;
  };

  private calculateTotal = async (cart: CartItem[]) => {
    const productIds = cart.map((item) => item._id);

    console.log('productIds', productIds);

    // todo: proper error handling..
    const productPricings = await productCacheModel.find({
      productId: {
        $in: productIds,
      },
    });

    // todo: What will happen if product does not exists in the cache
    // 1. call catalog service.
    // 2. Use price from cart <- BAD

    console.log('productPricings ->', productPricings);

    const cartToppingIds = cart.reduce<string[]>((acc, item) => {
      return [
        ...acc,
        ...item.chosenConfiguration.selectedToppings.map(
          (topping) => topping.id,
        ),
      ];
    }, []);

    console.log('cartToppingIds =>', cartToppingIds);

    // // todo: What will happen if topping does not exists in the cache
    const toppingPricings = await toppingCacheModel.find({
      toppingId: {
        $in: cartToppingIds,
      },
    });

    console.log('toppingPricings', toppingPricings);

    const totalPrice = cart.reduce((acc, curr) => {
      const cachedProductPrice = productPricings.find(
        (product) => product.productId === curr._id,
      );

      console.log(
        'this.getItemTotal(curr, cachedProductPrice!, toppingPricings)',
        this.getItemTotal(curr, cachedProductPrice!, toppingPricings),
      );

      return (
        acc +
        curr.qty * this.getItemTotal(curr, cachedProductPrice!, toppingPricings)
      );
    }, 0);

    console.log('totalPrice', totalPrice);

    return totalPrice;
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    const {
      cart,
      couponCode,
      tenantId,
      paymentMode,
      customerId,
      comment,
      address,
    } = req.body;
    // todo: validate request data.

    const totalPrice = await this.calculateTotal(req?.body?.cart);

    console.log('totalPrice --------------------', totalPrice);

    let discountPercentage = 0;

    if (couponCode) {
      discountPercentage = await this.getDiscountPercentage(
        couponCode,
        tenantId,
      );
    }

    const discountAmount = Math.round((totalPrice * discountPercentage) / 100);

    const priceAfterDiscount = totalPrice - discountAmount;

    const taxes = Math.round((priceAfterDiscount * TAXES_PERCENT) / 100);

    const finalTotal = priceAfterDiscount + taxes + DELIVERY_CHARGES;

    //create order
    const newOrder = await orderModel.create([
      {
        cart,
        address,
        comment,
        customerId,
        deliveryCharges: DELIVERY_CHARGES,
        discount: discountAmount,
        taxes,
        tenantId,
        total: finalTotal,
        paymentMode,
        orderStatus: OrderStatus.RECEIVED,
        paymentStatus: PaymentStatus.PENDING,
        totalPrice,
        discountAmount,
        priceAfterDiscount,
        finalTotal,
      },
    ]);

    // return res.json({
    //   success: true,
    //   totalPrice: totalPrice,
    //   discountAmount,
    //   priceAfterDiscount,
    //   taxes,
    //   finalTotal,
    // });

    res.json({
      code: 200,
      status: 'success',
      message: 'create orders successfully!!',
      data: { orderDto: newOrder },
      error: false,
    });
  };

  private getDiscountPercentage = async (
    couponCode: string,
    tenantId: string,
  ) => {
    const code = await couponModel.findOne({ code: couponCode, tenantId });

    if (!code) {
      return 0;
    }

    const currentDate = new Date();
    const couponDate = new Date(code.validUpto);

    if (currentDate <= couponDate) {
      return code.discount;
    }

    return 0;
  };
}
