function loadCheckoutItems() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("checkout-items");
  const totalElement = document.getElementById("checkout-total");

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price;

    container.innerHTML += `
      <div class="checkout-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p>${item.price} USD</p>
        </div>
      </div>
    `;
  });

  totalElement.textContent = total;
}

// Handle Checkout Form
document.getElementById("order-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const orderData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    address: document.getElementById("address").value,
    items: cart
  };

  try {
    // Send order to Laravel backend
    const response = await fetch("http://localhost:8000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    if (response.ok) {
      alert("Order placed successfully!");
      localStorage.removeItem("cart"); // clear cart
      window.location.href = "products.html"; // go back to shopping
    } else {
      alert("Error placing order.");
    }

  } catch (error) {
    console.error(error);
    alert("Connection failed.");
  }
});

loadCheckoutItems();
