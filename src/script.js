// --- CURSOR INITIALIZATION ---
// (Logic consolidated at the bottom for stability)

let lastScrollY = window.scrollY;
const navbar = document.getElementById("main-nav");

window.addEventListener("scroll", () => {
  // Only run this logic on laptop screens (1024px and up)
  if (window.innerWidth >= 1024) {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      navbar.classList.add("scrolled");
    } else if (currentScrollY < lastScrollY) {
      navbar.classList.remove("scrolled");
    }

    lastScrollY = currentScrollY;
  } else {
    // On mobile, always stay in the "normal" state (no width changes)
    navbar.classList.remove("scrolled");
  }
});

// ... your existing menuToggle logic below ...

const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const nav = document.getElementById("main-nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("menu-open");
  mobileMenu.classList.toggle("active");
});

// Close menu when clicking a link
document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("menu-open");
    mobileMenu.classList.remove("active");
  });
});

// GSAP Hero Animation
window.addEventListener("load", () => {
  const tl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });

  tl.to("#hero-col-2", {
    opacity: 1,
    rotationX: 0,
    scale: 1,
    duration: 1.5,
    startAt: { rotationX: -120, scale: 0 }, // Reversed vertical flip
  })
    .to(
      "#hero-col-1",
      {
        opacity: 1,
        x: 0,
        startAt: { x: 50 }, // Fade in from the right
      },
      "-=0.8", // Start while column 2 is finishing
    )
    .to(
      "#hero-col-3",
      {
        opacity: 1,
        x: 0,
        startAt: { x: -50 }, // Fade in from the left
      },
      "<", // Start at the same time as column 1
    );
});

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Responsive Scroll Animation (Laptop only)
let mm = gsap.matchMedia();

mm.add("(min-width: 1024px)", () => {
  const aboutTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#about-section",
      start: "top bottom",
      end: "-20% top", // Animation finishes when about section reaches center
      scrub: 1,
    },
  });

  aboutTl
    .to("#hero-col-2", {
      x: "25vw",
      y: "100vh",
      rotationY: 180,
      rotationZ: 5,
      ease: "none",
    })
    .to(".hero-bubble", { scale: 0, opacity: 0, ease: "none" }, 0);
});

// src/script.js

// --- REFINED SKILL ACCORDIONS (GSAP) ---
document.querySelectorAll(".accordion-header").forEach((header) => {
  header.addEventListener("click", () => {
    const content = header.nextElementSibling;
    const isActive = header.classList.contains("active");

    // Smoothly close other accordions first
    document.querySelectorAll(".accordion-header").forEach((otherHeader) => {
      if (otherHeader !== header && otherHeader.classList.contains("active")) {
        otherHeader.classList.remove("active");
        gsap.to(otherHeader.nextElementSibling, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
          onComplete: () => {
            otherHeader.nextElementSibling.style.display = "none";
          },
        });
      }
    });

    if (isActive) {
      // Smoothly close current
      header.classList.remove("active");
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          content.style.display = "none";
        },
      });
    } else {
      // Smoothly open current
      header.classList.add("active");
      content.style.display = "block"; // Show before animating height
      gsap.fromTo(
        content,
        { height: 0, opacity: 0 },
        {
          height: "auto",
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
      );
    }
  });
});

//* --- FINAL SYNCHRONIZED CURSOR & HOVER LOGIC --- */

// 1. Initial Setup
const mainCursor = document.getElementById("custom-cursor");
const imgFollower = document.getElementById("cursor-image-follower");

const techImage = document.getElementById("cursor-tech-img");
const commImage = document.getElementById("cursor-comm-img");
const accordionTitles = document.querySelectorAll(".skill-accordion");
const accordionSection = document.getElementById("skills-accordion-container");

// Center both (replaces old CSS translations)
gsap.set([mainCursor, imgFollower], { xPercent: -50, yPercent: -50 });

// 2. Single Source of Truth for Follow Movement
document.addEventListener("mousemove", (e) => {
  // We use overwrite: "auto" to make sure this doesn't fight with the hover animations
  // Speeds perfectly synchronized so they don't drift during morphing
  gsap.to(mainCursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.1,
    ease: "none",
    overwrite: "auto",
  });
  gsap.to(imgFollower, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.1,
    ease: "none",
    overwrite: "auto",
  });
});

// 3. Hover Effects
if (accordionSection) {
  accordionTitles.forEach((header, index) => {
    header.addEventListener("mouseenter", () => {
      const target = index === 0 ? techImage : commImage;
      const other = index === 0 ? commImage : techImage;

      // Reveal Image (morphing effect)
      gsap.to(target, {
        opacity: 1,
        clipPath: "circle(100% at center)",
        x: 60, // Exact morph offset
        y: 20,
        rotation: 10,
        duration: 0.6,
        ease: "expo.out",
        overwrite: true,
      });

      // Hide Other explicitly
      gsap.to(other, {
        opacity: 0,
        clipPath: "circle(0% at center)",
        duration: 0.4,
        overwrite: true,
      });

      // Morph dot away completely
      gsap.to(mainCursor, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        overwrite: true,
      });
    });

    header.addEventListener("mouseleave", () => {
      // Hide all images
      gsap.to([techImage, commImage], {
        opacity: 0,
        clipPath: "circle(0% at center)",
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.4,
        ease: "power2.inOut",
        overwrite: true,
      });
      // Bring dot back right as image fades
      gsap.to(mainCursor, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        delay: 0.1,
        overwrite: true,
      });
    });
  });
}

const toolsSection = document.getElementById("tools-section");
if (toolsSection) {
  const logos = gsap.utils.toArray(".tool-logo");

  // Set logos to their final resting positions in CSS (relative layout),
  // so no absolute pixel calculations needed.
  // They start off-screen above and drop in.
  gsap.set(logos, { y: -80, opacity: 0 });

  const toolsTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#tools-section",
      start: "top 75%", // Fire when section is 75% into viewport
      once: true, // Play once, never re-trigger
    },
  });

  // 1. Heading slides up and fades in with premium style
  toolsTl
    .to("#tools-headline", {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power4.out",
    })
    .to(
      "#tools-subheadline",
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.8",
    );

  // 2. Logos drop from above with a staggered bounce
  toolsTl.to(
    logos,
    {
      y: 0,
      opacity: 1,
      rotation: (i, el) => parseFloat(el.getAttribute("data-rotation")) || 0,
      duration: 1.0,
      ease: "bounce.out",
      stagger: 0.12,
    },
    "-=0.3",
  );

  // 3. Hover Interaction
  logos.forEach((logo) => {
    logo.addEventListener("mouseenter", () => {
      gsap.to(logo, {
        scale: 1.15,
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(logo, {
        boxShadow:
          "0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)",
        duration: 0.25,
      });
    });
    logo.addEventListener("mouseleave", () => {
      gsap.to(logo, {
        scale: 1,
        duration: 0.3,
        ease: "power2.inOut",
        overwrite: "auto",
      });
      gsap.to(logo, {
        boxShadow:
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        duration: 0.3,
      });
    });
  });
}

// --- PROJECTS STACKED SCROLL INTERACTION ---
gsap.registerPlugin(ScrollTrigger);

const projectsSection = document.getElementById("projects-section");
const projectCards = gsap.utils.toArray(".project-card");

if (projectsSection && projectCards.length > 0) {
  // Set initial states: all cards except the first are pushed down
  gsap.set(projectCards.slice(1), { yPercent: 100 });

  const stackTl = gsap.timeline({
    scrollTrigger: {
      trigger: projectsSection,
      start: "top top", // Pin when section hits top of viewport
      end: () => `+=${projectCards.length * window.innerHeight}`, // Scroll distance depends on number of cards
      scrub: 1, // Smooth scrubbing
      pin: true, // Pin the entire section
      anticipatePin: 1,
    },
  });

  // Iterate over each card (starting from the second one)
  projectCards.forEach((card, index) => {
    if (index === 0) return; // First card is already visible

    // Animate the new card sliding up
    stackTl.to(
      card,
      {
        yPercent: 0,
        duration: 1,
        ease: "none",
      },
      // Start this animation sequentially
      `+=0`,
    );

    // Animate ALL previous cards scaling down and pushing back
    const previousCards = projectCards.slice(0, index);
    stackTl.to(
      previousCards,
      {
        scale: () => 1 - 0.05 * (previousCards.length - index + 1), // Dynamic scaling based on depth
        y: () => -20 * (previousCards.length - index + 1), // Dynamic Y push based on depth
        opacity: () => 1 - 0.1 * (previousCards.length - index + 1), // Optional: fade out deeper cards slightly
        duration: 1,
        ease: "none",
      },
      "<", // Run at the same time as the current card sliding up
    );
  });
}

// User's Literal Cursor Listener (kept for custom cursor interactions)
projectCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    if (window.innerWidth >= 1024) {
      mainCursor.classList.add("cursor-project");
    }
  });

  card.addEventListener("mouseleave", () => {
    mainCursor.classList.remove("cursor-project");
  });
});

// 6. Premium Contact Section Animations
const contactHeadline = document.getElementById("contact-headline");
const contactSubheadline = document.getElementById("contact-subheadline");
const contactCta = document.getElementById("contact-cta");

if (contactHeadline && contactSubheadline && contactCta) {
  const contactTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#contact-section",
      start: "top 60%", // Triggers when the top of the contact section is 60% down the viewport
    },
  });

  contactTl
    .to(contactHeadline, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power4.out",
    })
    .to(
      contactSubheadline,
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.8",
    )
    .to(
      contactCta,
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
      },
      "-=0.6",
    );

  // Custom Cursor for All Premium CTAs
  const premiumCtas = document.querySelectorAll(".btn-grow");
  premiumCtas.forEach((cta) => {
    cta.addEventListener("mouseenter", () => {
      if (window.innerWidth >= 1024) {
        mainCursor.classList.add("contact-hover");
      }
    });

    cta.addEventListener("mouseleave", () => {
      if (window.innerWidth >= 1024) {
        mainCursor.classList.remove("contact-hover");
        mainCursor.style.cssText = "";
      }
    });
  });
}

// 7. About Section Heading Premium Animation
const aboutHeadline = document.getElementById("about-headline");
const aboutSubheadline = document.getElementById("about-subheadline");

if (aboutHeadline && aboutSubheadline) {
  const aboutHeadTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#about-section",
      start: "top 80%",
      once: true,
    },
  });

  aboutHeadTl
    .to(aboutHeadline, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power4.out",
    })
    .to(
      aboutSubheadline,
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.8",
    );
}

// 8. Footer Titles — staggered fade-up on scroll into view
gsap.fromTo(
  ".footer-title",
  { y: 25, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.7,
    ease: "power3.out",
    stagger: 0.15,
    scrollTrigger: {
      trigger: "footer",
      start: "top 85%",
      once: true,
    },
  },
);

// ============================================
// Layer 3 — Canvas grain: draw + drift
// ============================================
(function () {
  const canvas = document.getElementById("grain-layer");
  if (!canvas) return;

  // Make canvas 150% of the viewport so drift never shows bare edges
  const W = Math.ceil(window.innerWidth * 1.5);
  const H = Math.ceil(window.innerHeight * 1.5);
  canvas.width = W;
  canvas.height = H;

  // Offset so it's centered (25% bleed on each side)
  gsap.set(canvas, {
    x: -(W - window.innerWidth) / 2,
    y: -(H - window.innerHeight) / 2,
  });

  // Draw random greyscale pixel noise
  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(W, H);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const v = Math.floor(Math.random() * 255);
    data[i] = v; // R
    data[i + 1] = v; // G
    data[i + 2] = v; // B
    data[i + 3] = 38; // Alpha (~0.15 effective opacity)
  }
  ctx.putImageData(imageData, 0, 0);

  // Drift X and Y on different cycle durations → never periodic
  gsap.to(canvas, {
    x: "+=" + (W - window.innerWidth) / 2,
    duration: 14,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
  gsap.to(canvas, {
    y: "+=" + (H - window.innerHeight) / 2,
    duration: 19,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
})();
