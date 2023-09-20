const spinner = document.querySelector('.spinner');
const mealImage = document.getElementById('mealImage');
const mealName = document.getElementById('mealName');
const mealRecipe = document.getElementById('mealRecipe');
const randomButton = document.getElementById('randomButton');

let meals = [];

function fetchMeals() {
  fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
    .then(response => response.json())
    .then(data => {
      meals = data.meals || [];
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function spinSpinner() {
  randomButton.disabled = true;

  let currentIndex = 0;
  const maxIndex = meals.length - 1;
  let interval;
  let instructionsIndex = 0; // Index to keep track of displayed instructions

  const spinInterval = 100; // Interval in milliseconds
  const spinDuration = 8000; // Duration in milliseconds

  function spin() {
    const selectedMeal = meals[currentIndex];

    mealImage.src = selectedMeal.strMealThumb;
    mealImage.onload = function () {
      const imageWidth = this.width;
      const imageHeight = this.height;
      const spinnerWidth = spinner.offsetWidth;
      const spinnerHeight = spinner.offsetHeight;

      const scale = Math.min(spinnerWidth / imageWidth, spinnerHeight / imageHeight);
      const scaledWidth = imageWidth * scale;
      const scaledHeight = imageHeight * scale;

      mealImage.style.width = `${scaledWidth}px`;
      mealImage.style.height = `${scaledHeight}px`;
    };

    mealName.textContent = selectedMeal.strMeal;

    currentIndex++;
    if (currentIndex > maxIndex) {
      currentIndex = 0;
    }
  }

  // Start spinning animation
  interval = setInterval(spin, spinInterval);

  // Stop spinning after specified duration
  setTimeout(() => {
    clearInterval(interval);
    const randomIndex = Math.floor(Math.random() * meals.length);
    const selectedMeal = meals[randomIndex];

    mealImage.src = selectedMeal.strMealThumb;
    mealName.textContent = selectedMeal.strMeal;

    // Initially hide the instructions
    mealRecipe.style.display = 'none';

    randomButton.disabled = false;

    // Split the instructions into an array of steps
    const instructionsArray = selectedMeal.strInstructions.split('\n').filter(step => step.trim() !== '');
    
    // Display the instructions step by step
    if (instructionsIndex < instructionsArray.length) {
      mealRecipe.textContent = instructionsArray[instructionsIndex];
      mealRecipe.style.display = 'block';

      // Increment the instructionsIndex for the next step
      instructionsIndex++;
    }
  }, spinDuration);

  // Continue displaying instructions step by step
  setInterval(() => {
    if (instructionsIndex < instructionsArray.length) {
      mealRecipe.textContent = instructionsArray[instructionsIndex];
      mealRecipe.style.display = 'block';

      // Increment the instructionsIndex for the next step
      instructionsIndex++;
    }
  }, 3000); // Adjust the interval as needed
}

randomButton.addEventListener('click', spinSpinner);

// Fetch meals from the API when the page loads
fetchMeals();
















