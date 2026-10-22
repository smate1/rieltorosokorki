const ORDER_ORIGIN = "https://kadastr.com.ua";
const PARTNER_CODE = "";
const partnerFromLink = new URLSearchParams(location.search).get("ref");
if (partnerFromLink) sessionStorage.setItem("kadastr_ref", partnerFromLink);
const partnerCode = partnerFromLink || sessionStorage.getItem("kadastr_ref") || PARTNER_CODE;
const cadInput = document.getElementById("cad");
const mapFrame = document.getElementById("kadastr-map");
const cadStatus = document.getElementById("cad-status");
let activeCad = "";

function orderUrl(path, cadParam) {
  const url = new URL(path || "/", ORDER_ORIGIN);
  if (partnerCode) url.searchParams.set("ref", partnerCode);
  if (cadParam && activeCad) url.searchParams.set(cadParam, activeCad);
  return url.toString();
}

function applyReferralLinks() {
  document.querySelectorAll(".js-order, .offer").forEach((link) => {
    link.href = orderUrl(link.dataset.path || "/", link.dataset.cad || "");
  });
  mapFrame.src = orderUrl("/", "cad");
}

applyReferralLinks();

document.getElementById("cad-search").addEventListener("submit", (event) => {
  event.preventDefault();
  const cad = cadInput.value.trim().replace(/\s+/g, "");
  if (!/^\d{10}:\d{2}:\d{3}:\d{4}$/.test(cad)) {
    cadStatus.textContent = "Перевірте номер: потрібно 10 цифр, двоє, троє і четверо через двокрапку.";
    return;
  }
  activeCad = cad;
  cadStatus.textContent = "Карта відкриває цю ділянку. Довідка з неї теж піде через цей сайт.";
  applyReferralLinks();
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
