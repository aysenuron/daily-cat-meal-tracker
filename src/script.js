const dryFoodInput = document.getElementById("dry-food-input");
const wetFoodInput = document.getElementById("wet-food-input");
const dryFoodPortions = document.getElementById("dry-food-portions");
const wetFoodPortions = document.getElementById("wet-food-portions");

const dryPortions = document.getElementById("dry-portions-dropdown");
const wetPortions = document.getElementById("wet-portions-dropdown");

const logMealBtn = document.getElementById("log-meal");

const loggedMealsList = document.getElementById("logged-meals-list");
const totalDryFood = document.getElementById("total-dry-food");
const totalWetFood = document.getElementById("total-wet-food");

const deleteBtn = document.getElementById("delete-button");
const clearDataBtn = document.getElementById("clear-data-button");

let isChecked = false;

let loggedMeals = JSON.parse(localStorage.getItem("loggedMeals")) || [];
let loggedDryFood = parseFloat(localStorage.getItem("dryFoodValue")) || 0;
let loggedWetFood = parseFloat(localStorage.getItem("wetFoodValue")) || 0;

// Set initial values on page load
totalDryFood.textContent = loggedDryFood;
totalWetFood.textContent = loggedWetFood;

function togglePortions() {
    if (dryFoodInput.checked) { 
        dryFoodPortions.classList.remove("hidden");
        wetFoodPortions.classList.add("hidden");
    } else if (wetFoodInput.checked){
        wetFoodPortions.classList.remove("hidden");
        dryFoodPortions.classList.add("hidden");
    }
}

dryFoodInput.addEventListener("change", togglePortions);
wetFoodInput.addEventListener("change", togglePortions);

// Render previously entered meals on page load
function renderLoggedMeals() {
    for ( const meal of loggedMeals) {
        const loggedMeal = document.createElement("li");
        loggedMeal.classList.add("logged-meal");

        const mealDetails = document.createElement("div");
        mealDetails.classList.add("meal-details");
        loggedMealsList.appendChild(mealDetails);

        const checkBox = document.createElement("input");
        checkBox.setAttribute("type", "checkbox");
        checkBox.classList.add("meal-checkbox");

        if (meal.type === "dry") {
            loggedMeal.innerHTML = `${meal.timestamp}
            <br>${meal.portions} portions of dry food`;
            loggedMeal.setAttribute("data-dry-food", meal.portions);
        } else if (meal.type === "wet") {
            loggedMeal.innerHTML = `${meal.timestamp}
            <br>${meal.portions} box of wet food`;
            loggedMeal.setAttribute("data-wet-food", meal.portions);
        }

        mealDetails.appendChild(checkBox);
        mealDetails.appendChild(loggedMeal);
    }
}

renderLoggedMeals();


function renderMeal() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0'); // Get hours (0-23) and pad with leading zero
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Get minutes (0-59) and pad with leading zero
    const timestamp = `${hours}:${minutes}`; // Format as HH:MM

    const loggedMeal = document.createElement("li");
    loggedMeal.classList.add("logged-meal");

    const mealDetails = document.createElement("div");
    mealDetails.classList.add("meal-details");
    loggedMealsList.appendChild(mealDetails);

    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.classList.add("meal-checkbox");

    const dryValue = parseFloat(dryPortions.value);
    const wetValue = parseFloat(wetPortions.value);

    let meal = {};

    if (dryFoodInput.checked) {
        loggedMeal.innerHTML = `${timestamp}
        <br>${dryValue} portions of dry food`;
        loggedMeal.setAttribute("data-dry-food", dryValue);
        loggedDryFood += dryValue;
        totalDryFood.textContent = loggedDryFood;

        meal = {
            timestamp,
            type: "dry",
            portions: dryValue
         };

         loggedMeals.push(meal);
        localStorage.setItem("loggedMeals", JSON.stringify(loggedMeals));

    } else if (wetFoodInput.checked){
        loggedMeal.innerHTML = `${timestamp}
        <br>${wetValue} box of wet food`;
        loggedMeal.setAttribute("data-wet-food", wetValue);
        loggedWetFood += wetValue;
        totalWetFood.textContent = loggedWetFood.toFixed(2);

        meal = {
            timestamp,
            type: "wet",
            portions: wetValue
         };

        loggedMeals.push(meal);
        localStorage.setItem("loggedMeals", JSON.stringify(loggedMeals));
    }

    mealDetails.appendChild(checkBox);
    mealDetails.appendChild(loggedMeal);

    localStorage.setItem("dryFoodValue", loggedDryFood);
    localStorage.setItem("wetFoodValue", loggedWetFood);
    
}

function renderDeleteBtn() {
    const selected = document.querySelectorAll(".meal-checkbox:checked");
    if (selected.length > 0) {
        deleteBtn.classList.remove("hidden");
    } else {
        deleteBtn.classList.add("hidden");
    }
}

function deleteMeal() {
    const selectedMeals = document.querySelectorAll(".meal-checkbox:checked");
    selectedMeals.forEach((checkbox) => {
    const mealEl = checkbox.closest(".meal-details");
    mealEl.remove();

    const loggedMeal = mealEl.querySelector(".logged-meal");
    const dryValue = parseFloat(loggedMeal.getAttribute("data-dry-food")) || 0;
    const wetValue = parseFloat(loggedMeal.getAttribute("data-wet-food")) || 0;

    loggedDryFood -= dryValue;
    loggedWetFood -= wetValue;

    totalDryFood.textContent = loggedDryFood;
    totalWetFood.textContent = loggedWetFood;

    const timestamp = loggedMeal.innerHTML.split("<br>")[0].trim();
    loggedMeals = loggedMeals.filter((meal) => meal.timestamp !== timestamp);
    });

    localStorage.setItem("loggedMeals", JSON.stringify(loggedMeals));
    localStorage.setItem("dryFoodValue", loggedDryFood);
    localStorage.setItem("wetFoodValue", loggedWetFood);
    deleteBtn.classList.add("hidden");
}

logMealBtn.addEventListener("click", renderMeal) 

loggedMealsList.addEventListener("change", (event) => {
    if (event.target.classList.contains("meal-checkbox")) {
        renderDeleteBtn();
    }
})

deleteBtn.addEventListener("click", deleteMeal)

clearDataBtn.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
})


// Check if the date in localStorage matches today's date
function checkAndResetStorage() {
    const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    const storedDate = localStorage.getItem("loggedDate");

    if (storedDate !== today) {
        // Clear meal data
        localStorage.removeItem("loggedMeals");
        localStorage.removeItem("dryFoodValue");
        localStorage.removeItem("wetFoodValue");

        // Reset totals
        loggedMeals = [];
        loggedDryFood = 0;
        loggedWetFood = 0;

        totalDryFood.textContent = loggedDryFood;
        totalWetFood.textContent = loggedWetFood;

        // Update the date in localStorage
        localStorage.setItem("loggedDate", today);
    }
}

// Call the function when the page loads
checkAndResetStorage();