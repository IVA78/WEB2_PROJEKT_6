console.log("I am in utils.js!");

// Define a variable to hold the books data
let data = [];

// Function to load book data from JSON file
async function loadBooks() {
  console.log("Calling loadBooks...");
  try {
    // Fetch data from books.json
    const response = await fetch("/assets/books/books.json");
    data = await response.json(); // Store books in data variable
    console.log("Loaded books:", data);

    // Call function to display books
    displayBooks();
  } catch (error) {
    console.error("Error loading books:", error);
  }
}

// Function to display books in the body
function displayBooks() {
  console.log("Displaying books...");
  const bookList = document.getElementById("book-list");
  bookList.innerHTML = ""; // Clear previous content

  data.forEach((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book");

    // Add the image
    const bookImg = document.createElement("img");
    bookImg.src = book.image;
    bookImg.alt = book.title;
    bookDiv.appendChild(bookImg);

    // Add the book title
    const bookTitle = document.createElement("h2");
    bookTitle.textContent = book.title;
    bookDiv.appendChild(bookTitle);

    // Add the book author
    const bookAuthor = document.createElement("p");
    bookAuthor.innerHTML = `<strong>Author:</strong> ${book.author}`;
    bookDiv.appendChild(bookAuthor);

    // Add the book genre
    const bookGenre = document.createElement("p");
    bookGenre.innerHTML = `<strong>Genre:</strong> ${book.genre}`;
    bookDiv.appendChild(bookGenre);

    // Add the share button
    const shareButton = document.createElement("button");
    shareButton.textContent = "Share Book";
    shareButton.classList.add("share-button"); // Add class for styling
    bookDiv.appendChild(shareButton);

    // Append the book div to the book list container
    bookList.appendChild(bookDiv);

    //Adding event listener
    shareButton.addEventListener("click", async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: book.title,
            text: `Check out this book: "${book.title}" by ${book.author}. Genre: ${book.genre}`,
            url: window.location.href,
          });
          console.log("Book shared successfully!");
        } catch (error) {
          console.error("Error sharing:", error);
        }
      } else {
        alert("Web Share API is not supported in this browser.");
      }
    });
  });
}

// Load books when the script is loaded
loadBooks();

// Saving data in IndexedDB
function saveBookToIndexedDB(book) {
  const request = indexedDB.open("libraryDB", 1);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("books")) {
      db.createObjectStore("books", { autoIncrement: true });
    }
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction("books", "readwrite");
    const store = transaction.objectStore("books");
    store.add(book);
  };

  request.onerror = (event) => {
    console.log("Error opening IndexedDB:", event);
  };
}

// Form logic
document.getElementById("book-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const book = {
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    genre: document.getElementById("genre").value,
    image: document.getElementById("image").value,
  };

  // Save to IndexedDB
  saveBookToIndexedDB(book);

  // Background Sync Registration (if Service Worker is ready)
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.sync
        .register("sync-books")
        .then(() => {
          console.log("Sync registered for books");
        })
        .catch((err) => {
          console.log("Sync registration failed:", err);
        });
    });
  }

  alert("Book saved! It will be synced when you are online.");
});
