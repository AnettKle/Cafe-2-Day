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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Define cafe locations
const cafeLocations = {
  "Awluk": { lat: 35.1553205, lng: 129.068134 },
  "Good Enough": { lat: 35.2289282, lng: 129.0875529 },
  "Goof": { lat: 35.1526905, lng: 129.0682491 },
  "kkongtemua": { lat: 35.1528341, lng: 129.067043 }
};

// Initialize the map and markers array
const mapOptions = {
  center: new naver.maps.LatLng(37.3595704, 127.105399),
  zoom: 10
};
const map = new naver.maps.Map('map', mapOptions);
map.markers = [];

// Function to show cafe location on map
function showCafeLocation(cafeName) {
  console.log('Selected cafe:', cafeName);

  const selectedLocation = cafeLocations[cafeName];
  console.log('Selected location:', selectedLocation);

  if (selectedLocation) {
    // Center the map on the selected cafe's location
    map.setCenter(new naver.maps.LatLng(selectedLocation.lat, selectedLocation.lng));

    // Remove existing markers from the map
    map.markers.forEach(marker => {
      marker.setMap(null);
    });

    // Clear the markers array
    map.markers = [];

    // Add a marker for the selected cafe
    const marker = new naver.maps.Marker({
      position: new naver.maps.LatLng(selectedLocation.lat, selectedLocation.lng),
      map: map,
      icon: {
        content: '<div style="background-color: red; width: 20px; height: 20px; border-radius: 50%;"></div>',
        anchor: new naver.maps.Point(10, 10)
      }
    });

    // Add the new marker to the markers array
    map.markers.push(marker);
  }
}

// Function to show cafe reviews
function showCafeReviews(cafeName) {
  const selectedCafeElement = document.getElementById('selected-cafe');
  const reviewsListElement = document.getElementById('reviews-list');
  const reviewFormElement = document.getElementById('review-form');

  if (!cafeName) {
    selectedCafeElement.textContent = '';
    reviewsListElement.innerHTML = '';
    reviewFormElement.style.display = 'none';
    return;
  }

  selectedCafeElement.textContent = cafeName;
  reviewFormElement.style.display = 'block';

  const reviewsRef = database.ref('reviews/' + cafeName);
  reviewsRef.on('value', function(snapshot) {
    const reviews = snapshot.val() || {};
    reviewsListElement.innerHTML = '';

    Object.keys(reviews).forEach(function(reviewId) {
      const review = reviews[reviewId];
      const reviewItem = document.createElement('li');
      reviewItem.textContent = review.text;

      // If there's an image URL, create an image element and append it to the review item
      if (review.imageURL) {
        const image = document.createElement('img');
        image.src = review.imageURL;
        image.classList.add('review-image');
        reviewItem.appendChild(image);
      }

      reviewsListElement.appendChild(reviewItem);
    });
  });

  const reviewForm = document.getElementById('review-form');
  reviewForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const reviewText = document.getElementById('review-text').value.trim();
    const reviewImage = document.getElementById('review-image').files[0]; // Get the selected image file

    if (reviewText) {
      submitReview(cafeName, reviewText, reviewImage);
      document.getElementById('review-text').value = '';
      document.getElementById('review-image').value = ''; // Reset the input field after submission
    }
  });
}

// Function to submit a review
function submitReview(cafeName, reviewText, reviewImage) {
  const reviewsRef = database.ref('reviews/' + cafeName);
  const newReviewRef = reviewsRef.push();
  const storageRef = firebase.storage().ref(); // Reference to Firebase Storage

  // Upload image to storage if provided
  if (reviewImage) {
    const imageRef = storageRef.child(cafeName + '/' + newReviewRef.key + '_' + reviewImage.name);
    imageRef.put(reviewImage)
      .then(snapshot => {
        return snapshot.ref.getDownloadURL(); // Get download URL of uploaded image
      })
      .then(imageURL => {
        // Save review data including image URL
        newReviewRef.set({ text: reviewText, imageURL: imageURL })
          .then(function() {
            console.log('Review submitted successfully!');
            // Redirect to the reviews page with cafeName as a query parameter
            window.location.href = 'reviews.html?cafe=' + encodeURIComponent(cafeName);
          })
          .catch(function(error) {
            console.error('Error submitting review:', error);
          });
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
  } else {
    // Save review data without image URL if no image provided
    newReviewRef.set({ text: reviewText })
      .then(function() {
        console.log('Review submitted successfully!');
        // Redirect to the reviews page with cafeName as a query parameter
        window.location.href = 'reviews.html?cafe=' + encodeURIComponent(cafeName);
      })
      .catch(function(error) {
        console.error('Error submitting review:', error);
      });
  }
}

// Add an event listener to the select element
const cafeSelect = document.getElementById('cafe-select');
cafeSelect.addEventListener('change', function() {
  const selectedCafe = this.value;
  showCafeLocation(selectedCafe);
  showCafeReviews(selectedCafe);
});





