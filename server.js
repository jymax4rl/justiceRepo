const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1337946103924133898/eudcofLWR_ryLQivFc1hgFf2v01Fy9RSIQJxd5G1Qo5VGeyWOtVKR5E-t-mr-XddLL1X";

app.post("/send-location", async (req, res) => {
    try {
        const { title, description } = req.body;

        const payload = {
            username: "📍 Location Tracker",
            embeds: [
                {
                    title: title,
                    description: description,
                    color: 3066993, // Green color
                    footer: { text: `Updated at ${new Date().toLocaleTimeString()}` }
                }
            ]
        };

        await axios.post(DISCORD_WEBHOOK_URL, payload);
        res.status(200).json({ message: "✅ Location sent to Discord!" });

    } catch (error) {
        console.error("🚨 Error sending data to Discord:", error);
        res.status(500).json({ error: "Failed to send location to Discord" });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
