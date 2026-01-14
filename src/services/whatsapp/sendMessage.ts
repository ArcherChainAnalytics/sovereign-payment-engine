import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const WHATSAPP_URL = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

export async function sendMessage(to: string, text: string) {
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
