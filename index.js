import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { createAssistant } from "vapi"; // Byt mot riktig import från VAPI

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: "*" })); // Tillåt alla domäner, kan begränsas senare

app.post("/create-demo", async (req, res) => {
  try {
    const { receptionist_name, voice, business_type, business_type_other, opening_hours, additional_info, email } = req.body;

    if (!receptionist_name || !voice || !business_type || !email) {
      return res.status(400).json({ error: "Obligatoriska fält saknas." });
    }

    const businessName = business_type === "Annan" && business_type_other
      ? business_type_other
      : business_type;

    const greeting = `Hej och välkommen till ${businessName}. Jag heter ${receptionist_name} och är vår AI-receptionist. Hur kan jag hjälpa dig idag?`;

    const assistant = await createAssistant({
      name: receptionist_name,
      voice,
      greeting,
      business_type: businessName,
      opening_hours,
      additional_info,
      demo_duration: 60
    });

    res.json({ demo_url: assistant.demo_url, demo_id: assistant.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Kunde inte skapa AI-receptionist." });
  }
});

export default app;
X