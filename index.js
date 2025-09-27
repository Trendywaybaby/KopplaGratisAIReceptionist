import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// ===== Test-route =====
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ===== Exempel på POST-route =====
app.post("/create-demo", (req, res) => {
  try {
    const demoData = req.body || {};
    // Vi returnerar bara data direkt utan VAPI
    return res.json({
      message: "Backend tar emot data korrekt!",
      demoData
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Något gick fel på servern" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
