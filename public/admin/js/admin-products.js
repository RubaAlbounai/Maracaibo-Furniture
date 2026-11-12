const apiBase = "/api/products";

// Load products at start
document.addEventListener("DOMContentLoaded", loadProducts);

// Fetch all products
function loadProducts() {
    fetch(apiBase)
        .then(res => res.json())
        .then(products => {
            let rows = "";
            products.forEach(p => {
                rows += `
                <tr>
                    <td>${p.id}</td>
                    <td><input value="${p.name}" id="name-${p.id}"></td>
                    <td><input value="${p.description}" id="description-${p.id}"></td>
                    <td><input type="number" value="${p.price}" id="price-${p.id}"></td>
                    <td><input type="number" value="${p.stock}" id="stock-${p.id}"></td>
                    <td>
                        <button onclick="updateProduct(${p.id})">Update</button>
                        <button onclick="deleteProduct(${p.id})" style="background:#e74c3c">Delete</button>
                    </td>
                </tr>`;
            });

            document.getElementById("productTableBody").innerHTML = rows;
        });
}

// Add product
document.getElementById("addProductForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const data = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        stock: document.getElementById("stock").value
    };

    fetch(apiBase, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    .then(() => {
        alert("Product added!");
        loadProducts();
    });
});

// Update product
function updateProduct(id) {
    const data = {
        name: document.getElementById(`name-${id}`).value,
        description: document.getElementById(`description-${id}`).value,
        price: document.getElementById(`price-${id}`).value,
        stock: document.getElementById(`stock-${id}`).value
    };

    fetch(`${apiBase}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
    .then(() => {
        alert("Updated!");
        loadProducts();
    });
}

// Delete product
function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;

    fetch(`${apiBase}/${id}`, { method: "DELETE" })
        .then(() => {
            alert("Deleted!");
            loadProducts();
        });
}
