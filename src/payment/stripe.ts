import Stripe from 'stripe';
import {
  CustomMetadata,
  PaymentGW,
  PaymentOptions,
  VerifiedSession,
} from './paymentTypes';
import { configENV } from '../config/config';

export class StripeGW implements PaymentGW {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(configENV.stripeSecretKey);
  }

  async createSession(options: PaymentOptions) {
    const session = await this.stripe.checkout.sessions.create(
      {
        // todo: get customer email from database
        // customer_email: options.email
        metadata: {
          orderId: options.orderId,
          restaurantId: options.tenantId,
        },
        billing_address_collection: 'required',
        // todo: In Future, Capture structured address from customer
        // 1
        // payment_intent_data: {
        //   shipping: {
        //     name: 'John Doe',
        //     address: {
        //       line1: '123 Maple Street',
        //       line2: 'Apt 4B, Springfield, IL 62704',
        //       city: 'New York',
        //       country: 'US',
        //       postal_code: '10001',
        //     },
        //   },
        // },
        line_items: [
          {
            price_data: {
              unit_amount: options.amount * 100, // converting indian rupees
              // unit_amount: options.amount,
              product_data: {
                name: 'Online Pizza order',
                description: 'Total amount to be paid',
                images: ['https://placehold.jp/150x150.png'],
              },
              currency: options.currency || 'inr',
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${configENV.clientUI}/payment?success=true&orderId=${options.orderId}&restaurantId=${options.tenantId}`,
        cancel_url: `${configENV.clientUI}/payment?success=false&orderId=${options.orderId}&restaurantId=${options.tenantId}`,
      },
      { idempotencyKey: options?.idempotenencyKey ?? '' },
    );

    return {
      id: session.id,
      paymentUrl: session.url ?? '', // Ensure paymentUrl is always a string
      paymentStatus: session.payment_status,
    };
  }

  async getSession(id: string) {
    const session = await this.stripe.checkout.sessions.retrieve(id);

    const verifiedSession: VerifiedSession = {
      id: session.id,
      paymentStatus: session.payment_status,
      metadata: session.metadata as unknown as CustomMetadata,
    };

    return verifiedSession;
  }
}
