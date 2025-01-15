const dryFoodInput = document.getElementById("dry-food-input");
const wetFoodInput = document.getElementById("wet-food-input");
const dryFoodPortions = document.getElementById("dry-food-portions");
const wetFoodPortions = document.getElementById("wet-food-portions");

const dryPortions = document.getElementById("dry-portions-dropdown");
const wetPortions = document.getElementById("wet-portions-dropdown");

const logMealBtn = document.getElementById("log-meal");

const loggedMealsList = document.getElementById("logged-meals-list");

let loggedDryFood = 0;
let loggedWetFood = 0;


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

logMealBtn.addEventListener("click", () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0'); // Get hours (0-23) and pad with leading zero
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Get minutes (0-59) and pad with leading zero
    const timestamp = `${hours}:${minutes}`; // Format as HH:MM

    const loggedMeal = document.createElement("li");
    loggedMealsList.appendChild(loggedMeal);
    loggedMeal.classList.add("logged-meal");

    if (dryFoodInput.checked) {
        loggedMeal.innerHTML = `${timestamp}
        <br>${dryPortions.value} portions of dry food`;
        loggedDryFood += parseFloat(dryPortions.value);
    } else if (wetFoodInput.checked){
        loggedMeal.innerHTML = `${timestamp}
        <br>${wetPortions.value} box of wet food`;
        loggedWetFood += parseFloat(wetPortions.value);
    }

    console.log(`${loggedDryFood} dry`);
    console.log(`${loggedWetFood} wet`);

}) 