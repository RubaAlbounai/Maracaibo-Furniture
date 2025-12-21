const apiBase = "http://localhost:8000/api";

async function loadOrders() {
    try {
        const response = await fetch(`${apiBase}/orders`);
        const orders = await response.json();

        const tableContainer = document.getElementById("ordersTable");
        const noOrders = document.getElementById("noOrders");

        if (orders.length === 0) {
            noOrders.style.display = "block";
            return;
        }

        let html = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Total Price</th>
                        <th>Status</th>
                        <th>Items</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        orders.forEach(order => {
            let itemsList = order.items
                .map(item => `<li>${item.product.name} × ${item.quantity}</li>`)
                .join("");

            html += `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.customer_name}</td>
                    <td>${order.customer_email}</td>
                    <td>$${order.total_price}</td>
                    <td>${order.status}</td>
                    <td><ul>${itemsList}</ul></td>
                    <td>
                        <button class="approve-btn" onclick="approveOrder(${order.id})">Approve</button>
                        <button class="delete-btn" onclick="deleteOrder(${order.id})">Delete</button>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table>`;
        tableContainer.innerHTML = html;

    } catch (err) {
        console.error(err);
    }
}

async function approveOrder(id) {
    if (!confirm("Approve this order?")) return;

    await fetch(`${apiBase}/orders/${id}/approve`, { method: "PUT" });
    loadOrders();
}

async function deleteOrder(id) {
    if (!confirm("Are you sure you want to delete this order?")) return;

    await fetch(`${apiBase}/orders/${id}`, { method: "DELETE" });
    loadOrders();
}

loadOrders();
