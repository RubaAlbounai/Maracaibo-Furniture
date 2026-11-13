/* Maracaibo Furniture - shared storefront code: cart, layout, product cards, helpers. */
(function () {
  "use strict";

  const CART_KEY = "cart";
  const CATEGORIES = [
    ["sofas", "Sofas"],
    ["beds", "Beds"],
    ["chairs", "Chairs"],
    ["tables", "Tables"],
    ["accessories", "Accessories"],
  ];

  const esc = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const money = (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(Number(n) || 0);

  const PLACEHOLDER =
    "data:image/svg+xml;utf8," +
    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="#f1ede6"/><text x="200" y="210" font-family="sans-serif" font-size="20" text-anchor="middle" fill="#9a948a">No image</text></svg>');

  const imgUrl = (path) => (path ? "/" + String(path).replace(/^\/+/, "") : PLACEHOLDER);

  /* ---------------- Cart (localStorage) ---------------- */
  const Cart = {
    items() {
      try {
        const data = JSON.parse(localStorage.getItem(CART_KEY));
        return Array.isArray(data) ? data.filter((i) => i && typeof i === "object" && i.id) : [];
      } catch (e) {
        return [];
      }
    },
    save(items) {
      try {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
      } catch (e) { /* storage unavailable: cart just won't persist */ }
      window.dispatchEvent(new Event("cart:changed"));
    },
    add(product, qty = 1) {
      const items = this.items();
      const stock = Number(product.stock);
      const line = items.find((i) => Number(i.id) === Number(product.id));
      const current = line ? Number(line.quantity) || 1 : 0;
      let next = current + qty;
      let message = "Added to your cart";

      if (Number.isFinite(stock) && next > stock) {
        next = stock;
        message = `Only ${stock} in stock`;
      }
      if (next <= current && current > 0) return { ok: false, message };

      if (line) {
        line.quantity = next;
        line.stock = stock;
      } else {
        items.push({ id: product.id, name: product.name, price: Number(product.price), image: product.image, stock, quantity: next });
      }
      this.save(items);
      return { ok: true, message };
    },
    setQty(id, qty) {
      const items = this.items();
      const line = items.find((i) => Number(i.id) === Number(id));
      if (!line) return;
      const max = Number.isFinite(Number(line.stock)) && Number(line.stock) > 0 ? Number(line.stock) : 99;
      line.quantity = Math.max(1, Math.min(max, qty));
      this.save(items);
    },
    remove(id) {
      this.save(this.items().filter((i) => Number(i.id) !== Number(id)));
    },
    clear() {
      this.save([]);
    },
    count() {
      return this.items().reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);
    },
    total() {
      return this.items().reduce((sum, i) => sum + Number(i.price) * (Number(i.quantity) || 1), 0);
    },
    /** Refresh names, prices and stock from the API and drop items that no longer exist. */
    sync(products) {
      const byId = new Map(products.map((p) => [Number(p.id), p]));
      const before = this.items();
      const after = [];
      before.forEach((item) => {
        const p = byId.get(Number(item.id));
        if (!p || Number(p.stock) < 1) return;
        after.push({
          id: p.id, name: p.name, price: Number(p.price), image: p.image, stock: Number(p.stock),
          quantity: Math.min(Number(item.quantity) || 1, Number(p.stock)),
        });
      });
      this.save(after);
      return before.length - after.length; // how many lines were removed
    },
  };

  /* ---------------- API ---------------- */
  async function fetchProducts() {
    const response = await fetch("/api/products", { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Request failed: " + response.status);
    return response.json();
  }

  /* ---------------- Toast ---------------- */
  let toastTimer;
  function toast(message) {
    let el = document.getElementById("toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      el.setAttribute("role", "status");
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
  }

  /* ---------------- Layout ---------------- */
  const ICON_CART =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 6h15l-1.6 9H7.6L6 6Zm0 0L5.3 3H2"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>';
  const ICON_MENU =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';

  function renderLayout() {
    const page = document.body.dataset.page || "";
    const params = new URLSearchParams(location.search);
    const activeCategory = (params.get("category") || "").toLowerCase();

    const link = (href, label, isActive) =>
      `<a href="${href}"${isActive ? ' class="active" aria-current="page"' : ""}>${label}</a>`;

    const navLinks =
      link("/index.html", "Home", page === "home") +
      link("/products.html", "Shop", page === "shop" && !activeCategory) +
      CATEGORIES.map(([key, label]) => link(`/products.html?category=${key}`, label, page === "shop" && activeCategory === key)).join("") +
      link("/contact.html", "Contact", page === "contact");

    const header = document.getElementById("site-header");
    if (header) {
      header.outerHTML = `
        <header class="site-header">
          <div class="container nav">
            <a class="brand" href="/index.html" aria-label="Maracaibo Furniture, home"><span>Maracaibo</span> Furniture</a>
            <nav id="site-nav" class="nav-links" aria-label="Main">${navLinks}</nav>
            <div class="nav-actions">
              <a class="cart-link" href="/cart.html" aria-label="Shopping cart">${ICON_CART}<span class="cart-badge" id="cart-badge" hidden>0</span></a>
              <button class="menu-toggle" id="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav">${ICON_MENU}</button>
            </div>
          </div>
        </header>`;
    }

    const footer = document.getElementById("site-footer");
    if (footer) {
      footer.outerHTML = `
        <footer class="site-footer">
          <div class="container footer-grid">
            <div>
              <h4>Maracaibo Furniture</h4>
              <p>Quality furniture for every room, at honest prices. Browse the collection and order online.</p>
            </div>
            <div>
              <h4>Shop</h4>
              <ul>${CATEGORIES.map(([key, label]) => `<li><a href="/products.html?category=${key}">${label}</a></li>`).join("")}</ul>
            </div>
            <div>
              <h4>Help</h4>
              <ul>
                <li><a href="/cart.html">Your cart</a></li>
                <li><a href="/contact.html">Contact us</a></li>
                <li><a href="mailto:maracaibo@gmail.com">maracaibo@gmail.com</a></li>
              </ul>
            </div>
          </div>
          <div class="container footer-bottom">&copy; ${new Date().getFullYear()} Maracaibo Furniture</div>
        </footer>`;
    }

    const toggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("site-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }

    updateBadge();
  }

  function updateBadge() {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;
    const count = Cart.count();
    badge.textContent = count > 99 ? "99+" : String(count);
    badge.hidden = count === 0;
  }
  window.addEventListener("cart:changed", updateBadge);
  window.addEventListener("storage", updateBadge);

  /* ---------------- Product card + lightbox ---------------- */
  function productCard(p) {
    const stock = Number(p.stock);
    const out = stock < 1;
    const badge = out
      ? '<span class="badge out">Sold out</span>'
      : stock <= 3
        ? `<span class="badge low">Only ${stock} left</span>`
        : "";
    return `
      <article class="card" data-id="${esc(p.id)}">
        <button class="card-media" type="button" data-zoom="${esc(p.id)}" aria-label="View larger image of ${esc(p.name)}">
          <img src="${esc(imgUrl(p.image))}" alt="${esc(p.name)}" loading="lazy" width="400" height="400">
          ${badge}
        </button>
        <div class="card-body">
          <span class="card-cat">${esc(p.category)}</span>
          <h3 class="card-title">${esc(p.name)}</h3>
          <p class="card-desc">${esc(p.description || "")}</p>
          <div class="card-foot">
            <span class="price">${money(p.price)}</span>
            <button class="btn btn-primary btn-add" type="button" data-add="${esc(p.id)}"${out ? " disabled" : ""}>${out ? "Sold out" : "Add to cart"}</button>
          </div>
        </div>
      </article>`;
  }

  /** Wire "add to cart" and "zoom" buttons inside a container. */
  function bindProducts(container, products) {
    const byId = new Map(products.map((p) => [Number(p.id), p]));

    container.addEventListener("click", (event) => {
      const addBtn = event.target.closest("[data-add]");
      if (addBtn) {
        const product = byId.get(Number(addBtn.dataset.add));
        if (product) toast(Cart.add(product).message);
        return;
      }
      const zoomBtn = event.target.closest("[data-zoom]");
      if (zoomBtn) {
        const product = byId.get(Number(zoomBtn.dataset.zoom));
        if (product) openLightbox(product);
      }
    });
  }

  function openLightbox(product) {
    let box = document.getElementById("lightbox");
    if (!box) {
      box = document.createElement("div");
      box.id = "lightbox";
      box.className = "lightbox";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-modal", "true");
      box.innerHTML =
        '<button class="lightbox-close" type="button" aria-label="Close">&times;</button><figure><img alt=""><figcaption></figcaption></figure>';
      document.body.appendChild(box);
      const close = () => box.classList.remove("open");
      box.addEventListener("click", (e) => { if (e.target === box || e.target.closest(".lightbox-close")) close(); });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    }
    const img = box.querySelector("img");
    img.src = imgUrl(product.image);
    img.alt = product.name;
    box.querySelector("figcaption").textContent = `${product.name} - ${money(product.price)}`;
    box.classList.add("open");
  }

  function skeletons(count = 8) {
    return Array.from({ length: count }, () => '<div class="skeleton" aria-hidden="true"></div>').join("");
  }

  window.Shop = { CATEGORIES, Cart, esc, money, imgUrl, fetchProducts, toast, productCard, bindProducts, skeletons };
  document.addEventListener("DOMContentLoaded", renderLayout);
})();
