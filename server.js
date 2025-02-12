const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors({ origin: "*", methods: "GET, POST, OPTIONS" }));
app.use(express.json());

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1337946103924133898/eudcofLWR_ryLQivFc1hgFf2v01Fy9RSIQJxd5G1Qo5VGeyWOtVKR5E-t-mr-XddLL1X"; // Your webhook

let latestLocation = { latitude: null, longitude: null };

// ✅ Store location (fix issue where location is not stored)
app.post("/store-location", (req, res) => {
    const { latitude, longitude } = req.body;
    if (latitude !== undefined && longitude !== undefined) {
        latestLocation = { latitude, longitude };
        console.log("✅ Stored latest location:", latestLocation);
        return res.status(200).json({ message: "✅ Location stored successfully!" });
    } else {
        console.error("🚨 Received invalid location data:", req.body);
        return res.status(400).json({ error: "❌ Invalid location data" });
    }
});

// ✅ Get latest location (fix issue where null values persist)
app.get("/get-latest-location", (req, res) => {
    console.log("📡 Sending latest location:", latestLocation);
    res.json(latestLocation);
});

// ✅ Send location updates to Discord
app.post("/send-location", async (req, res) => {
    try {
        const { title, description } = req.body;

        const payload = {
            username: "📍 Location Tracker",
            embeds: [
                {
                    title: title,
                    description: description,
                    color: 3066993,
                    footer: { text: `Updated at ${new Date().toLocaleTimeString()}` }
                }
            ]
        };

        await axios.post(DISCORD_WEBHOOK_URL, payload);
        res.status(200).json({ message: "✅ Location sent to Discord!" });

    } catch (error) {
        console.error("🚨 Error sending data to Discord:", error);
        res.status(500).json({ error: "❌ Failed to send location to Discord" });
    }
});

// ✅ Start server on port 4000
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
