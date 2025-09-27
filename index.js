import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { VAPI } from "@vapi-ai/server-sdk";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Server is running"));

app.post("/create-demo", async (req, res) => {
  const demoData = req.body || {};
  
  if (!demoData.receptionist_name || !demoData.business_type) {
    return res.status(400).json({ error: "Namn och verksamhetstyp krävs" });
  }

  const businessName =
    demoData.business_type === "Annan" && demoData.business_type_other
      ? demoData.business_type_other
      : demoData.business_type;

  const greeting = `Hej och välkommen till ${businessName}. Jag heter ${demoData.receptionist_name} och är vår AI-receptionist. Hur kan jag hjälpa dig idag?`;

  // Säker VAPI-integration
  try {
    const vapiKey = process.env.VAPI_API_KEY;
    if (!vapiKey) throw new Error("VAPI_API_KEY saknas i miljövariabler");

    const vapiClient = new VAPI({ apiKey: vapiKey });

    // Skapa temporär assistent
    const demo = await vapiClient.createAssistant({
      name: demoData.receptionist_name,
      greeting,
      business_type: businessName,
      opening_hours: demoData.opening_hours || {},
      additional_info: demoData.additional_info || "",
      voice: demoData.voice || "default",
      demo_duration: 60
    });

    return res.json({ message: "Demo skapad!", demo });

  } catch (error) {
    console.error("VAPI-fel:", error.message || error);
    // Returnera fallback-data istället för att krascha
    return res.json({
      message: "Demo kunde inte skapas via VAPI, fallback-data returneras",
      demoData,
      error: error.message
    });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
