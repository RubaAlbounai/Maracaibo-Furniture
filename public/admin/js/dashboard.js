requireAdmin();

async function loadDashboard() {
  try {
    const res = await adminFetch("/admin/dashboard-stats");
    const stats = await res.json();

    document.getElementById("total-products").innerText = stats.total_products;
    document.getElementById("total-orders").innerText = stats.total_orders;
    document.getElementById("pending-orders").innerText = stats.pending_orders;
    document.getElementById("completed-orders").innerText = stats.completed_orders;
    document.getElementById("total-revenue").innerText = stats.total_revenue + " USD";
  } catch (error) {
    console.error("Dashboard error:", error);
  }
}

async function logout() {
  try {
    await adminFetch("/admin/logout", { method: "POST" });
  } catch (e) {
    // token already invalid: nothing to revoke
  }
  localStorage.removeItem("admin_token");
  window.location.href = "/admin/login.html";
}

loadDashboard();
