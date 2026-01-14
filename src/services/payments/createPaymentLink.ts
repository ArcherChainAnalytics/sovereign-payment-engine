import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16"
});

export async function createPaymentLink(price_id: string) {
  const link = await stripe.paymentLinks.create({
    line_items: [{ price: price_id, quantity: 1 }]
  });

  return link;
}
