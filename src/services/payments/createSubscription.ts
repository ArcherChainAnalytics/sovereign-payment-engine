import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16"
});

export async function createSubscription(params: {
  customer_id: string;
  price_id: string;
}) {
  const subscription = await stripe.subscriptions.create({
    customer: params.customer_id,
    items: [{ price: params.price_id }],
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"]
  });

  return subscription;
}
