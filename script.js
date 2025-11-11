document.addEventListener('DOMContentLoaded', () => {
  const products = [
    { id: 1, name: "Product 1", price: 299.90 },
    { id: 2, name: "Product 2", price: 999.90 },
    { id: 3, name: "Product 3", price: 799.90 },
  ];

  // tolerant selection: support both "product_list" and "product-list"
  const productList = document.getElementById("product_list") || document.getElementById("product-list");
  const cartItems = document.getElementById("cart-items");
  // try to find an explicit empty-cart element, otherwise create/identify one inside cartItems
  let emptyCartMessage = document.getElementById("empty-cart");
  if (!emptyCartMessage) {
    // if there's a <p> inside cart-items, treat it as the empty message (covers your original HTML)
    emptyCartMessage = cartItems ? cartItems.querySelector("p") : null;
    if (!emptyCartMessage && cartItems) {
      emptyCartMessage = document.createElement("p");
      emptyCartMessage.id = "empty-cart";
      emptyCartMessage.textContent = "Your cart is empty.";
      cartItems.appendChild(emptyCartMessage);
    }
  }

  const cartTotalContainer = document.getElementById("cart-total") || document.querySelector("#cart-total");
  const totalPriceDisplay = document.getElementById("total-price");
  const checkOutBtn = document.getElementById("checkout-btn");

  const cart = [];

  // render product rows
  products.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.innerHTML = `
      <div class="label">${product.name} - $${product.price.toFixed(2)}</div>
      <button data-id="${product.id}" type="button">Add to Cart</button>
    `;
    productList.appendChild(productDiv);
  });

  // handle add-to-cart clicks (event delegation)
  productList.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const productId = parseInt(e.target.getAttribute("data-id"), 10);
      const product = products.find(p => p.id === productId);
      if (product) addToCart(product);
    }
  });

  function addToCart(product) {
    // push a shallow copy so later modifications won't affect original product objects
    cart.push({ ...product });
    renderCart();
  }

  function renderCart() {
    // clear previous list contents but keep the emptyCartMessage element (we toggle it)
    if (!cartItems) return;
    // remove all children except the emptyCartMessage (if it's inside)
    Array.from(cartItems.children).forEach(child => {
      if (child !== emptyCartMessage) child.remove();
    });

    let totalPrice = 0;

    if (cart.length > 0) {
      if (emptyCartMessage) emptyCartMessage.classList.add("hidden");
      if (cartTotalContainer) cartTotalContainer.classList.remove("hidden");

      cart.forEach((item, index) => {
        totalPrice += item.price;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <span class="label">${item.name}</span>
          <span class="price">$${item.price.toFixed(2)}</span>
        `;
        cartItems.appendChild(cartItem);
      });

      // show formatted total with $ and two decimals
      if (totalPriceDisplay) totalPriceDisplay.textContent = `$${totalPrice.toFixed(2)}`;
    } else {
      // empty cart
      if (emptyCartMessage) {
        emptyCartMessage.classList.remove("hidden");
        emptyCartMessage.textContent = "Your cart is empty.";
      }
      if (cartTotalContainer) cartTotalContainer.classList.add("hidden");
      if (totalPriceDisplay) totalPriceDisplay.textContent = `$0.00`;
    }
  }

  // checkout button
  if (checkOutBtn) {
    checkOutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
      }
      // example behavior: clear cart and show success
      cart.length = 0;
      renderCart();
      alert("Checkout successful!");
    });
  }

  // initial render (in case cart is empty)
  renderCart();
});
