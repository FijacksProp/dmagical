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

const menuButton = document.querySelector<HTMLElement>(".menu-button, #menu-toggle");
const navigation = document.querySelector<HTMLElement>(".nav-links, .nav");

if (menuButton && navigation) {
  menuButton.setAttribute("role", "button");
  menuButton.setAttribute("tabindex", "0");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-controls", navigation.id || "nav");
  menuButton.setAttribute("aria-label", "Open navigation");
}

function closeMenu(): void {
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Open navigation");
  navigation?.classList.remove("is-open");
  navigation?.classList.remove("active");
  document.body.classList.remove("menu-is-open");
}

menuButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  const opening = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(opening));
  menuButton.setAttribute("aria-label", opening ? "Close navigation" : "Open navigation");
  navigation?.classList.toggle("is-open", opening);
  navigation?.classList.toggle("active", opening);
  document.body.classList.toggle("menu-is-open", opening);
});

menuButton?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  menuButton.click();
});

navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("click", (event) => {
  if (menuButton?.getAttribute("aria-expanded") !== "true") return;
  const target = event.target;
  if (target instanceof Node && !navigation?.contains(target) && !menuButton.contains(target)) closeMenu();
});
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

document.querySelectorAll<HTMLDetailsElement>(".faq-list details, .faq-wrapper details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll<HTMLDetailsElement>(".faq-list details, .faq-wrapper details").forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});

document.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]').forEach((link) => {
  link.rel = "noopener noreferrer";
});

document.querySelectorAll<HTMLAnchorElement>('a[href="tel:+23232746064"]').forEach((link) => {
  link.href = "tel:+23276431194";
});

document.querySelectorAll<HTMLButtonElement>("[data-contact-route], .donate-btn button").forEach((button) => {
  button.addEventListener("click", () => window.location.assign("contact.html"));
});

document.querySelectorAll<HTMLAnchorElement>(".nav a").forEach((link) => {
  if (link.getAttribute("href") === currentFile) link.setAttribute("aria-current", "page");
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

const partnershipOptions = {
  "strategic-business": {
    title: "Explore a strategic business partnership.",
    description: "Tell us where your organization can create leverage through markets, distribution, technology, operations, or a joint venture."
  },
  investment: {
    title: "Discuss an investment opportunity.",
    description: "Share your investor profile, preferred venture area, indicative range, and investment horizon. This initial enquiry is not a financial commitment."
  },
  franchise: {
    title: "Explore a franchise relationship.",
    description: "Help us understand the venture, territory, operating experience, and level of readiness behind your interest."
  },
  "corporate-collaboration": {
    title: "Propose a corporate collaboration.",
    description: "Outline the commercial or programme opportunity, its intended scope, and when you would like delivery to begin."
  },
  technical: {
    title: "Offer specialist or technical capability.",
    description: "Describe the expertise, credentials, and delivery capacity your team could contribute to a D'Magical venture."
  },
  institutional: {
    title: "Start an institutional partnership.",
    description: "Tell us about the institution, programme focus, geographic scope, and current stage of the opportunity."
  }
} as const;

type PartnershipType = keyof typeof partnershipOptions;

const partnershipPanel = document.querySelector<HTMLElement>("[data-partnership-panel]");
const partnershipForm = document.querySelector<HTMLFormElement>("[data-partnership-form]");
const partnershipTypeInput = partnershipForm?.querySelector<HTMLInputElement>("[data-partnership-type]");
const partnershipTitle = partnershipPanel?.querySelector<HTMLElement>("[data-partnership-title]");
const partnershipDescription = partnershipPanel?.querySelector<HTMLElement>("[data-partnership-description]");
const partnershipStatus = partnershipForm?.querySelector<HTMLElement>("[data-partnership-status]");
const partnershipSubmit = partnershipForm?.querySelector<HTMLButtonElement>('button[type="submit"]');
const partnershipButtons = document.querySelectorAll<HTMLButtonElement>("[data-partnership-open]");
const partnershipFieldsets = partnershipForm?.querySelectorAll<HTMLFieldSetElement>("[data-partnership-fields]");
let activePartnershipButton: HTMLButtonElement | null = null;

function isPartnershipType(value: string): value is PartnershipType {
  return Object.hasOwn(partnershipOptions, value);
}

function openPartnershipForm(type: PartnershipType): void {
  if (!partnershipPanel || !partnershipForm || !partnershipTypeInput || !partnershipTitle || !partnershipDescription) return;

  partnershipForm.reset();
  partnershipTypeInput.value = type;
  partnershipTitle.textContent = partnershipOptions[type].title;
  partnershipDescription.textContent = partnershipOptions[type].description;

  partnershipFieldsets?.forEach((fieldset) => {
    const selected = fieldset.dataset.partnershipFields === type;
    fieldset.hidden = !selected;
    fieldset.disabled = !selected;
  });

  partnershipButtons.forEach((button) => {
    const selected = button.dataset.partnershipOpen === type;
    button.closest(".partnership-card, .opportunity-card")?.classList.toggle("is-selected", selected);
    if (selected) activePartnershipButton = button;
  });

  if (partnershipStatus) {
    partnershipStatus.hidden = true;
    partnershipStatus.className = "form-status";
    partnershipStatus.textContent = "";
  }

  partnershipPanel.hidden = false;
  partnershipPanel.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  partnershipTitle.focus({ preventScroll: true });
}

partnershipButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.partnershipOpen || "";
    if (isPartnershipType(type)) openPartnershipForm(type);
  });
});

document.querySelector<HTMLButtonElement>("[data-partnership-close]")?.addEventListener("click", () => {
  if (!partnershipPanel) return;
  partnershipPanel.hidden = true;
  partnershipButtons.forEach((button) => button.closest(".partnership-card, .opportunity-card")?.classList.remove("is-selected"));
  activePartnershipButton?.focus();
});

partnershipForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!partnershipForm.reportValidity() || !partnershipStatus || !partnershipSubmit || !partnershipTypeInput) return;

  const formData = new FormData(partnershipForm);
  const payload: Record<string, string | boolean> = Object.fromEntries(
    [...formData.entries()].map(([key, value]) => [key, String(value)])
  );
  payload.consent = formData.get("consent") === "on";
  partnershipStatus.hidden = false;
  partnershipStatus.className = "form-status";
  partnershipStatus.textContent = "Sending your partnership enquiry...";
  partnershipSubmit.disabled = true;

  try {
    const response = await fetch("/api/partnership", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json() as ApiResponse;
    partnershipStatus.classList.add(response.ok ? "is-success" : "is-error");
    partnershipStatus.textContent = result.message;

    if (response.ok) {
      const submittedType = partnershipTypeInput.value;
      partnershipForm.reset();
      partnershipTypeInput.value = submittedType;
      partnershipStatus.focus();
    }
  } catch {
    partnershipStatus.classList.add("is-error");
    partnershipStatus.textContent = "We could not connect to the website service. Please try again or call +232 76 431 194.";
  } finally {
    partnershipSubmit.disabled = false;
  }
});
