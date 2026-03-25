// Initial Recipes Data
let recipes = [
    {
        id: 1,
        title: "Chicken Roast",
        image: "images/chicken.jpg",
        description: "A delicious and juicy roasted chicken with a blend of secret spices and herbs. Perfect for family dinners and special occasions.",
        ingredients: ["1 Whole Chicken", "2 tbsp Olive Oil", "4 cloves Garlic", "1 sprig Rosemary", "Black Pepper to taste", "Salt", "1 Lemon"]
    },
    {
        id: 2,
        title: "Healthy Breakfast",
        image: "images/breakfast.jpg",
        description: "Start your day right with a nutritious and filling breakfast composed of fresh fruits, eggs, and toast.",
        ingredients: ["2 Eggs", "2 slices Whole Wheat Bread", "1/2 Avocado", "1 cup Fresh Berries", "2 tbsp Honey", "1 cup Yogurt"]
    },
    {
        id: 3,
        title: "Lunch Special",
        image: "images/lunch.jpg",
        description: "A well-balanced lunch meal packed with protein, veggies, and healthy carbs to keep your energy up.",
        ingredients: ["1 cup Brown Rice", "200g Grilled Chicken Breast", "1 cup Broccoli", "1/2 cup Carrots", "2 tbsp Soy Sauce"]
    },
    {
        id: 4,
        title: "Classic Dinner",
        image: "images/dinner.jpg",
        description: "A comforting and classic dinner made with carefully selected ingredients for a perfect evening.",
        ingredients: ["200g Salmon Filet", "10 spears Asparagus", "1 cup Mashed Potatoes", "1 tbsp Butter", "2 cloves Garlic"]
    },
    {
        id: 5,
        title: "Italian Pasta",
        image: "images/pasta.jpg",
        description: "Authentic Italian pasta made with homemade tomato sauce, fresh basil, and perfectly cooked noodles.",
        ingredients: ["200g Penne Pasta", "1 cup Tomato Sauce", "Handful of Fresh Basil", "1/4 cup Parmesan Cheese", "2 tbsp Olive Oil", "2 cloves Garlic"]
    }
];

// Scroll animation observer
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, { threshold: 0.1 });

// Function to render recipes
function renderRecipes() {
    const container = document.getElementById("recipe-cards");
    if(!container) return;
    
    container.innerHTML = "";
    recipes.forEach(recipe => {
        const card = document.createElement("div");
        card.classList.add("card");
        
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <button class="btn small-btn view-recipe-btn" data-id="${recipe.id}" style="border: none; cursor: pointer;">View More</button>
        `;
        container.appendChild(card);
    });

    // Re-observe cards and features for scroll animation
    setTimeout(() => {
        document.querySelectorAll(".card, .feature").forEach(el => observer.observe(el));
    }, 100);

    // Attach event listeners to newly generated buttons
    document.querySelectorAll('.view-recipe-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const id = parseInt(this.getAttribute('data-id'));
            openRecipeModal(id);
        });
    });
}

// Render on load
document.addEventListener("DOMContentLoaded", renderRecipes);

// Modal Logic
const recipeModal = document.getElementById('recipe-modal');
const addModal = document.getElementById('add-recipe-modal');
const closeRecipeBtn = document.getElementById('close-recipe-modal');
const closeAddBtn = document.getElementById('close-add-modal');
const openAddBtn = document.getElementById('open-add-modal-btn');

function openRecipeModal(id) {
    const recipe = recipes.find(r => r.id === id);
    if(recipe) {
        document.getElementById('detail-image').src = recipe.image;
        document.getElementById('detail-title').innerText = recipe.title;
        document.getElementById('detail-desc').innerText = recipe.description;
        
        const ul = document.getElementById('detail-ingredients');
        ul.innerHTML = "";
        recipe.ingredients.forEach(ing => {
            const li = document.createElement('li');
            li.innerText = ing.trim();
            ul.appendChild(li);
        });
        
        recipeModal.classList.add('show');
    }
}

// Close Modals events
if (closeRecipeBtn) closeRecipeBtn.addEventListener('click', () => recipeModal.classList.remove('show'));
if (closeAddBtn) closeAddBtn.addEventListener('click', () => addModal.classList.remove('show'));
if (openAddBtn) openAddBtn.addEventListener('click', () => addModal.classList.add('show'));

// Close when clicking outside of modal content
window.addEventListener('click', (e) => {
    if (e.target === recipeModal) recipeModal.classList.remove('show');
    if (e.target === addModal) addModal.classList.remove('show');
});

// Add Recipe Form Submit
const addRecipeForm = document.getElementById('add-recipe-form');
if (addRecipeForm) {
    addRecipeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('new-recipe-title').value;
        const imageInput = document.getElementById('new-recipe-image').value;
        const desc = document.getElementById('new-recipe-desc').value;
        const ingredientsRaw = document.getElementById('new-recipe-ingredients').value;
        
        const newRecipe = {
            id: recipes.length ? Math.max(...recipes.map(r => r.id)) + 1 : 1,
            title: title,
            image: imageInput.trim() !== "" ? imageInput : "images/pasta.jpg",
            description: desc,
            ingredients: ingredientsRaw.split(',').map(item => item.trim())
        };
        
        recipes.push(newRecipe);
        renderRecipes();
        addModal.classList.remove('show');
        this.reset();
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Finger tap animation for buttons and images
document.addEventListener('click', function(e) {
    if (e.target.closest('.btn') || e.target.closest('img') || e.target.closest('.close-btn')) {
        let ripple = document.createElement('div');
        ripple.classList.add('finger-ripple');
        
        ripple.style.left = e.pageX + 'px';
        ripple.style.top = e.pageY + 'px';
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});