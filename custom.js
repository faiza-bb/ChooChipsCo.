document.addEventListener("DOMContentLoaded", () => {

  ////////////////////////// SAVE INPUTS TO LOCAL STORAGE
  document.querySelectorAll("input[type='checkbox'], input[type='number'], input[type='text']").forEach(input => {
    let key;

    if (input.type === "checkbox") {
      key = `input-checkbox-${input.name}-${input.value}`;
    } else {
      const parentLabel = input.closest("label");
      if (parentLabel) {
        const checkbox = parentLabel.querySelector("input[type='checkbox']");
        if (checkbox) {
          key = `input-${checkbox.name}-${checkbox.value}-${input.type}`;
        } else {
          key = `input-${input.name}-${input.type}`;
        }
      } else {
        key = `input-${input.name}-${input.type}`;
      }
    }

    const saved = localStorage.getItem(key);
    if (saved !== null) {
      if (input.type === "checkbox") input.checked = saved === "true";
      else input.value = saved;
    }

    if (input.type === "checkbox") {
      input.addEventListener("change", () => {
        localStorage.setItem(key, input.checked);
      });
    } else {
      input.addEventListener("input", () => {
        localStorage.setItem(key, input.value);
      });
    }
  });

  //////////////////////// SAVE SELECTED SIZE AND PRICE IN LOCAL STORAGE
  document.querySelectorAll("input[name='cookiebox']").forEach(radio => {
    const savedSize = localStorage.getItem("boxSize");
    if (savedSize && radio.dataset.size === savedSize) radio.checked = true;

    radio.addEventListener("change", () => {
      localStorage.setItem("boxSize", radio.dataset.size);
      localStorage.setItem("boxPrice", radio.dataset.price);
      sessionStorage.setItem("boxSelectedThisSession", "true");

      const msg = document.getElementById("summaryMsg");
      if (msg) msg.textContent = `You're building a ${radio.dataset.size}-box! Make sure your selections match your box size*`;
    });
  });

  /////////// SHOW MESSAGE TAILORED TO CHOSEN BOX SIZE ON EVERY PAGE
  const msg = document.getElementById("summaryMsg");
  if (msg) {
    const savedSize = localStorage.getItem("boxSize");
    msg.textContent = savedSize
      ? `You're building a ${savedSize}-box! Make sure your selections match your box size*`
      : `You're building a ?-box! Make sure your selections match your box size*`;

    msg.style.position = "absolute";
    msg.style.top = "-30px";
    msg.style.left = "50%";
    msg.style.transform = "translateX(-50%)";
    msg.style.background = "rgba(255,255,255,0.8)";
    msg.style.padding = "5px 10px";
    msg.style.borderRadius = "8px";
    msg.style.fontStyle = "italic";
    msg.style.color = "#5a3e2b";
    msg.style.textAlign = "center";
    msg.style.zIndex = "10";
  }

  //////////////////////// RESET FUNCTION 
  function resetBuilder() {
    localStorage.removeItem("boxSize");
    localStorage.removeItem("boxPrice");
    sessionStorage.removeItem("boxSelectedThisSession");

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("input-") || key.startsWith("input-checkbox-")) localStorage.removeItem(key);
    });

    if (msg) msg.textContent = `You're building a ?-box! Make sure your selections match your box size*`;

    document.querySelectorAll("form").forEach(form => {
      form.querySelectorAll("input").forEach(input => {
        if (input.type === "checkbox") input.checked = false;
        else if (input.type === "number") input.value = 0;
        else if (input.type === "text") input.value = "";
      });
    });

    document.querySelectorAll("input[name='cookiebox']").forEach(radio => radio.checked = false);
  }

  /////////////////////  LET'S ORDER BTN
  const orderBtn = document.getElementById("letsOrderBtn");
  if (orderBtn) {
    orderBtn.addEventListener("click", event => {
      event.preventDefault();

      const size = localStorage.getItem("boxSize");
      const selectedDough = Object.keys(localStorage).filter(key =>
        key.startsWith("input-checkbox-dough-") && localStorage.getItem(key) === "true"
      );
      const popup = document.getElementById("popup");
      const popupMessage = document.getElementById("popup-message");
      const closeBtn = document.getElementById("closePopup");
      const overlay = document.getElementById("overlay");

     // CHECK IF ANY COOKIE BOX SIZE IS SELECTED
      if (!size) {
        if (popup && popupMessage && closeBtn && overlay) {
          popupMessage.textContent = "Please select a cookie box first!";
          popup.style.display = "flex";
          overlay.style.display = "block";

          closeBtn.onclick = () => {
            popup.style.display = "none";
            overlay.style.display = "none";
            window.location.href = "dough.html";
          };
        }
        return;
      }

      // CHECK IF ANY DOUGH IS SELECTED
      if (selectedDough.length === 0) {
        if (popup && popupMessage && closeBtn && overlay) {
          popupMessage.innerHTML = "Please select dough flavours to purchase!";
          popup.style.display = "flex";
          overlay.style.display = "block";

          closeBtn.onclick = () => {
            popup.style.display = "none";
            overlay.style.display = "none";
            window.location.href = "dough.html";
          };
        }
        return;
      }

      // Order Ready POPUP
      if (popup && popupMessage && closeBtn && overlay) {
        popupMessage.textContent = `Your custom ${size}-box is ready! Let’s bring you closer to enjoying dreamy delights.`;
        popup.style.display = "flex";
        overlay.style.display = "block";

        closeBtn.onclick = () => {
          popup.style.display = "none";
          overlay.style.display = "none";

          const size = localStorage.getItem("boxSize");
          const price = localStorage.getItem("boxPrice");

          // Allow multi box adding to checkout
          const boxes = JSON.parse(localStorage.getItem("customBoxes")) || [];
          boxes.push({
            size: size,
            price: parseFloat(price)
          });
          localStorage.setItem("customBoxes", JSON.stringify(boxes));

          window.location.href = "checkout.html";
        };
      }
    });
  }

});
