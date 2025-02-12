// self.addEventListener("message", function (event) {
//     if (event.data === "startTracking") {
//         if (navigator.geolocation) {
//             navigator.geolocation.watchPosition(sendPosition, showError, {
//                 enableHighAccuracy: true,
//                 timeout: 300,
//                 maximumAge: 0
//             });
//         } else {
//             postMessage({ error: "Geolocation not supported" });
//         }
//     }
// });

// function sendPosition(position) {
//     let latitude = position.coords.latitude;
//     let longitude = position.coords.longitude;
//     let timestamp = new Date().toLocaleTimeString();

//     postMessage({ latitude, longitude, timestamp });

//     console.log(`📡 Sending location: ${latitude}, ${longitude} at ${timestamp}`);

//     // ✅ Send location updates to the backend every 5 seconds
//     fetch("http://localhost:4000/store-location", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ latitude, longitude })
//     })
//     .then(response => response.json())
//     .then(data => console.log("✅ Location stored:", data))
//     .catch(error => console.error("🚨 Error storing location:", error));
    
// }
