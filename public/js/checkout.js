(async function () {
  const { Cart, money, imgUrl, esc, toast, fetchProducts } = Shop;
  const root = document.getElementById("checkout-root");

  function renderEmpty() {
    root.style.gridTemplateColumns = "1fr";
    root.innerHTML = `
      <div class="panel state" style="padding:56px 20px">
        <h3>Your cart is empty</h3>
        <p>Add something to your cart before checking out.</p>
        <a class="btn btn-primary" href="/products.html">Browse products</a>
      </div>`;
  }

  function render() {
    const items = Cart.items();
    if (!items.length) return renderEmpty();
    root.style.gridTemplateColumns = "";

    root.innerHTML = `
      <form class="panel" id="order-form" novalidate>
        <h2>Delivery details</h2>
        <div class="form-grid">
          <div class="form-error" id="form-error" role="alert"></div>
          <label>Full name<input id="name" name="name" type="text" autocomplete="name" required maxlength="255"></label>
          <label>Email<input id="email" name="email" type="email" autocomplete="email" required maxlength="255"></label>
          <label>Delivery address<textarea id="address" name="address" rows="3" autocomplete="street-address" required maxlength="500"></textarea></label>
          <button class="btn btn-wood btn-block" id="submit" type="submit">Place order</button>
          <p class="note" style="margin:0">Your order is reviewed and confirmed by our team. You will be contacted at the email above.</p>
        </div>
      </form>
      <aside class="panel">
        <h2>Order summary</h2>
        ${items.map((i) => `
          <div class="mini-item">
            <img src="${esc(imgUrl(i.image))}" alt="">
            <div class="grow">${esc(i.name)}<small>Qty ${Number(i.quantity) || 1}</small></div>
            <strong>${money(i.price * (Number(i.quantity) || 1))}</strong>
          </div>`).join("")}
        <div class="summary-row total"><span>Total</span><span>${money(Cart.total())}</span></div>
        <a class="link-btn" href="/cart.html" style="display:inline-block;margin-top:12px">Edit cart</a>
      </aside>`;

    document.getElementById("order-form").addEventListener("submit", submit);
  }

  function showError(message) {
    const el = document.getElementById("form-error");
    el.textContent = message;
    el.classList.add("show");
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function submit(event) {
    event.preventDefault();
    const items = Cart.items();
    const button = document.getElementById("submit");
    document.getElementById("form-error").classList.remove("show");

    const payload = {
      customer_name: document.getElementById("name").value.trim(),
      customer_email: document.getElementById("email").value.trim(),
      address: document.getElementById("address").value.trim(),
      // Prices are NOT sent: the server reads them from the database.
      items: items.map((i) => ({ id: Number(i.id), quantity: Number(i.quantity) || 1 })),
    };

    if (!payload.customer_name || !payload.customer_email || !payload.address) {
      return showError("Please fill in your name, email and address.");
    }

    button.disabled = true;
    button.textContent = "Placing your order...";

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        Cart.clear();
        return renderSuccess(data.order);
      }

      const firstError = data.errors ? Object.values(data.errors).flat()[0] : null;
      showError(firstError || data.message || "We could not place your order. Please try again.");
    } catch (error) {
      console.error(error);
      showError("Connection problem. Please check your internet and try again.");
    }

    button.disabled = false;
    button.textContent = "Place order";
  }

  function renderSuccess(order) {
    root.style.gridTemplateColumns = "1fr";
    root.innerHTML = `
      <div class="panel success">
        <div class="check" aria-hidden="true">&#10003;</div>
        <h2>Thank you, your order is in!</h2>
        <p>Order <strong>#${esc(order && order.id)}</strong> for <strong>${money(order && order.total_price)}</strong> has been received. Our team will review it and contact you by email.</p>
        <a class="btn btn-primary" href="/products.html">Continue shopping</a>
      </div>`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  render();

  // Refresh prices/stock before the customer pays.
  try {
    const snapshot = JSON.stringify(Cart.items());
    const removed = Cart.sync(await fetchProducts());
    if (removed > 0) toast("Some items are no longer available and were removed");
    // Re-render only if something changed, so a customer who is already typing keeps their input.
    if (JSON.stringify(Cart.items()) !== snapshot) render();
  } catch (error) {
    console.error(error);
  }
})();
