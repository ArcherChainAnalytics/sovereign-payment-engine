import express, { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16"
});

// Create a checkout session (one-time or subscription)
router.post("/checkout", async (req: Request, res: Response) => {
  try {
    const { line_items, mode, success_url, cancel_url } = req.body;

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode,
      success_url,
      cancel_url
    });

    res.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create a payment link
router.post("/payment-link", async (req: Request, res: Response) => {
  try {
    const { price_id } = req.body;

    const link = await stripe.paymentLinks.create({
      line_items: [{ price: price_id, quantity: 1 }]
    });

    res.json({ url: link.url });
  } catch (err: any) {
    console.error("Payment link error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create a customer
router.post("/customer", async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    const customer = await stripe.customers.create({
      email,
      name
    });

    res.json(customer);
  } catch (err: any) {
    console.error("Customer creation error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create an invoice
router.post("/invoice", async (req: Request, res: Response) => {
  try {
    const { customer_id, price_id } = req.body;

    const invoiceItem = await stripe.invoiceItems.create({
      customer: customer_id,
      price: price_id
    });

    const invoice = await stripe.invoices.create({
      customer: customer_id,
      auto_advance: true
    });

    res.json(invoice);
  } catch (err: any) {
    console.error("Invoice error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create a subscription
router.post("/subscription", async (req: Request, res: Response) => {
  try {
    const { customer_id, price_id } = req.body;

    const subscription = await stripe.subscriptions.create({
      customer: customer_id,
      items: [{ price: price_id }],
      payment_behavior: "default_incomplete",
      expand: ["latest_invoice.payment_intent"]
    });

    res.json(subscription);
  } catch (err: any) {
    console.error("Subscription error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
