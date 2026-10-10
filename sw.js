self.addEventListener("install", e => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("push", event => {
  let data = { title: "ShelfSignal", body: "Price update" };
  try { if (event.data) data = { ...data, ...event.data.json() }; } catch (e) {}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      data: data.url || "./"
    })
  );
});

self.addEventListener("message", event => {
  const d = event.data || {};
  if (d.type === "demo") {
    self.registration.showNotification(d.title || "ShelfSignal", {
      body: d.body || "Background notification",
      data: "./"
    });
  }
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      if (list.length) return list[0].focus();
      return self.clients.openWindow(event.notification.data || "./");
    })
  );
});
