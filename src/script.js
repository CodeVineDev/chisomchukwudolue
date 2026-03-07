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
  const serviceTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#services-section",
      start: "top bottom",
      end: "end top", // FAST: Animation finishes when services reach center
      scrub: 1, // Snappier response
    },
  });

  serviceTl
    .to("#hero-col-2", {
      x: "25vw",
      y: "100vh",
      rotationY: 180, // Flip
      rotationZ: 5, // Tilt
      // CUBID EFFECT: Horizontal skew
      // CUBID EFFECT: Vertical skew shift
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
const accordionTitles = document.querySelectorAll(".accordion-header");
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
