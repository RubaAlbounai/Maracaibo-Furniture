const apiBase = "http://localhost:8000/api/products/category/accessories";

async function loadAccessories() {
  try {
    const response = await fetch(apiBase);
    const data = await response.json();

    const grid = document.getElementById("product-grid");
    grid.innerHTML = "";

    data.forEach(product => {
      grid.innerHTML += `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>${product.price} USD</p>
          <button onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">
            Add to Cart
          </button>
        </div>
      `;
    });

  } catch (error) {
    console.error("Error loading accessories:", error);
  }
}

loadAccessories();

function addToCart(id, name, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ id, name, price, image });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(name + " added to cart!");
}
