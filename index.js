import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Test-route
app.get("/", (req, res) => res.send("Server is running"));

// Säker POST-route för /create-demo
app.post("/create-demo", (req, res) => {
  try {
    const demoData = req.body || {};

    // Kontrollera obligatoriska fält
    if (!demoData.receptionist_name || !demoData.business_type) {
      return res.status(400).json({ error: "Namn och verksamhetstyp krävs" });
    }

    // Skapa en hälsningssträng (dummy för test)
    const greeting = `Hej och välkommen till ${demoData.business_type}. Jag heter ${demoData.receptionist_name} och är vår AI-receptionist. Hur kan jag hjälpa dig idag?`;

    // Returnera data till frontend
    return res.json({
      message: "Backend tar emot data korrekt!",
      greeting,
      demoData
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Något gick fel på servern" });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
