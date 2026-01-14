import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16"
});

export async function createInvoice(params: {
  customer_id: string;
  price_id: string;
}) {
  // Add invoice item
  await stripe.invoiceItems.create({
    customer: params.customer_id,
    price: params.price_id
  });

  // Create the invoice
  const invoice = await stripe.invoices.create({
    customer: params.customer_id,
    auto_advance: true
  });

  return invoice;
}

