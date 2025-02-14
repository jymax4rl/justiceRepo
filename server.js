const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // ✅ Enables Cross-Origin Requests if needed

const app = express();
const PORT = 3000;

// ✅ Middleware to parse JSON requests
app.use(bodyParser.json());

// ✅ Allow Cross-Origin Requests (for debugging/testing)
app.use(cors());

// ✅ Webhook Endpoint to Receive Location Data
app.post("/location-webhook", (req, res) => {
    const { latitude, longitude, timestamp } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).send({ success: false, message: "Invalid location data" });
    }

    console.log(`📍 Received location: Latitude ${latitude}, Longitude ${longitude} at ${timestamp || new Date().toISOString()}`);

    // ✅ Store location in a database (optional)
    // You can save it in MongoDB, PostgreSQL, or any database you prefer.

    res.status(200).send({ success: true, message: "Location received" });
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`🚀 Webhook server running on http://localhost:${PORT}`);
});
