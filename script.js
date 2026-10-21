const PARTNER_CODE = "";
const partnerFromLink = new URLSearchParams(location.search).get("ref");
if (partnerFromLink) sessionStorage.setItem("kadastr_ref", partnerFromLink);
const partnerCode = partnerFromLink || sessionStorage.getItem("kadastr_ref") || PARTNER_CODE;
const orderUrl = partnerCode
  ? "https://kadastr.com.ua/?ref=" + encodeURIComponent(partnerCode)
  : "https://kadastr.com.ua/";
document.querySelectorAll(".offer").forEach((link) => {
  link.href = orderUrl;
});
if (partnerCode) {
  document.getElementById("widget-wrap").hidden = false;
  document.getElementById("kadastr-widget").src =
    "https://kadastr.com.ua/widget?partner=" + encodeURIComponent(partnerCode);
}
const header = document.querySelector(".site-header");
const nav = document.getElementById("nav");
const menuBtn = document.querySelector(".menu-btn");
const backdrop = document.querySelector(".nav-backdrop");

function setMenu(open) {
  nav.classList.toggle("open", open);
  backdrop.classList.toggle("show", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Закрити меню" : "Меню");
  document.body.classList.toggle("menu-open", open);
}
menuBtn.addEventListener("click", () => {
  setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
});
backdrop.addEventListener("click", () => setMenu(false));
nav.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) setMenu(false);
});
document.addEventListener("scroll", () => {
  header.classList.toggle("is-stuck", window.scrollY > 8);
}, { passive: true });

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach((item) => item.setAttribute("aria-pressed", "false"));
    chip.setAttribute("aria-pressed", "true");
    const filter = chip.dataset.filter;
    document.querySelectorAll("#catalog .card").forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.kind !== filter;
    });
  });
});

document.getElementById("lead").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const text = [
    "Запит з сайту, Осокорки",
    "Ім’я: " + data.get("name"),
    "Телефон: " + data.get("phone"),
    "Запит: " + data.get("intent"),
    data.get("note") ? "Деталі: " + data.get("note") : ""
  ].filter(Boolean).join("\n");
  const status = document.getElementById("form-status");
  status.hidden = false;
  if (data.get("channel") === "whatsapp") {
    status.textContent = "Відкриваю WhatsApp із текстом запиту.";
    window.open("https://wa.me/380665968444?text=" + encodeURIComponent(text), "_blank", "noopener");
    return;
  }
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
  status.textContent = "Відкриваю Viber. Текст запиту скопійовано — вставте його в чат, якщо поле порожнє.";
  window.location.href = "viber://chat?number=%2B380665968444";
});
