document.addEventListener("DOMContentLoaded", () => {
  const orderContainer = document.getElementById("order-items");
  const totalPriceEl = document.getElementById("order-total");
  const checkoutForm = document.getElementById("checkoutForm");

  const deliveryRadio = document.querySelector('input[value="Delivery"]');
  const pickupRadio = document.querySelector('input[value="Pickup"]');
  const addressSection = document.getElementById("address-section");

  const popup = document.getElementById("popup");
  const overlay = document.getElementById("overlay");
  const closePopup = document.getElementById("closePopup");

  if (!orderContainer || !totalPriceEl || !checkoutForm) return;

  // baked stuff from session, add to checkout
  const bakedOrder = JSON.parse(sessionStorage.getItem("order")) || [];
  let total = 0;
  bakedOrder.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const row = document.createElement("div");
    row.className = "order-item";
    row.innerHTML = `
      <span>${item.name} x ${item.quantity}</span>
      <span>$${itemTotal.toFixed(2)}</span>
    `;
    orderContainer.appendChild(row);
  });

  // add multi boxes to checkout
  const customBoxes = JSON.parse(localStorage.getItem("customBoxes")) || [];

  customBoxes.forEach(box => {
    const customDiv = document.createElement("div");
    customDiv.className = "order-item custom-box";
    customDiv.innerHTML = `
      <span>Custom ${box.size} Box</span>
      <span>$${box.price.toFixed(2)}</span>
    `;
    orderContainer.appendChild(customDiv);

    total += box.price;
  });


  // add multi sugar cookies boxes to checkout
  const sugarBoxes = JSON.parse(localStorage.getItem("sugarBoxes")) || [];

  sugarBoxes.forEach(box => {
    const sugarDiv = document.createElement("div");
    sugarDiv.className = "order-item sugar-box";
    sugarDiv.innerHTML = `
      <span>Sugar Cookie Box (${box.size})</span>
      <span>$${box.price.toFixed(2)}</span>
    `;
    orderContainer.appendChild(sugarDiv);

    total += box.price;
  });


  // update total on page
  totalPriceEl.textContent = `Total: $${total.toFixed(2)}`;

  // toggle address field if delivery
  function toggleAddress() {
    if (deliveryRadio.checked) {
      addressSection.style.display = "block";
      document.getElementById("address").setAttribute("required", "required");
    } else {
      addressSection.style.display = "none";
      document.getElementById("address").removeAttribute("required");
    }
  }
  deliveryRadio.addEventListener("change", toggleAddress);
  pickupRadio.addEventListener("change", toggleAddress);
  toggleAddress();

  //  place order button answer variations in popup
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (total <= 0) {
      document.getElementById("popup-message").innerText = "Please select cookies to purchase!";
      overlay.style.display = "block";
      popup.style.display = "flex";

      closePopup.onclick = () => {
        popup.style.display = "none";
        overlay.style.display = "none";
        window.location.href = "baked.html";
      };
      return;
    }

    if (!checkoutForm.checkValidity()) {
      checkoutForm.reportValidity();
      return;
    }

    const orderNumber = "955 646";
    const isDelivery = deliveryRadio.checked;
    const message = isDelivery
      ? `Thank you for choosing ChooChips! Your order, #${orderNumber}, has been placed and will be delivered in 15 minutes.`
      : `Thank you for choosing ChooChips! Your order, #${orderNumber}, is ready for pick up at 34 Hazelnut Lane.`;

    document.getElementById("popup-message").innerText = message;
    overlay.style.display = "block";
    popup.style.display = "flex";

    // clear everything after placing order
    sessionStorage.removeItem("order");
    localStorage.removeItem("customBoxes");
    localStorage.removeItem("sugarBoxes"); // <-- added
    localStorage.removeItem("boxSize");
    localStorage.removeItem("boxPrice");
    localStorage.removeItem("checkoutBoxSize");
    localStorage.removeItem("checkoutBoxPrice");

    closePopup.onclick = () => {
      popup.style.display = "none";
      overlay.style.display = "none";
      window.location.href = "index.html";
    };
  });
});
