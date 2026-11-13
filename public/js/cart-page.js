(async function () {
  const { Cart, money, imgUrl, esc, toast, fetchProducts } = Shop;
  const root = document.getElementById("cart-root");

  function render() {
    const items = Cart.items();
    if (!items.length) {
      root.style.gridTemplateColumns = "1fr";
      root.innerHTML = `
        <div class="panel state" style="padding:56px 20px">
          <h3>Your cart is empty</h3>
          <p>Browse the collection and add something you like.</p>
          <a class="btn btn-primary" href="/products.html">Start shopping</a>
        </div>`;
      return;
    }
    root.style.gridTemplateColumns = "";

    root.innerHTML = `
      <div class="panel">
        <h2>Items (${Cart.count()})</h2>
        ${items.map((i) => `
          <div class="cart-row" data-id="${esc(i.id)}">
            <img src="${esc(imgUrl(i.image))}" alt="${esc(i.name)}">
            <div>
              <h3>${esc(i.name)}</h3>
              <div class="unit">${money(i.price)} each</div>
              <div class="cart-controls">
                <div class="qty" role="group" aria-label="Quantity for ${esc(i.name)}">
                  <button type="button" data-dec aria-label="Decrease quantity">&minus;</button>
                  <span>${Number(i.quantity) || 1}</span>
                  <button type="button" data-inc aria-label="Increase quantity">+</button>
                </div>
                <button type="button" class="link-btn" data-remove>Remove</button>
              </div>
            </div>
            <div class="cart-line-total">${money(i.price * (Number(i.quantity) || 1))}</div>
          </div>`).join("")}
      </div>
      <aside class="panel">
        <h2>Order summary</h2>
        <div class="summary-row"><span>Subtotal</span><span>${money(Cart.total())}</span></div>
        <div class="summary-row total"><span>Total</span><span>${money(Cart.total())}</span></div>
        <p class="note">Your order is reviewed and confirmed by our team after you place it.</p>
        <a class="btn btn-wood btn-block" href="/checkout.html" style="margin-top:18px">Continue to checkout</a>
        <a class="btn btn-ghost btn-block" href="/products.html" style="margin-top:10px">Keep shopping</a>
      </aside>`;
  }

  root.addEventListener("click", (e) => {
    const row = e.target.closest(".cart-row");
    if (!row) return;
    const id = Number(row.dataset.id);
    const line = Cart.items().find((i) => Number(i.id) === id);
    if (!line) return;
    if (e.target.closest("[data-inc]")) {
      const before = Number(line.quantity) || 1;
      Cart.setQty(id, before + 1);
      if ((Cart.items().find((i) => Number(i.id) === id).quantity) === before) toast("That is all we have in stock");
    }
    if (e.target.closest("[data-dec]")) Cart.setQty(id, (Number(line.quantity) || 1) - 1);
    if (e.target.closest("[data-remove]")) Cart.remove(id);
    render();
  });

  render();

  // Refresh prices/stock from the server, dropping anything that no longer exists.
  try {
    const removed = Cart.sync(await fetchProducts());
    if (removed > 0) toast("Some items are no longer available and were removed");
    render();
  } catch (error) {
    console.error(error);
  }
})();
