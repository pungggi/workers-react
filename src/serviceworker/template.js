import workbox from "workbox";

workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.routing.registerRoute(
  new RegExp("https://reservation.page"),
  new workbox.strategies.StaleWhileRevalidate()
);

workbox.precaching.precacheAndRoute(self.__precacheManifest);

self.addEventListener("push", event => {
  const title = "Get Started With Workbox";
  const options = {
    body: event.data.text()
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
