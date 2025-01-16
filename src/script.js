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

let isChecked = false;


let loggedDryFood = parseFloat(localStorage.getItem("dryFoodValue")) || 0;
let loggedWetFood = parseFloat(localStorage.getItem("wetFoodValue")) || 0;

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

    if (dryFoodInput.checked) {
        loggedMeal.innerHTML = `${timestamp}
        <br>${dryValue} portions of dry food`;
        loggedMeal.setAttribute("data-dry-food", dryValue);
        loggedDryFood += dryValue;
        totalDryFood.textContent = loggedDryFood;
    } else if (wetFoodInput.checked){
        loggedMeal.innerHTML = `${timestamp}
        <br>${wetValue} box of wet food`;
        loggedMeal.setAttribute("data-wet-food", wetValue);
        loggedWetFood += wetValue;
        totalWetFood.textContent = loggedWetFood;
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
    });

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
