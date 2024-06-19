// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD7r8Ds8RbxgiGHc0h73oSrro6DDdyGuqI",
    authDomain: "cafeproject-acc8a.firebaseapp.com",
    projectId: "cafeproject-acc8a",
    storageBucket: "cafeproject-acc8a.appspot.com",
    messagingSenderId: "118242250970",
    appId: "1:118242250970:web:20dd9af51e49aec93bd5e3",
    measurementId: "G-9YXP91SYH1"
  };
  
  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // If already initialized, use that one
  }
  
  const database = firebase.database();
  const reviewsContainer = document.getElementById('reviews-container');
  const searchInput = document.getElementById('search-input');
  
  // Function to fetch and display reviews
  function displayReviews(filter = '') {
    const reviewsRef = database.ref('reviews');
    reviewsRef.on('value', function(snapshot) {
      reviewsContainer.innerHTML = ''; // Clear previous reviews
      const reviews = snapshot.val() || {};
      console.log("Fetched reviews data:", reviews); // Log fetched data
  
      Object.keys(reviews).forEach(function(cafeName) {
        const cafeReviews = reviews[cafeName];
        // Create a table for each cafe
        const cafeTable = document.createElement('table');
        cafeTable.classList.add('cafe-table');
  
        // Create a table header
        const tableHeader = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headerCell = document.createElement('th');
        headerCell.colSpan = 2;
        headerCell.textContent = cafeName;
        headerRow.appendChild(headerCell);
        tableHeader.appendChild(headerRow);
        cafeTable.appendChild(tableHeader);
  
        // Create a table body
        const tableBody = document.createElement('tbody');
        let hasMatchingReview = false; // Flag to check if there are matching reviews
  
        Object.values(cafeReviews).forEach(function(review) {
          if (review && typeof review.text === 'string' && review.text.toLowerCase().includes(filter.toLowerCase())) {
            hasMatchingReview = true;
            const reviewRow = document.createElement('tr');
  
            // Create a cell for the review text
            const reviewCell = document.createElement('td');
            reviewCell.textContent = review.text;
            reviewCell.classList.add('text');
            reviewRow.appendChild(reviewCell);
  
            // Create a cell for the review image
            if (review.imageURL) {
              const imageCell = document.createElement('td');
              const image = document.createElement('img');
              image.src = review.imageURL;
              image.alt = 'Review Image';
              image.classList.add('review-image');
              imageCell.appendChild(image);
              reviewRow.appendChild(imageCell);
            }
  
            tableBody.appendChild(reviewRow);
          }
        });
  
        if (hasMatchingReview) {
          cafeTable.appendChild(tableBody);
          reviewsContainer.appendChild(cafeTable);
        }
      });
    });
  }
  
  // Call the function to display reviews when the page loads
  window.onload = function() {
    displayReviews();
  };
  
  // Add event listener to the search input to filter reviews
  searchInput.addEventListener('input', function() {
    const filter = searchInput.value;
    displayReviews(filter);
  });
  