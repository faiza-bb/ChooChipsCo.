
// custom.html Review Slideshow
  const slides2 = document.querySelectorAll('.review-slide');
  let currentSlide = 0;

  function showSlide(index) {
    slides2.forEach(slide => slide.classList.remove('active'));

    requestAnimationFrame(() => {
      slides2[index].classList.add('active');
    });
  }

  showSlide(currentSlide);

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides2.length;
    showSlide(currentSlide);
  }, 5000);

// baked.html Add to Cart Functionality
document.addEventListener("DOMContentLoaded", () => {

  const minusButtons = document.querySelectorAll(".minus");
  const plusButtons = document.querySelectorAll(".plus");
  const checkoutBtn = document.querySelector(".checkout-btn");

  // Load saved quantities when page opens
  const savedOrder = JSON.parse(sessionStorage.getItem("order")) || [];

  document.querySelectorAll(".favorites-feature").forEach(cookie => {
    const name = cookie.querySelector("h1").textContent;
    const qtyEl = cookie.querySelector(".qty-number");

    const savedItem = savedOrder.find(item => item.name === name);
    if (savedItem) {
      qtyEl.textContent = savedItem.quantity;
    }
  });

  // Save the order in session storage
  function saveOrder() {
    const cookies = document.querySelectorAll(".favorites-feature");
    const order = [];

    cookies.forEach(cookie => {
      const name = cookie.querySelector("h1").textContent;
      const price = parseFloat(
        cookie.querySelector(".favorite-label").textContent.replace("$", "")
      );
      const quantity = parseInt(cookie.querySelector(".qty-number").textContent);

      if (quantity > 0) {
        order.push({ name, price, quantity });
      }
    });

    sessionStorage.setItem("order", JSON.stringify(order));
  }

  
  minusButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const number = btn.nextElementSibling;
      let value = parseInt(number.textContent);

      if (value > 0) {
        number.textContent = value - 1;
        saveOrder();
      }
    });
  });

  
  plusButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const number = btn.previousElementSibling;
      let value = parseInt(number.textContent);

      number.textContent = value + 1;
      saveOrder();
    });
  });

  
  checkoutBtn.addEventListener("click", (e) => {
    e.preventDefault();

    saveOrder();
    window.location.href = "checkout.html";
  });

});


/////////////////////////////



