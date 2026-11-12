function loadCheckoutItems() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("checkout-items");
  const totalElement = document.getElementById("checkout-total");

  container.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const quantity = item.quantity || 1;
    total += item.price * quantity;

    container.innerHTML += `
      <div class="checkout-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p>${item.price} USD &times; ${quantity}</p>
        </div>
      </div>
    `;
  });

  totalElement.textContent = total;
}

// Handle checkout form
document.getElementById("order-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Prices are NOT sent: the server reads them from the database.
  const orderData = {
    customer_name: document.getElementById("name").value,
    customer_email: document.getElementById("email").value,
    address: document.getElementById("address").value,
    items: cart.map((item) => ({ id: Number(item.id), quantity: item.quantity || 1 })),
  };

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(orderData),
    });

    if (response.ok) {
      alert("Order placed successfully!");
      localStorage.removeItem("cart");
      window.location.href = "/index.html";
    } else {
      const error = await response.json().catch(() => ({}));
      alert(error.message || "Error placing order.");
    }
  } catch (error) {
    console.error(error);
    alert("Connection failed.");
  }
});

loadCheckoutItems();
