// DOM Elements
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");

// Fetch Books from API
async function fetchBooks(query) {
  resultsContainer.innerHTML = "<p>Loading...</p>"; // Show loading state
  const apiUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`;
  
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch data"); // Handle HTTP errors
    const data = await response.json();

    if (data.docs.length === 0) {
      resultsContainer.innerHTML = "<p>No results found. Try a different title!</p>";
    } else {
      displayResults(data.docs);
    }
  } catch (error) {
    resultsContainer.innerHTML = "<p>Error fetching books. Please try again later.</p>";
    console.error("Error fetching data:", error);
  }
}

// Display Results
function displayResults(books) {
  resultsContainer.innerHTML = ""; // Clear previous results
  books.slice(0, 12).forEach(book => {
    const title = book.title || "Unknown Title";
    const author = book.author_name ? book.author_name.join(", ") : "Unknown Author";
    const year = book.first_publish_year || "Unknown Year";
    const coverId = book.cover_i;
    const coverUrl = coverId 
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : "https://via.placeholder.com/150?text=No+Cover";
    const bookKey = book.key;
    const bookUrl = `https://openlibrary.org${bookKey}`;

    // Create a card for each book
    const bookCard = `
      <a href="${bookUrl}" target="_blank" class="result-card">
        <img src="${coverUrl}" alt="${title}">
        <h3>${title}</h3>
        <p><strong>Author:</strong> ${author}</p>
        <p><strong>Year:</strong> ${year}</p>
      </a>
    `;
    resultsContainer.innerHTML += bookCard;
  });
}

// Add Event Listener
searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchBooks(query);
  } else {
    resultsContainer.innerHTML = "<p>Please enter a book title to search.</p>";
  }
});
