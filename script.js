// Global State
let isAdmin = false;
let editingId = null;
let currentSearchTerm = "";


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
    if (!container) return;

    container.innerHTML = "";
    
    // Filter by search term
    const filteredRecipes = recipes.filter(recipe => 
        recipe.title.toLowerCase().includes(currentSearchTerm) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(currentSearchTerm))
    );

    if (filteredRecipes.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; font-size: 18px; margin-top: 20px;">No recipes found.</p>`;
    }

    filteredRecipes.forEach(recipe => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.style.position = "relative";

        let adminActions = '';
        if (isAdmin) {
            adminActions = `
                <div style="margin-top: 10px; display: flex; gap: 10px; justify-content: center;">
                    <button class="btn small-btn edit-recipe-btn" data-id="${recipe.id}" style="border: none; cursor: pointer; padding: 6px 12px; font-size: 13px;">Edit</button>
                    <button class="btn small-btn delete-recipe-btn" data-id="${recipe.id}" style="border: none; cursor: pointer; background: #e74c3c; padding: 6px 12px; font-size: 13px;">Delete</button>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="${recipe.isFavorite ? 'fav-btn active' : 'fav-btn'}" data-id="${recipe.id}">♥</div>
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <button class="btn small-btn view-recipe-btn" data-id="${recipe.id}" style="border: none; cursor: pointer;">View More</button>
            ${adminActions}
        `;
        container.appendChild(card);
    });

    // Re-observe cards and features for scroll animation
    setTimeout(() => {
        document.querySelectorAll(".card, .feature").forEach(el => observer.observe(el));
    }, 100);

    // Attach event listeners to newly generated buttons
    document.querySelectorAll('.view-recipe-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const id = parseInt(this.getAttribute('data-id'));
            openRecipeModal(id);
        });
    });

    // Favorite button listeners
    document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const id = parseInt(this.getAttribute('data-id'));
            const recipe = recipes.find(r => r.id === id);
            if (recipe) {
                recipe.isFavorite = !recipe.isFavorite;
                renderRecipes();
            }
        });
    });

    // Admin Actions Listeners
    if (isAdmin) {
        document.querySelectorAll('.edit-recipe-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const id = parseInt(this.getAttribute('data-id'));
                openEditModal(id);
            });
        });

        document.querySelectorAll('.delete-recipe-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const id = parseInt(this.getAttribute('data-id'));
                if (confirm("Are you sure you want to delete this recipe?")) {
                    recipes = recipes.filter(r => r.id !== id);
                    renderRecipes();
                }
            });
        });
    }
}

function openEditModal(id) {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return;

    editingId = id;
    document.getElementById('modal-title').innerHTML = "Edit <span>Recipe</span>";
    document.getElementById('new-recipe-title').value = recipe.title;
    document.getElementById('new-recipe-image').value = recipe.image;
    document.getElementById('new-recipe-desc').value = recipe.description;
    document.getElementById('new-recipe-ingredients').value = recipe.ingredients.join(', ');

    addModal.classList.add('show');
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
    if (recipe) {
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
if (openAddBtn) openAddBtn.addEventListener('click', () => {
    editingId = null;
    document.getElementById('modal-title').innerHTML = "Add New <span>Recipe</span>";
    document.getElementById('add-recipe-form').reset();
    addModal.classList.add('show');
});

// Close when clicking outside of modal content
window.addEventListener('click', (e) => {
    if (e.target === recipeModal) recipeModal.classList.remove('show');
    if (e.target === addModal) addModal.classList.remove('show');
});

// Add/Edit Recipe Form Submit
const addRecipeForm = document.getElementById('add-recipe-form');
if (addRecipeForm) {
    addRecipeForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('new-recipe-title').value;
        const imageInput = document.getElementById('new-recipe-image').value;
        const desc = document.getElementById('new-recipe-desc').value;
        const ingredientsRaw = document.getElementById('new-recipe-ingredients').value;
        const image = imageInput.trim() !== "" ? imageInput : "images/pasta.jpg";
        const ingredients = ingredientsRaw.split(',').map(item => item.trim());

        if (editingId) {
            // Update existing recipe
            const index = recipes.findIndex(r => r.id === editingId);
            if (index !== -1) {
                recipes[index] = { ...recipes[index], title, image, description: desc, ingredients };
            }
        } else {
            // Add new recipe
            const newRecipe = {
                id: recipes.length ? Math.max(...recipes.map(r => r.id)) + 1 : 1,
                title,
                image,
                description: desc,
                ingredients
            };
            recipes.push(newRecipe);
        }

        renderRecipes();
        addModal.classList.remove('show');
        this.reset();
        editingId = null;
    });
}

// Admin Login Logic
const adminLoginBtn = document.getElementById('admin-login-btn');
if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isAdmin) {
            const password = prompt("Enter Admin Password");
            if (password === "Admin@#12321") {
                isAdmin = true;
                adminLoginBtn.innerText = "Admin Logout";
                adminLoginBtn.style.color = "var(--primary)";
                if (openAddBtn) openAddBtn.style.display = "block";
                renderRecipes();
            } else if (password !== null) {
                alert("Incorrect Password!");
            }
        } else {
            isAdmin = false;
            adminLoginBtn.innerText = "Admin Login";
            adminLoginBtn.style.color = "";
            if (openAddBtn) openAddBtn.style.display = "none";
            renderRecipes();
        }
    });
}

// Search Bar Logic
const searchInput = document.getElementById("search-input");
if (searchInput) {
    searchInput.addEventListener("input", function (e) {
        currentSearchTerm = e.target.value.toLowerCase();
        renderRecipes();
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
document.addEventListener('click', function (e) {
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