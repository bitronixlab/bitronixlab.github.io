const header = document.querySelector("[data-header]");
const nav = document.querySelector("#site-nav");
const toggle = document.querySelector(".nav-toggle");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const liveValue = document.querySelector("[data-live-value]");
const loopValue = document.querySelector("[data-loop-value]");
const syncValue = document.querySelector("[data-sync-value]");
const hero = document.querySelector(".hero");
const heroVisual = document.querySelector(".hero-visual");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const missionTabs = document.querySelectorAll("[data-mission]");
const missionLabel = document.querySelector("[data-mission-label]");
const missionText = document.querySelector("[data-mission-text]");
const missionDisplay = document.querySelector(".mission-display");

const missionContent = {
  innovate: {
    label: "Innovate",
    text: "Explore bold ideas through fast experiments, technical discovery, and proof-of-concept builds that reveal what is possible."
  },
  design: {
    label: "Design",
    text: "Shape electronics, interfaces, circuits, and learning experiences with a product-minded eye for clarity, durability, and beauty."
  },
  develop: {
    label: "Develop",
    text: "Build the firmware, sensor loops, AI pipelines, and validation habits that turn a concept into a reliable working system."
  },
  educate: {
    label: "Educate",
    text: "Teach practical engineering through hands-on labs, real hardware, and explanations that make complex systems feel buildable."
  }
};

const closeNav = () => {
  if (!nav || !toggle) {
    return;
  }

  nav.classList.remove("is-open");
  document.body.classList.remove("nav-open");
  toggle.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
};

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      closeNav();
    }
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNav();
  }
});

const syncHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

const readings = [
  ["38.2k", "1.8ms", "99.4%"],
  ["41.7k", "2.1ms", "99.1%"],
  ["36.9k", "1.6ms", "99.7%"],
  ["44.3k", "1.9ms", "99.3%"]
];

let readingIndex = 0;

const syncReadouts = () => {
  if (!liveValue || !loopValue || !syncValue) {
    return;
  }

  readingIndex = (readingIndex + 1) % readings.length;
  const [live, loop, sync] = readings[readingIndex];
  liveValue.textContent = live;
  loopValue.textContent = loop;
  syncValue.textContent = sync;
};

if (!reducedMotion.matches) {
  window.setInterval(syncReadouts, 2200);

  window.addEventListener("pointermove", (event) => {
    document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
  }, { passive: true });
}

const revealTargets = document.querySelectorAll([
  ".intro-grid",
  ".stat-strip > div",
  ".mission-logo-panel",
  ".mission-content",
  ".mission-console",
  ".mission-values article",
  ".section-heading",
  ".service-card",
  ".track",
  ".tutorial-link",
  ".learning-visual",
  ".innovation-panel",
  ".wall-module",
  ".contact-signal",
  ".contact-details",
  ".contact-form"
].join(","));

if (revealTargets.length) {
  revealTargets.forEach((element, index) => {
    element.classList.add("revealable");
    element.style.setProperty("--reveal-delay", `${(index % 6) * 70}ms`);
  });

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.14
    });

    revealTargets.forEach((element) => revealObserver.observe(element));
  }
}

if (missionTabs.length && missionLabel && missionText) {
  missionTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const nextMission = missionContent[tab.dataset.mission];
      if (!nextMission) {
        return;
      }

      missionTabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });

      missionLabel.textContent = nextMission.label;
      missionText.textContent = nextMission.text;

      if (missionDisplay && !reducedMotion.matches) {
        missionDisplay.classList.remove("is-switching");
        window.requestAnimationFrame(() => {
          missionDisplay.classList.add("is-switching");
        });
      }
    });
  });
}

if (hero && heroVisual && !reducedMotion.matches) {
  hero.addEventListener("pointermove", (event) => {
    const rect = heroVisual.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    document.documentElement.style.setProperty("--tilt-y", `${(x * 8).toFixed(2)}deg`);
    document.documentElement.style.setProperty("--tilt-x", `${(-y * 6).toFixed(2)}deg`);
  });

  hero.addEventListener("pointerleave", () => {
    document.documentElement.style.setProperty("--tilt-y", "0deg");
    document.documentElement.style.setProperty("--tilt-x", "0deg");
  });
}

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get("name")?.toString().trim() || "there";
    const email = formData.get("email")?.toString().trim() || "";
    const type = formData.get("type")?.toString().trim() || "General inquiry";
    const message = formData.get("message")?.toString().trim() || "";
    const subject = encodeURIComponent(`Bitronix Lab inquiry: ${type}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nProject type: ${type}\n\n${message}`);

    window.location.href = `mailto:hello@bitronixlab.com?subject=${subject}&body=${body}`;
    formStatus.textContent = `Thanks, ${name}. Opening your email app now.`;
    contactForm.reset();
  });
}
