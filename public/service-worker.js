const CACHE_NAME = "book-tracker-cache-v1";
const URLS_TO_CACHE = [
  "/",
  "/index.html",
  "/style.css",
  "manifest.json",
  "/utils.js",
  "/assets/books/books.json",
  "/assets/books/book.jpg",
  "/assets/img/favicon-96x96.png",
  "/assets/img/favicon.svg",
  "/assets/img/favicon.ico",
  "/assets/img/apple-touch-icon.png",
];

//Service Worker Install
self.addEventListener("install", (event) => {
  console.log("Installing service worker and caching static assets");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching app shell resources...");
      cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Service Workera Activation
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Request interception and serving cache files
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => {
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        })
      );
    })
  );
});

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-books") {
    event.waitUntil(syncBooks());
  }
});

// Adding push notifications
self.addEventListener("push", (event) => {
  const data = event.data.json();

  // Show push notification
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "assets/img/favicon-96x96.png",
  });
});

async function syncBooks() {
  console.log("Syncing books with server...");

  // Reading data from IndexedDB
  const books = await getBooksFromIndexedDB();

  // Sending data to backend -> simulation
  if (books.length > 0) {
    console.log("Books to sync:", books);
    await sleep(2000);
    console.log("Books have been successfully sent to the server!");
    sendPushNotification();
  } else {
    console.log("No books to sync");
  }
}

function getBooksFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("libraryDB", 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction("books", "readonly");
      const store = transaction.objectStore("books");
      const getRequest = store.getAll();

      getRequest.onsuccess = () => {
        resolve(getRequest.result);
      };

      getRequest.onerror = (err) => {
        reject(err);
      };
    };

    request.onerror = (err) => {
      reject(err);
    };
  });
}

// Sending push notification function
function sendPushNotification() {
  self.registration.showNotification("Sync Complete", {
    body: "Your books have been successfully synced with the server!",
    icon: "/assets/img/favicon-96x96.png",
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
