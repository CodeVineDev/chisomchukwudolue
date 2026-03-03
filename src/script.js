const cursor = document.getElementById("custom-cursor");
// Update position on mouse move
document.addEventListener("mousemove", (e) => {
  // We use translate3d for the smoothest performance (GPU accelerated)
  cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
});

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
