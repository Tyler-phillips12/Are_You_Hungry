const spinner = document.querySelector('.spinner');
const mealImage = document.getElementById('mealImage');
const mealName = document.getElementById('mealName');
const mealRecipe = document.getElementById('mealRecipe');
const randomButton = document.getElementById('randomButton');

let recipes = [];

function fetchRecipes() {
  const numberOfRecipes = 360000; // You can adjust the number of recipes you want to fetch

  fetch(`https://api.spoonacular.com/recipes/random?apiKey=8d241ad6e0524291bb07e903cffd0941&number=${numberOfRecipes}`)
    .then(response => response.json())
    .then(data => {
      recipes = data.recipes || [];
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function spinSpinner() {
  randomButton.disabled = true;

  let currentIndex = 0;
  const maxIndex = recipes.length - 1;
  let interval;

  const spinInterval = 100; // Interval in milliseconds
  const spinDuration = 8000; // Duration in milliseconds

  function spin() {
    const selectedRecipe = recipes[currentIndex];

    // Set a fixed height for the meal image
    const windowHeight = window.innerHeight;
    const mealImageHeight = windowHeight / 2; // Adjust as needed
    mealImage.style.height = `${mealImageHeight}px`;

    // Calculate the width to maintain aspect ratio
    const imageAspectRatio = selectedRecipe.imageWidth / selectedRecipe.imageHeight;
    const mealImageWidth = mealImageHeight * imageAspectRatio;
    mealImage.style.width = `${mealImageWidth}px`;

    mealImage.src = selectedRecipe.image;
    mealName.textContent = selectedRecipe.title;

    fetchRecipeDetails(selectedRecipe.id);

    function fetchRecipeDetails(recipeId) {
      // Make an API request to fetch recipe details by ID
      fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=8d241ad6e0524291bb07e903cffd0941`)
        .then(response => response.json())
        .then(data => {
          const selectedRecipe = data;
    
          // Extract and format ingredients
          const ingredientsList = selectedRecipe.extendedIngredients.map(ingredient => ingredient.original);
    
          // Update the mealRecipe element with ingredients
          mealRecipe.innerHTML = `
            <h2>Ingredients:</h2>
            <ul>
              ${ingredientsList.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <h2>Instructions:</h2>
            <p>${selectedRecipe.instructions || 'No instructions available.'}</p>
          `;
        })
        .catch(error => {
          console.error('Error fetching recipe details:', error);
        });
    }

    mealRecipe.innerHTML = `<p>${selectedRecipe.instructions || 'No instructions available.'}</p>`;

    currentIndex++;
    if (currentIndex > maxIndex) {
      currentIndex = 0;
    }

    mealRecipe.style.display = 'none';
  }

  // Start spinning animation
  interval = setInterval(spin, spinInterval);

  // Stop spinning after the specified duration
  setTimeout(() => {
    clearInterval(interval);
    const randomIndex = Math.floor(Math.random() * recipes.length);
    const selectedRecipe = recipes[randomIndex];

    // Reset image size
    mealImage.style.height = ''; // Clear height
    mealImage.style.width = ''; // Clear width

    mealImage.src = selectedRecipe.image;
    mealName.textContent = selectedRecipe.title;

    mealRecipe.innerHTML = `<p>${selectedRecipe.instructions || 'No instructions available.'}</p>`;

    mealRecipe.style.display = 'block';

    randomButton.disabled = false;
  }, spinDuration);
}

randomButton.addEventListener('click', spinSpinner);

// Fetch recipes from the Spoonacular API when the page loads
fetchRecipes();















