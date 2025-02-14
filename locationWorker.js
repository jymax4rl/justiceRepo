self.addEventListener("message", (event) => {
    if (event.data.action === "startTracking") {
        trackLocation();
    }
});

// ✅ Function to Track & Store Location in IndexedDB
function trackLocation() {
    if (!navigator.geolocation) {
        console.error("❌ Geolocation is not supported in this browser.");
        return;
    }

    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            const timestamp = new Date().toISOString();
            
            console.log(`📍 Location updated: ${latitude}, ${longitude} at ${timestamp}`);

            // ✅ Save location in IndexedDB so Service Worker can send it later
            saveLocationToDB(latitude, longitude, timestamp);
        },
        (error) => console.error("🚨 Geolocation error:", error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
}

// ✅ Save the Last Location in IndexedDB
function saveLocationToDB(latitude, longitude, timestamp) {
    const request = indexedDB.open("LocationDB", 2);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("locations")) {
            db.createObjectStore("locations", { keyPath: "id" });
        }
    };

    request.onsuccess = function (event) {
        const db = request.result;
        const transaction = db.transaction("locations", "readwrite");
        const store = transaction.objectStore("locations");
        store.put({ id: "latest", latitude, longitude, timestamp });
    };

    request.onerror = function () {
        console.error("❌ Failed to open IndexedDB.");
    };
}
