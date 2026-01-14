import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16"
});

export async function createCheckoutSession(params: {
  line_items: Array<{ price: string; quantity: number }>;
  mode: "payment" | "subscription";
  success_url: string;
  cancel_url: string;
}) {
  const session = await stripe.checkout.sessions.create({
    line_items: params.line_items,
    mode: params.mode,
    success_url: params.success_url,
    cancel_url: params.cancel_url
  });

  return session;
}A
