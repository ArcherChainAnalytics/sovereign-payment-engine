import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16"
});

export async function createCustomer(params: {
  email: string;
  name?: string;
}) {
  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name
  });

  return customer;
}
