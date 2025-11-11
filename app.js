const spinner = document.querySelector('.spinner');
const mealImage = document.getElementById('mealImage');
const mealName = document.getElementById('mealName');
const mealRecipe = document.getElementById('mealRecipe');
const randomButton = document.getElementById('randomButton');
const mealTypeSelect = document.getElementById('mealType');
const meatSelect = document.getElementById('meatType');
const vegSelect = document.getElementById('vegType');

let recipes = [];

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x300.png?text=No+Image+Available";

// Map dropdown options to Spoonacular type
function mapMealType(type) {
  switch (type.toLowerCase()) {
    case 'breakfast': return 'breakfast';
    case 'lunch':
    case 'dinner': return 'main course';
    default: return '';
  }
}

// ✅ Fetch recipes with full info including images
function fetchRecipes(mealType, meat, vegetable) {
  spinner.style.display = 'block';
  randomButton.disabled = true;

  const spoonacularType = mapMealType(mealType);
  const includeIngredients = [meat, vegetable]
    .filter(v => v && v !== 'None')
    .join(',');

  const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=8d241ad6e0524291bb07e903cffd0941&number=10&type=${spoonacularType}&includeIngredients=${includeIngredients}&addRecipeInformation=true`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      recipes = (data.results || []).filter(
        r => !r.dishTypes?.some(type => type.toLowerCase().includes('dessert'))
      );

      if (recipes.length === 0) {
        mealName.textContent = 'No recipes found for that combination!';
        mealImage.src = PLACEHOLDER_IMAGE;
        mealRecipe.innerHTML = '';
      } else {
        spinSpinner();
      }
    })
    .catch(error => {
      console.error('Error fetching recipes:', error);
      mealName.textContent = 'Error fetching recipes. Try again.';
      mealImage.src = PLACEHOLDER_IMAGE;
    })
    .finally(() => {
      spinner.style.display = 'none';
      randomButton.disabled = false;
    });
}

// 🎰 Spinner animation
function spinSpinner() {
  randomButton.disabled = true;
  let currentIndex = 0;
  const spinInterval = 100;
  const spinDuration = 3000;
  let interval;

  function spin() {
    const selectedRecipe = recipes[currentIndex];
    if (selectedRecipe) {
      mealImage.src = selectedRecipe.image || PLACEHOLDER_IMAGE;
      mealName.textContent = selectedRecipe.title;
    }
    currentIndex = (currentIndex + 1) % recipes.length;
  }

  interval = setInterval(spin, spinInterval);

  setTimeout(() => {
    clearInterval(interval);
    const randomIndex = Math.floor(Math.random() * recipes.length);
    const selectedRecipe = recipes[randomIndex];

    mealImage.src = selectedRecipe.image || PLACEHOLDER_IMAGE;
    mealName.textContent = selectedRecipe.title;

    if (selectedRecipe.id) {
      fetchRecipeDetails(selectedRecipe.id);
    } else {
      mealRecipe.innerHTML = `<p>Recipe details unavailable.</p>`;
    }

    randomButton.disabled = false;
  }, spinDuration);
}

// 🍳 Fetch full recipe details
function fetchRecipeDetails(recipeId) {
  fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=8d241ad6e0524291bb07e903cffd0941`)
    .then(response => response.json())
    .then(data => {
      const ingredientsList = data.extendedIngredients?.map(i => i.original) || [];

      mealRecipe.innerHTML = `
        <h2>Ingredients:</h2>
        <ul>${ingredientsList.map(i => `<li>${i}</li>`).join('')}</ul>
        <h2>Instructions:</h2>
        <p>${data.instructions || 'No instructions available.'}</p>
      `;
    })
    .catch(err => {
      console.error('Error fetching recipe details:', err);
      mealRecipe.innerHTML = `<p>Could not load recipe details.</p>`;
    });
}

// 🎛️ When user clicks Random Recipe
randomButton.addEventListener('click', () => {
  const mealType = mealTypeSelect.value;
  const meat = meatSelect.value;
  const vegetable = vegSelect.value;
  fetchRecipes(mealType, meat, vegetable);
});













