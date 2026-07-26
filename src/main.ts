import "../style.css";

const pages = [
  ["Home", "index.html"],
  ["About", "about.html"],
  ["Services", "service.html"],
  ["Ventures", "ventures.html"],
  ["Partnership", "partnership.html"],
  ["FAQ", "faq.html"],
  ["Contact", "contact.html"]
] as const;

const icon = (name: "arrow" | "menu" | "close") => {
  const paths = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>'
  };
  return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
};

const currentFile = window.location.pathname.split("/").pop() || "index.html";
const navLinks = pages.map(([label, href]) => {
  const active = currentFile === href ? ' aria-current="page"' : "";
  return `<a href="${href}"${active}>${label}</a>`;
}).join("");

const header = document.querySelector<HTMLElement>("[data-site-header]");
if (header) {
  header.innerHTML = `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <div class="utility">
      <div class="shell utility__inner">
        <p>Freetown, Sierra Leone</p>
        <div>
          <a href="mailto:info@dmagicaltouchempire.com">info@dmagicaltouchempire.com</a>
          <a href="tel:+23276431194">+232 76 431 194</a>
        </div>
      </div>
    </div>
    <div class="site-nav">
      <div class="shell site-nav__inner">
        <a class="brand" href="index.html" aria-label="D'Magical Touch Empire home">
          <span class="brand__mark" aria-hidden="true">D’</span>
          <span><strong>D’Magical Touch</strong><small>Empire</small></span>
        </a>
        <nav class="nav-links" id="primary-nav" aria-label="Primary navigation">${navLinks}</nav>
        <a class="button button--compact nav-cta" href="contact.html">Start a conversation ${icon("arrow")}</a>
        <button class="menu-button" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open navigation">
          <span class="menu-open">${icon("menu")}</span>
          <span class="menu-close">${icon("close")}</span>
        </button>
      </div>
    </div>`;
}

const footer = document.querySelector<HTMLElement>("[data-site-footer]");
if (footer) {
  footer.innerHTML = `
    <div class="shell footer__grid">
      <div class="footer__brand">
        <a class="brand brand--light" href="index.html">
          <span class="brand__mark" aria-hidden="true">D’</span>
          <span><strong>D’Magical Touch</strong><small>Empire</small></span>
        </a>
        <p>We turn promising ideas into structured, investable ventures built for lasting value.</p>
      </div>
      <div>
        <h2>Explore</h2>
        <div class="footer__links">${pages.slice(1, 5).map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}</div>
      </div>
      <div>
        <h2>Connect</h2>
        <div class="footer__links">
          <a href="contact.html">Send an enquiry</a>
          <a href="tel:+23276431194">+232 76 431 194</a>
          <a href="mailto:info@dmagicaltouchempire.com">Email our team</a>
        </div>
      </div>
      <div>
        <h2>Follow</h2>
        <div class="footer__links">
          <a href="https://www.instagram.com/dmagicaltouchempire/" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
          <a href="https://twitter.com/dmagicaltouch01" target="_blank" rel="noopener noreferrer">X / Twitter ↗</a>
          <a href="https://wa.me/23276431194" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>
        </div>
      </div>
    </div>
    <div class="shell footer__base">
      <p>© <span data-year></span> D’Magical Touch Empire. All rights reserved.</p>
      <a href="privacy.html">Privacy</a>
    </div>`;
}

document.querySelectorAll<HTMLElement>("[data-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const menuButton = document.querySelector<HTMLButtonElement>(".menu-button");
const navigation = document.querySelector<HTMLElement>(".nav-links");

function closeMenu(): void {
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Open navigation");
  navigation?.classList.remove("is-open");
  document.body.classList.remove("menu-is-open");
}

menuButton?.addEventListener("click", () => {
  const opening = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(opening));
  menuButton.setAttribute("aria-label", opening ? "Close navigation" : "Open navigation");
  navigation?.classList.toggle("is-open", opening);
  document.body.classList.toggle("menu-is-open", opening);
});

navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("resize", () => {
  if (window.innerWidth > 960) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reducedMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
}

document.querySelectorAll<HTMLDetailsElement>(".faq-list details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll<HTMLDetailsElement>(".faq-list details").forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

interface ApiResponse {
  ok: boolean;
  message: string;
}

const contactForm = document.querySelector<HTMLFormElement>("[data-contact-form]");
const companyField = contactForm?.querySelector<HTMLInputElement>("#company");
const companyLabel = contactForm?.querySelector<HTMLElement>("[data-company-label]");
const enquiryType = contactForm?.querySelector<HTMLSelectElement>("#enquiryType");
const statusBox = contactForm?.querySelector<HTMLElement>("[data-form-status]");
const submitButton = contactForm?.querySelector<HTMLButtonElement>('button[type="submit"]');

function syncCompanyRequirement(): void {
  if (!companyField || !companyLabel || !enquiryType) return;
  const required = ["partnership", "investment"].includes(enquiryType.value);
  companyField.required = required;
  companyLabel.textContent = required ? "Company or organization *" : "Company or organization";
}

enquiryType?.addEventListener("change", syncCompanyRequirement);
syncCompanyRequirement();

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity() || !statusBox || !submitButton) return;

  const formData = new FormData(contactForm);
  const payload: Record<string, string | boolean> = Object.fromEntries(
    [...formData.entries()].map(([key, value]) => [key, String(value)])
  );
  payload.consent = formData.get("consent") === "on";
  statusBox.hidden = false;
  statusBox.className = "form-status";
  statusBox.textContent = "Sending your enquiry…";
  submitButton.disabled = true;

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json() as ApiResponse;
    statusBox.classList.add(response.ok ? "is-success" : "is-error");
    statusBox.textContent = result.message;
    if (response.ok) {
      contactForm.reset();
      syncCompanyRequirement();
      statusBox.focus();
    }
  } catch {
    statusBox.classList.add("is-error");
    statusBox.textContent = "We could not connect to the website service. Please try again or call +232 76 431 194.";
  } finally {
    submitButton.disabled = false;
  }
});
