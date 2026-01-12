document.addEventListener("DOMContentLoaded", () => {

  ////////////// SAVE SUGAR COOKIE BOX CHECKBOX RADIO NUMBER TEXT
  document.querySelectorAll("input[type='checkbox'], input[type='number'], input[type='text'], input[type='radio']").forEach(input => {
    let key;

    if (input.type === "checkbox") {
      key = `sugar-checkbox-${input.name}-${input.value}`;
    } else if (input.type === "radio") {
      key = `sugar-radio-${input.name}-${input.value}`;
    } else {
      const parentLabel = input.closest("label");
      if (parentLabel) {
        const checkbox = parentLabel.querySelector("input[type='checkbox']");
        if (checkbox) {
          key = `sugar-${checkbox.name}-${checkbox.value}-${input.type}`;
        } else {
          key = `sugar-${input.name}-${input.type}`;
        }
      } else {
        key = `sugar-${input.name}-${input.type}`;
      }
    }

    const saved = localStorage.getItem(key);
    if (saved !== null) {
      if (input.type === "checkbox" || input.type === "radio") input.checked = saved === "true";
      else input.value = saved;
    }

    if (input.type === "checkbox" || input.type === "radio") {
      input.addEventListener("change", () => {
        localStorage.setItem(key, input.checked);
      });
    } else {
      input.addEventListener("input", () => {
        localStorage.setItem(key, input.value);
      });
    }
  });

  //////////////// SAVE SUGAR COOKIE BOX SIZE AND PRICE
  document.querySelectorAll("input[name='cookiebox']").forEach(radio => {
    const savedSize = localStorage.getItem("sugarBoxSize");
    if (savedSize && radio.dataset.size === savedSize) radio.checked = true;

    radio.addEventListener("change", () => {
      localStorage.setItem("sugarBoxSize", radio.dataset.size);
      localStorage.setItem("sugarBoxPrice", radio.dataset.price);

      const msg = document.getElementById("summaryMsg");
      if (msg) msg.textContent = `You're building a ${radio.dataset.size}-box! Make sure your selections match your box size*`;
    });
  });

  /////////// SHOW MESSAGE TAILORED TO CHOSEN BOX SIZE ON EVERY PAGE
  const msg = document.getElementById("summaryMsg");
  if (msg) {
    const savedSize = localStorage.getItem("sugarBoxSize");
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

  ///////////// LET'S ORDER BTN
  const orderBtn = document.getElementById("letsOrderBtn");
  if (orderBtn) {
    orderBtn.addEventListener("click", event => {
      event.preventDefault();

      const size = localStorage.getItem("sugarBoxSize");

      const popup = document.getElementById("popup");
      const popupMessage = document.getElementById("popup-message");
      const closeBtn = document.getElementById("closePopup");
      const overlay = document.getElementById("overlay");

      function showPopup(msg, redirect = null) {
        popupMessage.textContent = msg;
        popup.style.display = "flex";
        overlay.style.display = "block";

        closeBtn.onclick = () => {
          popup.style.display = "none";
          overlay.style.display = "none";
          if (redirect) window.location.href = redirect;
        };
      }


      //////////////////////// POPUP: NO BOX SIZE SELECTED
      if (!size) {
        showPopup("Please select a sugar cookie box size!");
        return;
      }

      //////////////////////// POPUP: NO SUGAR FLAVOURS SELECTED
      const selectedFlavours = Object.keys(localStorage).filter(key =>
        key.startsWith("sugar-checkbox-sugar-") && localStorage.getItem(key) === "true"
      );

      if (selectedFlavours.length === 0) {
        showPopup("Please select at least one sugar cookie flavour!");
        return;
      }

      //////////////////////// POPUP: NO THEME SELECTED
      const selectedTheme = document.querySelector("input[name='theme']:checked");
      if (!selectedTheme) {
        showPopup("Please select a theme option!");
        return;
      }

      //////////////////////// POPUP: NO DESIGN SELECTED
      const selectedDesign = document.querySelector("input[name='design']:checked");
      if (!selectedDesign) {
        showPopup("Please select a design option!");
        return;
      }

        //////////////////////// POPUP: EMPTY TEXT INPUTS 
        const themeDetails = document.querySelector("input[name='theme-details']");
        const designDescription = document.querySelector("input[name='design-description']");

        if (!themeDetails.value.trim() || !designDescription.value.trim()) {
        showPopup("Please fill in all description boxes and don't forget to double check!");
        return;
        }


      //////////////////// ORDER READY POPUP
      showPopup(`Your sugar cookie box is ready! Let’s bring you closer to enjoying dreamy delights.`);

      closeBtn.onclick = () => {
        popup.style.display = "none";
        overlay.style.display = "none";

        //////////////////// SAVE ORDER (MULTIPLE BOXES)
        const sugarBoxes = JSON.parse(localStorage.getItem("sugarBoxes")) || [];

        sugarBoxes.push({
          size: size,
          price: parseFloat(localStorage.getItem("sugarBoxPrice")),
          flavours: selectedFlavours,
          theme: selectedTheme.value,
          design: selectedDesign.value,
          themeDetails: document.querySelector("input[name='theme-details']").value || "",
          designDescription: document.querySelector("input[name='design-description']").value || ""
        });

        localStorage.setItem("sugarBoxes", JSON.stringify(sugarBoxes));

        window.location.href = "checkout.html";
      };
    });
  }

});
