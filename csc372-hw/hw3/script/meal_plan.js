const meal_plan = document.querySelector('#meal_plan_container'); 
const cart_items = document.getElementById('total_items');
const total = document.getElementById('total');

const mealPlan = [];

// Event listener for adding/removing
meal_plan.addEventListener('click', cart); 

// Function to handle adding/removing items from the cart
function cart(event) {
    const selected = event.target;

    if (selected.classList.contains('add')) {
        addToCart(selected);
    } 

    else if (selected.classList.contains('remove')) {
        removeFromCart(selected);
    }
}

function addToCart(button) {
    const name = button.getAttribute('data-name');
    const price = parseFloat(button.getAttribute('data-price'));

    const existing_dish = mealPlan.find(item => item.name === name);

    if (!existing_dish) {
        mealPlan.push({ name, price, quantity: 1 });
    } else {
        existing_dish.quantity++;
    }

    updateCart();
}

function removeFromCart(button) {
    const name = button.getAttribute('data-name');

    const dish_index = mealPlan.findIndex(item => item.name === name);

    if (dish_index !== -1) {
        if (mealPlan[dish_index].quantity > 1) {
            mealPlan[dish_index].quantity--;
        } else {
            mealPlan.splice(dish_index, 1); 
        }
    }

    updateCart();
}

function updateCart() {
    while (cart_items.firstChild) {
        cart_items.removeChild(cart_items.firstChild);
    }

    let total_cost = 0;

    mealPlan.forEach(item => {
        total_cost += item.price * item.quantity;

        // Create the list item and buttons
        const li = document.createElement("li");
        li.textContent = `${item.name} x ${item.quantity} ~ $${(item.price * item.quantity).toFixed(2)}`;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.classList.add("remove");
        removeBtn.setAttribute("data-name", item.name);

        li.appendChild(removeBtn);
        cart_items.appendChild(li);
    });

    // Update the total w/ 2 decimal places
    total.textContent = `Total: $${total_cost.toFixed(2)}`;
}