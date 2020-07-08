importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js"
);

if (workbox) console.log(`Workbox berhasil dimuat`);
else console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute([
  { url: "./index.html", revision: "1" },
  { url: "./article.html", revision: "1" },
  { url: "./manifest.json", revision: "1" },
  { url: "./nav.html", revision: "1" },
  { url: "./index.js", revision: "1" },
  { url: "./article.js", revision: "1" },
  { url: "./css/materialize.min.css", revision: "1" },
  { url: "./css/style.css", revision: "1" },
  { url: "./js/materialize.min.js", revision: "1" },
  { url: "./js/api.js", revision: "1" },
  { url: "./js/db.js", revision: "1" },
  { url: "./js/idb.js", revision: "1" },
  { url: "./js/myarticle.js", revision: "1" },
  { url: "./js/myindex.js", revision: "1" },
  { url: "./js/script.js", revision: "1" },
], {
 ignoreUrlParametersMatching: [/.*/]
});


workbox.routing.registerRoute(
  new RegExp("/pages/"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "pages",
  })
);

workbox.routing.registerRoute(
  new RegExp("/article"),
  workbox.strategies.staleWhileRevalidate({
    cacheName: "article",
  })
);

workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: "images",
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 90,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  /^https:\/\/cdnjs\.cloudflare\.com/,
  workbox.strategies.cacheFirst({
    cacheName: "font-awesome",
  })
);

workbox.routing.registerRoute(
  /^https:\/\/api\.football-data\.org/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: "football-api",
  })
);

self.addEventListener("push", function (event) {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = "Push message no payload";
  }
  const options = {
    body: body,
    icon: "/src/assets/images/icons/icon192x192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  event.waitUntil(
    self.registration.showNotification("Push Notification", options)
  );
});
