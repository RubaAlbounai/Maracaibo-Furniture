const API = "http://localhost:8000/api";

// Redirect if admin not logged in
const adminToken = localStorage.getItem("admin_token");
if (!adminToken) {
    window.location.href = "C:\Users\HP\ecommerce-backend\public\admin\login.html";
}

// Headers for authenticated admin API calls
const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + adminToken
};

// Load dashboard data
async function loadDashboard() {
    try {

        // 1) Get Products
        const productRes = await fetch(`${API}/products`, { headers });
        const products = await productRes.json();
        document.getElementById("total-products").innerText = products.length;

        // 2) Get Orders
        const ordersRes = await fetch(`${API}/orders`, { headers });
        const orders = await ordersRes.json();
        document.getElementById("total-orders").innerText = orders.length;

        // 3) Pending orders count
        const pending = orders.filter(o => o.status === "pending").length;
        document.getElementById("pending-orders").innerText = pending;

        // 4) Completed orders
        const completed = orders.filter(o => o.status === "approved").length;
        document.getElementById("completed-orders").innerText = completed;

        // 5) Calculate total revenue
        let revenue = 0;
        orders.forEach(order => {
            if (order.status === "approved") {
                revenue += order.total_price;
            }
        });
        document.getElementById("total-revenue").innerText = revenue + " USD";

    } catch (error) {
        console.error("Dashboard error:", error);
    }
}

// Logout function
function logout() {
    localStorage.removeItem("admin_token");
    window.location.href = "C:\Users\HP\ecommerce-backend\public\admin\login.html";
}

// Run
loadDashboard();
