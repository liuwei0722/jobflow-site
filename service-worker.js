self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const message = event.notification.data;
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(async (windows) => {
        const appWindow = windows.find((client) =>
          client.url.startsWith(self.registration.scope),
        );
        if (appWindow) {
          await appWindow.focus();
          appWindow.postMessage(message);
          return;
        }
        await self.clients.openWindow(new URL("./#dashboard", self.registration.scope).href);
      }),
  );
});
