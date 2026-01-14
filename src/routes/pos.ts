import express, { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16"
});

// Create a Terminal reader (for Tap to Pay or physical readers)
router.post("/create-reader", async (req: Request, res: Response) => {
  try {
    const { label, registration_code } = req.body;

    const reader = await stripe.terminal.readers.create({
      label,
      registration_code
    });

    res.json(reader);
  } catch (err: any) {
    console.error("Reader creation error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Process a Tap-to-Pay or Terminal charge
router.post("/charge", async (req: Request, res: Response) => {
  try {
    const { amount, currency, description } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
      payment_method_types: ["card_present"]
    });

    res.json(paymentIntent);
  } catch (err: any) {
    console.error("POS charge error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Generate a QR code payment link
router.post("/qr", async (req: Request, res: Response) => {
  try {
    const { price_id } = req.body;

    const link = await stripe.paymentLinks.create({
      line_items: [{ price: price_id, quantity: 1 }]
    });

    res.json({ url: link.url });
  } catch (err: any) {
    console.error("QR payment error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
