import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { VAPI } from "@vapi-ai/server-sdk"; // Server-SDK

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ===== Test-route =====
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ===== Route för AI-receptionist demo =====
app.post("/create-demo", async (req, res) => {
  try {
    const vapiKey = process.env.VAPI_API_KEY;
    if (!vapiKey) {
      return res.status(500).json({ error: "VAPI_API_KEY is not set" });
    }

    const demoData = req.body; // här kommer frontend-data

    // Initiera VAPI med din private API-nyckel
    const vapiClient = new VAPI({ apiKey: vapiKey });

    // Skapa temporär AI-receptionist (1-minuts demo)
    const demo = await vapiClient.createAssistant({
      ...demoData,
      demo_duration: 60 // 1 minut
    });

    return res.json({
      message: "Temporär AI-receptionist skapad!",
      demo
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Något gick fel på servern" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
