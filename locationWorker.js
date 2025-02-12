self.addEventListener("sync", function (event) {
    if (event.tag === "syncLocation") {
        event.waitUntil(fetchBackgroundLocation());
    }
});

async function fetchBackgroundLocation() {
    try {
        console.log("📡 Fetching background location...");
        const response = await fetch("http://localhost:4000/get-latest-location");

        if (!response.ok) {
            throw new Error(`❌ HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("📍 Background location received:", data);

        if (data.latitude && data.longitude) {
            let payload = {
                title: "Background Location Update",
                description: `📍 **Lat:** ${data.latitude}, **Lon:** ${data.longitude}\n🔗 [Google Maps](https://www.google.com/maps/place/${data.latitude},${data.longitude})`
            };

            await fetch("http://localhost:4000/send-location", {
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