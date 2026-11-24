(() => {
  const WHATSAPP_PHONE = "34684608226";
  const RESTAURANT_NAME = "EL FOGON DE TERESA";

  function interceptBookingSubmit(event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    const isBookingForm =
      form.id === "booking-form" ||
      form.id === "reserva-form" ||
      form.classList.contains("booking-form") ||
      Boolean(form.querySelector(".zone-btn, .slot-btn, input[type='date']"));

    if (!isBookingForm) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const inputs = Array.from(form.querySelectorAll("input, select, textarea"));

    const nombre =
      inputs.find((el) =>
        /nombre|name/i.test(el.id || el.name || el.placeholder || "")
      )?.value.trim() || "";

    const telefono =
      inputs.find((el) =>
        /tel|phone|contacto|movil/i.test(el.id || el.name || el.placeholder || "")
      )?.value.trim() || "";

    const fecha =
      form.querySelector('input[type="date"]')?.value.trim() ||
      inputs.find((el) => /fecha|date|dia/i.test(el.id || el.name || ""))?.value.trim() ||
      "";

    const comensales =
      form.querySelector("select")?.value.trim() ||
      inputs.find((el) => /comensal|persona|guest/i.test(el.id || el.name || ""))?.value.trim() ||
      "";

    const notas =
      form.querySelector("textarea")?.value.trim() || "Ninguna";

    const ambiente =
      document.querySelector(".zone-btn.active")?.textContent.trim() ||
      "Por confirmar";

    const hora =
      document.querySelector(".slot-btn.active")?.textContent.trim() ||
      "Por confirmar";

    if (!nombre || !fecha) {
      alert("Por favor, completa al menos tu nombre y el dia de la reserva.");
      return;
    }

    const lines = [
      `*NUEVA RESERVA - ${RESTAURANT_NAME}*`,
      "----------------------------------------",
      `*Nombre:* ${nombre}`,
      telefono ? `*Telefono:* ${telefono}` : null,
      `*Ambiente:* ${ambiente}`,
      `*Dia:* ${fecha}`,
      `*Hora:* ${hora}`,
      comensales ? `*Comensales:* ${comensales}` : null,
      `*Alergias / Peticiones:* ${notas}`,
      "----------------------------------------"
    ].filter(Boolean);

    const message = lines.join("\n");
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

    const win = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    if (!win) {
      window.location.assign(whatsappUrl);
    }
  }

  document.addEventListener("submit", interceptBookingSubmit, true);
})();