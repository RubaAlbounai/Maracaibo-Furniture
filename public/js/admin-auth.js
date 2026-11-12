// Shared helpers for the admin pages.
const API_BASE = "/api";

function adminToken() {
  return localStorage.getItem("admin_token");
}

function requireAdmin() {
  if (!adminToken()) {
    window.location.href = "/admin/login.html";
  }
}

// fetch() for admin endpoints: adds the Bearer token and sends the user to the
// login page when the token is missing, expired or not an admin.
async function adminFetch(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${adminToken()}`,
      ...(options.headers || {}),
    },
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login.html";
    throw new Error("Unauthorized");
  }

  return response;
}

// Prevents HTML injection when product/customer text is placed in innerHTML.
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}
