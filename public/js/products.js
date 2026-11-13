(async function () {
  const { CATEGORIES, fetchProducts, productCard, bindProducts, skeletons, esc } = Shop;

  const grid = document.getElementById("grid");
  const chipsEl = document.getElementById("chips");
  const countEl = document.getElementById("count");
  const searchEl = document.getElementById("search");
  const sortEl = document.getElementById("sort");

  const params = new URLSearchParams(location.search);
  const state = {
    category: (params.get("category") || "").toLowerCase(),
    q: params.get("q") || "",
    sort: params.get("sort") || "featured",
  };
  searchEl.value = state.q;
  sortEl.value = ["featured", "price-asc", "price-desc", "name"].includes(state.sort) ? state.sort : "featured";

  grid.innerHTML = skeletons(8);

  let products;
  try {
    products = await fetchProducts();
  } catch (error) {
    console.error(error);
    grid.innerHTML = '<div class="state"><h3>We could not load the products</h3><p>Please check that the server is running and refresh the page.</p></div>';
    return;
  }

  bindProducts(grid, products);

  const label = (key) => (CATEGORIES.find(([k]) => k === key) || [key, "All furniture"])[1];

  function renderChips() {
    const counts = {};
    products.forEach((p) => { const k = p.category.toLowerCase(); counts[k] = (counts[k] || 0) + 1; });
    const chip = (key, text, n) =>
      `<button type="button" class="chip${state.category === key ? " active" : ""}" data-cat="${key}" aria-pressed="${state.category === key}">${esc(text)}<small>${n}</small></button>`;
    chipsEl.innerHTML = chip("", "All", products.length) + CATEGORIES.map(([k, l]) => chip(k, l, counts[k] || 0)).join("");
  }

  function render() {
    const q = state.q.trim().toLowerCase();
    let list = products.filter((p) =>
      (!state.category || p.category.toLowerCase() === state.category) &&
      (!q || (p.name + " " + (p.description || "")).toLowerCase().includes(q)));

    const sorters = {
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      name: (a, b) => a.name.localeCompare(b.name),
      featured: (a, b) => a.id - b.id,
    };
    list = list.slice().sort(sorters[state.sort] || sorters.featured);

    document.getElementById("page-title").textContent = label(state.category);
    document.title = `${label(state.category)} | Maracaibo Furniture`;
    countEl.textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;
    renderChips();

    grid.innerHTML = list.length
      ? list.map(productCard).join("")
      : '<div class="state"><h3>No products found</h3><p>Try another category or a different search.</p></div>';

    const next = new URLSearchParams();
    if (state.category) next.set("category", state.category);
    if (state.q) next.set("q", state.q);
    if (state.sort !== "featured") next.set("sort", state.sort);
    history.replaceState(null, "", location.pathname + (next.toString() ? "?" + next : ""));
  }

  chipsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    state.category = btn.dataset.cat;
    render();
  });
  searchEl.addEventListener("input", () => { state.q = searchEl.value; render(); });
  sortEl.addEventListener("change", () => { state.sort = sortEl.value; render(); });

  render();
})();
