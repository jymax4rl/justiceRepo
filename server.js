// 3. Implement a Webhook Server
// Since you want real-time location updates, we need a server that listens for webhook calls. Here’s how to do it:

// Create server.js
// This will be your webhook listener:

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Webhook Endpoint to Receive Location Data
app.post("/location-webhook", (req, res) => {
    const { latitude, longitude, timestamp } = req.body;
    console.log(`Received location: ${latitude}, ${longitude} at ${timestamp}`);

    // Store location in a database (optional)
    res.status(200).send({ success: true, message: "Location received" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Webhook server running on http://localhost:${PORT}`);
});
