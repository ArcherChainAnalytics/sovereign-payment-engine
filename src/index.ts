import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Sovereign Payment Engine running" });
});

// Placeholder routes (we will fill these in file-by-file)
app.use("/webhooks", require("./listeners/stripe-webhooks").default);
app.use("/payments", require("./routes/payments").default);
app.use("/pos", require("./routes/pos").default);
app.use("/whatsapp", require("./routes/whatsapp").default);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Sovereign Payment Engine listening on port ${PORT}`);
});
