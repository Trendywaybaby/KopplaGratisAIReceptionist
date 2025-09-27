import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { VAPI } from "@vapi-ai/server-sdk";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Test-route
app.get("/", (req, res) => res.send("Server is running"));

// /create-demo route med VAPI
app.post("/create-demo", async (req, res) => {
  try {
    const demoData = req.body || {};

    // Kontrollera obligatoriska fält
    if (!demoData.receptionist_name || !demoData.business_type) {
      return res.status(400).json({ error: "Namn och verksamhetstyp krävs" });
    }

    // Hälsning
    const businessName =
      demoData.business_type === "Annan" && demoData.business_type_other
        ? demoData.business_type_other
        : demoData.business_type;

    const greeting = `Hej och välkommen till ${businessName}. Jag heter ${demoData.receptionist_name} och är vår AI-receptionist. Hur kan jag hjälpa dig idag?`;

    // VAPI-nyckel från miljövariabler
    const vapiKey = process.env.VAPI_API_KEY;
    if (!vapiKey) {
      return res
        .status(500)
        .json({ error: "VAPI_API_KEY saknas i miljövariabler" });
    }

    // Initiera VAPI-klient
    const vapiClient = new VAPI({ apiKey: vapiKey });

    // Skapa temporär AI-receptionist på 1 minut
    const demo = await vapiClient.createAssistant({
      name: demoData.receptionist_name,
      greeting,
      business_type: businessName,
      opening_hours: demoData.opening_hours || {},
      additional_info: demoData.additional_info || "",
      voice: demoData.voice || "default",
      demo_duration: 60, // 1 minut
    });

    // Returnera info till frontend
    return res.json({
      message: "Temporär AI-receptionist skapad!",
      demo,
    });
  } catch (error) {
    console.error("Error in /create-demo:", error);
    return res.status(500).json({ error: "Något gick fel på servern" });
  }
});

app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);
