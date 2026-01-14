import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16"
});

export async function processTapToPay(params: {
  amount: number;
  currency: string;
  description?: string;
}) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: params.amount,
    currency: params.currency,
    description: params.description,
    payment_method_types: ["card_present"]
  });

  return paymentIntent;
}
