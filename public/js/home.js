const apiBase = "http://127.0.0.1:8000/api";

async function loadPreview() {
    const res = await fetch(`${apiBase}/products`);
    const data = await res.json();

    const container = document.getElementById("preview-products");
    container.innerHTML = "";

    data.slice(0, 4).forEach(product => {
        container.innerHTML += `
            <div class="product-card">
                <img src="img/default.jpg" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
            </div>
        `;
    });
}

loadPreview();
