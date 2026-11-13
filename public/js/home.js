(async function () {
  const { CATEGORIES, fetchProducts, productCard, bindProducts, skeletons, esc } = Shop;

  const tileImages = {
    sofas: "furniture/assets/images/sofas/sofa3.jpg",
    beds: "furniture/assets/images/beds/bed3.jpg",
    chairs: "furniture/assets/images/chairs/chair4.jpg",
    tables: "furniture/assets/images/tables/table4.jpg",
    accessories: "furniture/assets/images/accessories/accessories5.jpg",
  };

  const tiles = document.getElementById("tiles");
  const featured = document.getElementById("featured");

  // The tiles do not need the API, so show them straight away.
  tiles.innerHTML = CATEGORIES.map(([key, label]) => `
    <a class="tile" href="/products.html?category=${key}" data-cat="${key}">
      <img src="/${tileImages[key]}" alt="${esc(label)}" loading="lazy">
      <div class="tile-label"><h3>${esc(label)}</h3><span class="tile-count"></span></div>
    </a>`).join("");

  featured.innerHTML = Shop.skeletons(4);

  try {
    const products = await fetchProducts();

    CATEGORIES.forEach(([key]) => {
      const n = products.filter((p) => p.category.toLowerCase() === key).length;
      const el = tiles.querySelector(`[data-cat="${key}"] .tile-count`);
      if (el) el.textContent = `${n} product${n === 1 ? "" : "s"}`;
    });

    // One product from each category, then a second from the first three.
    const byCat = (key, i) => products.filter((p) => p.category.toLowerCase() === key)[i];
    const picks = [
      ...CATEGORIES.map(([key]) => byCat(key, 3 % Math.max(1, products.filter((p) => p.category.toLowerCase() === key).length))),
      byCat("sofas", 4), byCat("beds", 4), byCat("tables", 2),
    ].filter(Boolean);

    featured.innerHTML = picks.map(productCard).join("");
    bindProducts(featured, products);
  } catch (error) {
    console.error(error);
    featured.innerHTML = '<div class="state"><h3>We could not load the products</h3><p>Please check that the server is running and refresh the page.</p></div>';
  }
})();
