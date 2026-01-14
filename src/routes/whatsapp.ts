import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16"
});

// WhatsApp API base URL
const WHATSAPP_URL = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

// Send WhatsApp message
async function sendWhatsAppMessage(to: string, text: string) {
  await axios.post(
    WHATSAPP_URL,
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
}

// Incoming webhook from WhatsApp
router.post("/incoming", async (req: Request, res: Response) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (!message) {
      return res.json({ status: "no message" });
    }

    const from = message.from;
    const text = message.text?.body?.toLowerCase() || "";

    // Simple qualification logic (expand later)
    if (text.includes("hi") || text.includes("hello")) {
      await sendWhatsAppMessage(from, "Hey! What service are you looking for?");
      return res.json({ status: "ok" });
    }

    if (text.includes("price")) {
      await sendWhatsAppMessage(from, "Which offer? Starter, Pro, or Sovereign?");
      return res.json({ status: "ok" });
    }

    // Auto-generate payment link for a known price ID
    if (text.includes("starter")) {
      const link = await stripe.paymentLinks.create({
        line_items: [{ price: process.env.STARTER_PRICE_ID as string, quantity: 1 }]
      });

      await sendWhatsAppMessage(from, `Starter package link: ${link.url}`);
      return res.json({ status: "ok" });
    }

    if (text.includes("pro")) {
      const link = await stripe.paymentLinks.create({
        line_items: [{ price: process.env.PRO_PRICE_ID as string, quantity: 1 }]
      });

      await sendWhatsAppMessage(from, `Pro package link: ${link.url}`);
      return res.json({ status: "ok" });
    }

    if (text.includes("sovereign")) {
      const link = await stripe.paymentLinks.create({
        line_items: [{ price: process.env.SOVEREIGN_PRICE_ID as string, quantity: 1 }]
      });

      await sendWhatsAppMessage(from, `Sovereign package link: ${link.url}`);
      return res.json({ status: "ok" });
    }

    // Default fallback
    await sendWhatsAppMessage(from, "Got it. Tell me more about what you need.");
    res.json({ status: "ok" });

  } catch (err: any) {
    console.error("WhatsApp webhook error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
