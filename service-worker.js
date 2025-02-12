const API_BASE_URL = "http://localhost:4000"; // Ensure this matches your server port

self.addEventListener("sync", function(event) {
    if (event.tag === "syncLocation") {
        event.waitUntil(fetchBackgroundLocation());
    }
});

async function fetchBackgroundLocation() {
    try {
        console.log("📡 Fetching background location...");
        const response = await fetch(`${API_BASE_URL}/get-latest-location`, {
            method: "GET",
            headers: { "Accept": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`❌ HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("📍 Background location received:", data);

        if (data.latitude !== undefined && data.longitude !== undefined) {
            let payload = {
                title: "Background Location Update",
                description: `📍 **Lat:** ${data.latitude}, **Lon:** ${data.longitude}\n🔗 [Google Maps](https://www.google.com/maps/place/${data.latitude},${data.longitude})`
            };

            await fetch(`${API_BASE_URL}/send-location`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            console.log("✅ Background location sent to Discord!");
        } else {
            console.warn("⚠️ No valid location data found.");
        }
    } catch (error) {
        console.error("🚨 Failed to fetch background location:", error);
    }
}
