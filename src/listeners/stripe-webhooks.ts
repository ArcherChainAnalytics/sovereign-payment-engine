import express, { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16"
});

// Stripe requires raw body for signature verification
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err: any) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Normalize events into internal event model
    switch (event.type) {
      case "payment_intent.succeeded":
        console.log("Payment succeeded:", event.data.object);
        break;

      case "payment_intent.payment_failed":
        console.log("Payment failed:", event.data.object);
        break;

      case "checkout.session.completed":
        console.log("Checkout session completed:", event.data.object);
        break;

      case "customer.created":
        console.log("Customer created:", event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);

export default router;
