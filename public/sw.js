let ignore = { image: 1, audio: 1, video: 1, style: 1, font: 1, script: 1 };

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("fetch", e => {
    let { request, clientId } = e;
    let { destination } = request;
    if (!clientId || ignore[destination]) return;
    e.waitUntil(
        self.clients.get(clientId).then(client =>
            client?.postMessage({
                fetchUrl: request.url,
                dest: destination,
                isNextRouterPrefetch: request.headers.get("Next-Router-Prefetch") || request.headers.get("next-router-prefetch"),
                method: request.method
            }),
        ),
    );
});

