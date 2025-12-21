// public/js/orders.js
(function() {
    const apiBase = "/api";

    async function loadOrders() {
        try {
            const res = await fetch(`${apiBase}/orders`);
            const orders = await res.json();
            const container = document.getElementById('orders-container');
            if (!container) return;

            if (!orders.length) {
                container.innerHTML = '<p>No orders yet.</p>';
                return;
            }

            container.innerHTML = orders.map(o => `
                <div class="card">
                    <h3>Order #${o.id}</h3>
                    <p>Product: ${escapeHtml(o.product?.name || '—')}</p>
                    <p>Quantity: ${o.quantity}</p>
                    <p>Total Price: $${Number(o.total_price).toFixed(2)}</p>
                    <p>Customer: ${escapeHtml(o.customer_name || '—')}</p>
                </div>
            `).join('');
        } catch (err) {
            console.error(err);
            document.getElementById('orders-container').innerHTML = '<p>Unable to load orders.</p>';
        }
    }

    function escapeHtml(text) {
        return String(text)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
    }

    loadOrders();
})();
