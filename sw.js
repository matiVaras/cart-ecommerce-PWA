// red first, para poder interactuar con la API de productos
const networkFirst = (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return caches.open(currentCache).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        })
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
};

const Margarita = "Margarita Margarol";
const assets = [
  "/assets/icon.png",
  "/assets/logo-blanco.png",
  "index.html",
  "/pag/producto.html",
  "/js/index.js",
  "/styles/estilos.css"
];

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
      caches.open(Margarita).then(cache => {
        cache.addAll(assets)
      })
    )
  })

  self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })

