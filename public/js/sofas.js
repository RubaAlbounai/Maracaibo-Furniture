document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/products?category=sofas")
        .then(res => res.json())
        .then(data => renderSofas(data))
        .catch(err => console.error(err));
});

function renderSofas(products) {
    const container = document.getElementById("sofas-list");
    container.innerHTML = "";

    if (products.length === 0) {
        container.innerHTML = "<p>No sofas available right now.</p>";
        return;
    }

    products.forEach(item => {
        const card = `
            <div class="product-card">
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.price} USD</p>
                <button onclick="addToCart(${item.id})">Add to Cart</button>
            </div>
        `;
        container.innerHTML += card;
    });
}

function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(id);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
}
