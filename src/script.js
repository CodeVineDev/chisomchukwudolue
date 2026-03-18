// --- CURSOR INITIALIZATION ---
// (Logic consolidated at the bottom for stability)

const mainCursor = document.getElementById("custom-cursor");
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

// GSAP Intro & Hero Animation
window.addEventListener("DOMContentLoaded", () => {
  const isProjectPage = window.location.pathname.includes("project-");
  
  if (isProjectPage) {
    // Skip intro on project pages
    document.body.style.overflow = "";
    const introOverlay = document.getElementById("intro-overlay");
    if (introOverlay) introOverlay.style.display = "none";
    return;
  }

  // Lock scrolling during intro
  document.body.style.overflow = "hidden";
  window.scrollTo(0, 0); // Ensure started at top

  // The function to play the original Hero animations
  function playHeroAnimation() {
    const heroTl = gsap.timeline({ defaults: { ease: "power4.out", duration: 1.2 } });

    heroTl.to("#hero-col-2", {
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
  }

  // Create Intro Timeline
  const introTl = gsap.timeline({
    onComplete: () => {
      // Re-enable scrolling after intro completes
      document.body.style.overflow = "";
      // Hide overlay so it doesn't block clicks
      document.getElementById("intro-overlay").style.display = "none";
      // Trigger Hero Animation
      playHeroAnimation();
    }
  });

  introTl
    // Step 1: Scanning Line Animation
    .to("#intro-loader-bar", {
      scaleX: 1,
      duration: 1.0,
      ease: "power2.inOut"
    })
    // Step 2: Loader fades out, Text transitions
    .to("#intro-loader-line", {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut"
    })
    .to("#intro-status-text", {
      y: "-100%",
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut"
    }, "<")
    .to("#intro-status-complete", {
      y: "0%",
      opacity: 1,
      duration: 0.3,
      ease: "power2.inOut"
    }, "<")
    // Hold "Data analyzed" briefly
    .to({}, { duration: 0.2 })
    // Step 3: Fade out status text, Fade in Welcome Message
    .to("#intro-loader-container", {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut"
    })
    .to("#intro-welcome-text", {
      opacity: 1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.2")
    // Hold Welcome message
    .to({}, { duration: 0.2 })
    // Step 4: Curtain Reveal (animate the whole overlay up)
    .to("#intro-overlay", {
      yPercent: -100,
      duration: 0.8,
      ease: "expo.inOut"
    });
});

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Responsive Scroll Animation (Laptop only)
let mm = gsap.matchMedia();

mm.add("(min-width: 1024px)", () => {
  const aboutTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#about-section",
      start: "10% bottom",
      end: "-20% top", // Animation finishes when about section reaches center
      scrub: 1,
    },
  });

  aboutTl
    .to("#hero-col-2", {
      x: "25vw",
      y: "105vh",
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

const cursorMM = gsap.matchMedia();

cursorMM.add("(min-width: 1025px)", () => {

  // 1. Initial Setup
  const imgFollower = document.getElementById("cursor-image-follower");

  const techImage = document.getElementById("cursor-tech-img");
  const commImage = document.getElementById("cursor-comm-img");
  const accordionTitles = document.querySelectorAll(".skill-accordion");
  const accordionSection = document.getElementById("skills-accordion-container");

  gsap.set([mainCursor, imgFollower], { xPercent: -50, yPercent: -50 });

  // 2. Follow movement
  document.addEventListener("mousemove", (e) => {
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

        gsap.to(target, {
          opacity: 1,
          clipPath: "circle(100% at center)",
          x: 60,
          y: 20,
          rotation: 10,
          duration: 0.6,
          ease: "expo.out",
          overwrite: true,
        });

        gsap.to(other, {
          opacity: 0,
          clipPath: "circle(0% at center)",
          duration: 0.4,
          overwrite: true,
        });

        gsap.to(mainCursor, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          overwrite: true,
        });
      });

      header.addEventListener("mouseleave", () => {

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

});
// --- PROJECTS SECTION REVEAL & STACKED SCROLL INTERACTION ---
gsap.registerPlugin(ScrollTrigger);

// 1. Reveal Animation for the Section Heading
const projectsHeadline = document.getElementById("projects-headline");
const projectsSubheadline = document.getElementById("projects-subheadline");

if (projectsHeadline && projectsSubheadline) {
  const projectsHeadTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#projects-section",
      start: "top 80%",
      once: true,
    },
  });

  projectsHeadTl
    .to(projectsHeadline, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power4.out",
    })
    .to(
      projectsSubheadline,
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.8",
    );
}

// 2. Stacked Hover Pinning Logic
const projectsSection = document.getElementById("projects-section");
const projectCards = gsap.utils.toArray(".project-card");

if (projectsSection && projectCards.length > 0) {
  // Set initial states: all cards except the first are pushed down
  gsap.set(projectCards.slice(1), { yPercent: 100 });

  // Responsive pinning: wrapper on laptop+, section on mobile
  const isMobile = window.innerWidth < 1024;
  const pinTarget = isMobile ? projectsSection : document.querySelector(".projects-wrapper");
  const pinTrigger = isMobile ? "#projects-section" : ".projects-wrapper";
  const pinStart = isMobile ? "top top" : "top 5%";

  const stackTl = gsap.timeline({
    scrollTrigger: {
      trigger: pinTrigger,
      start: pinStart,
      end: () => `+=${projectCards.length * window.innerHeight * 0.7}`,
      scrub: 1,
      pin: true,
      snap: 1 / (projectCards.length - 1),
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
      `+=0`,
    );

    // Animate ALL previous cards scaling down and pushing back
    const previousCards = projectCards.slice(0, index);
    stackTl.to(
      previousCards,
      {
        scale: () => 1 - 0.05 * (previousCards.length - index + 1),
        y: () => -20 * (previousCards.length - index + 1),
        opacity: () => 1 - 0.1 * (previousCards.length - index + 1),
        duration: 1,
        ease: "none",
      },
      "<",
    );
  });
}

// User's Literal Cursor Listener (kept for custom cursor interactions)
projectCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    if (window.innerWidth >= 1024) {
      mainCursor.classList.add("project-hover");
    }
  });

  card.addEventListener("mouseleave", () => {
    mainCursor.classList.remove("project-hover");
  });
});

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
      duration: 0.7, // Sped up from 1.0
      ease: "bounce.out",
      stagger: 0.08, // Sped up from 0.12
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

// 6. Premium Contact Section Animations
const contactHeadline = document.getElementById("contact-headline");
const contactSubheadline = document.getElementById("contact-subheadline");
const contactCta = document.getElementById("contact-cta");

if (contactHeadline && contactSubheadline && contactCta) {
  const contactTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#contact-section",
      start: "top 60%",
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
      }
    });
  });
}

// Resume CTA Fade-in Animation (same style as contact CTA)
const resumeCta = document.getElementById("tools-resume-cta");
if (resumeCta) {
  gsap.to(resumeCta, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: "#tools-section",
      start: "top 50%",
      once: true,
    },
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

// ==========================================
// CASE STUDY: NEW MICRO-INTERACTIONS
// ==========================================

// --- Premium Problem Section Animation (1, 2, 3 cards) ---
if (document.querySelector(".problem-grid")) {
  const problemGrids = gsap.utils.toArray(".problem-grid");
  problemGrids.forEach((grid) => {
    const cards = grid.querySelectorAll(".problem-card");
    const numbers = grid.querySelectorAll(".problem-number");

    // Set initial states
    gsap.set(cards, { autoAlpha: 0, y: 60, scale: 0.95 });
    gsap.set(numbers, { scale: 0.5, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: grid,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });

    // Animate cards staggering in
    tl.to(cards, {
      duration: 0.9,
      autoAlpha: 1,
      y: 0,
      scale: 1,
      ease: "power4.out",
      stagger: 0.15
    });

    // Pop the numbers immediately after each card starts
    tl.to(numbers, {
      duration: 0.6,
      scale: 1,
      opacity: 1,
      ease: "back.out(2)",
      stagger: 0.15
    }, "<0.2");
  });
}

// --- Reveal Elements on Scroll ---
if (document.querySelector(".gs-reveal")) {
  const revealElements = gsap.utils.toArray(".gs-reveal");
  revealElements.forEach((elem) => {
    gsap.fromTo(
      elem,
      { autoAlpha: 0, y: 50 },
      {
        duration: 1,
        autoAlpha: 1,
        y: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: elem,
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );
  });
}

// --- Number Counter Animation on Scroll ---
if (document.querySelector(".number-counter")) {
  const counters = gsap.utils.toArray(".number-counter");
  counters.forEach((counter) => {
    const target = parseFloat(counter.getAttribute("data-target"));
    const prefix = counter.getAttribute("data-prefix") || "";
    const suffix = counter.getAttribute("data-suffix") || "";

    gsap.fromTo(
      counter,
      { innerHTML: 0 },
      {
        innerHTML: target,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: counter,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        onUpdate: function () {
          counter.innerHTML = prefix + Math.ceil(this.targets()[0].innerHTML) + suffix;
        }
      }
    );
  });
}

// --- Hover Image Micro-interaction ---
const hoverImages = gsap.utils.toArray(".hover-image");
hoverImages.forEach((img) => {
  img.addEventListener("mouseenter", () => {
     gsap.to(img, { scale: 1.02, duration: 0.4, ease: "power2.out" });
  });
  img.addEventListener("mouseleave", () => {
     gsap.to(img, { scale: 1, duration: 0.4, ease: "power2.out" });
  });
});

const hoverCards = gsap.utils.toArray(".hover-card");
hoverCards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
     gsap.to(card, { y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)", duration: 0.3, ease: "power2.out" });
  });
  card.addEventListener("mouseleave", () => {
     gsap.to(card, { y: 0, boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", duration: 0.3, ease: "power2.out" });
  });
});
