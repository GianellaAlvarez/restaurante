document.addEventListener("DOMContentLoaded", () => {
  // 1. Navegación móvil
  const burgerBtn = document.querySelector(".burger-btn");
  const mainNav = document.getElementById("main-nav");

  if (burgerBtn && mainNav) {
    burgerBtn.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");
      burgerBtn.setAttribute("aria-expanded", String(open));
    });
  }

  // 2. Sombra en cabecera al hacer scroll + paralaje suave en Hero
  const header = document.getElementById("header");
  const parallaxEl = document.querySelector("[data-parallax]");

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      if (header) header.classList.toggle("scrolled", y > 20);
      if (parallaxEl && y < 700) {
        parallaxEl.style.transform = `translateY(${y * 0.16}px)`;
      }
    },
    { passive: true }
  );

  // 3. Animación de entrada al hacer scroll
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add("visible"), i * 65);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

  // 4. Carta interactiva: actualiza foto y ficha al pasar el ratón o hacer clic
  const menuRows = document.querySelectorAll(".menu-row");
  const previewImg = document.getElementById("preview-img");
  const previewTitle = document.getElementById("preview-title");
  const previewPrep = document.getElementById("preview-prep");
  const previewDesc = document.getElementById("preview-desc");

  const updatePreview = (row) => {
    if (!previewImg || !previewTitle || !previewPrep || !previewDesc) return;

    menuRows.forEach((r) => r.classList.remove("active"));
    row.classList.add("active");

    const nextSrc = row.getAttribute("data-img");
    if (previewImg.getAttribute("src") !== nextSrc) {
      previewImg.classList.add("switching");
      setTimeout(() => {
        previewImg.setAttribute("src", nextSrc);
        previewImg.setAttribute("alt", row.getAttribute("data-title") || "");
        previewImg.classList.remove("switching");
      }, 150);
    }

    previewTitle.textContent = row.getAttribute("data-title") || "";
    previewPrep.textContent = row.getAttribute("data-prep") || "";
    previewDesc.textContent = row.getAttribute("data-desc") || "";
  };

  menuRows.forEach((row) => {
    row.addEventListener("mouseenter", () => updatePreview(row));
    row.addEventListener("click", () => updatePreview(row));
  });

  // 5. Pestañas de filtro en carta.html
  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const group = btn.getAttribute("data-tab");
      let firstVisible = null;

      menuRows.forEach((row) => {
        const match = group === "all" || row.getAttribute("data-group") === group;
        row.style.display = match ? "block" : "none";
        if (match && !firstVisible) firstVisible = row;
      });

      if (firstVisible) updatePreview(firstVisible);
    });
  });

  // 6. Selector de ambiente y hora en reservas.html
  const zoneBtns = document.querySelectorAll(".zone-btn");
  const hiddenZone = document.getElementById("b-zone");

  zoneBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      zoneBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (hiddenZone) hiddenZone.value = btn.getAttribute("data-zone") || "";
    });
  });

  const slotBtns = document.querySelectorAll(".slot-btn");
  const hiddenTime = document.getElementById("b-time");

  slotBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      slotBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      if (hiddenTime) hiddenTime.value = btn.getAttribute("data-time") || "";
    });
  });

  const bookingForm = document.getElementById("booking-form");
  const feedback = document.getElementById("booking-feedback");

  if (bookingForm && feedback) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("b-name").value.trim();
      const phone = document.getElementById("b-phone").value.trim();
      const date = document.getElementById("b-date").value;
      const guests = document.getElementById("b-guests").value;
      const time = hiddenTime ? hiddenTime.value : "";
      const zone = hiddenZone ? hiddenZone.value : "";

      if (!name || !phone || !date) {
        feedback.style.color = "#9e3b24";
        feedback.textContent = "Por favor, completa nombre, teléfono y fecha para confirmar.";
        return;
      }

      feedback.style.color = "#5c1f29";
      feedback.textContent = `Reserva anotada para ${name} (${guests}) en ${zone} el ${date} a las ${time} h.`;
      bookingForm.reset();
    });
  }
});