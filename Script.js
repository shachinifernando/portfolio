// script.js — Shachini's Portfolio
// Module: IN1601 Multimedia Technologies & Web Design
// I put all my JavaScript in one file to keep things simple
// and organized. Each section has a comment explaining what it does.

// ========================================================
// Wait for the page to fully load before running anything
// ========================================================
document.addEventListener("DOMContentLoaded", function () {

  // -------------------------------------------------------
  // 1. LOADING SCREEN
  // Hide the loader after a short delay so the page feels
  // polished when it first opens
  // -------------------------------------------------------
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(function () {
      loader.classList.add("hidden");
    }, 1200);
  }


  // -------------------------------------------------------
  // 2. AUTO-UPDATING YEAR IN FOOTER
  // So I don't have to manually update the copyright year
  // every year — smart! (learned this trick online)
  // -------------------------------------------------------
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  // -------------------------------------------------------
  // 3. DARK MODE TOGGLE
  // Saves preference in localStorage so it stays on reload
  // -------------------------------------------------------
  const darkToggle = document.getElementById("darkToggle");
  const toggleIcon  = document.getElementById("toggleIcon");

  // Check if user already set a preference before
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    document.body.classList.remove("light-mode");
    if (toggleIcon) toggleIcon.textContent = "☀️";
  }

  if (darkToggle) {
    darkToggle.addEventListener("click", function () {
      document.body.classList.toggle("dark-mode");
      document.body.classList.toggle("light-mode");

      const isDark = document.body.classList.contains("dark-mode");
      if (toggleIcon) toggleIcon.textContent = isDark ? "☀️" : "🌙";

      // Save to localStorage
      localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
    });
  }


  // -------------------------------------------------------
  // 4. NAVBAR — scroll effect + active link highlight
  // Adds a background to the navbar when scrolled down,
  // and highlights the current section's link
  // -------------------------------------------------------
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", function () {
    // Navbar background
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }

    // Scroll to top button visibility
    const scrollBtn = document.getElementById("scrollTop");
    if (scrollBtn) {
      if (window.scrollY > 400) {
        scrollBtn.classList.add("visible");
      } else {
        scrollBtn.classList.remove("visible");
      }
    }

    // Active nav link — highlights the link for the section currently in view
    // This only works on the home page where sections have IDs
    const sections = document.querySelectorAll("section[id]");
    let currentSection = "";

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove("active");
      // Check if the link's href ends with the current section ID
      if (link.getAttribute("href") === "#" + currentSection) {
        link.classList.add("active");
      }
    });
  });


  // -------------------------------------------------------
  // 5. HAMBURGER MENU (for mobile)
  // Shows/hides the nav links on small screens
  // -------------------------------------------------------
  const hamburger = document.getElementById("hamburger");
  const mobileNav  = document.getElementById("navLinks");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", function () {
      mobileNav.classList.toggle("open");
    });

    // Close menu when a link is clicked on mobile
    mobileNav.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("open");
      });
    });
  }


  // -------------------------------------------------------
  // 6. TYPING EFFECT (Hero Section)
  // Cycles through different role descriptions with a
  // typing and deleting animation
  // -------------------------------------------------------
  const typedEl = document.getElementById("typed-text");

  if (typedEl) {
    // List of things to type out
    const phrases = [
      "ITM Student 💻",
      "Web Developer (learning)",
      "Hardware Enthusiast ⚡",
      "Problem Solver 🔧",
      "Curious Human 🌱"
    ];

    let phraseIndex   = 0;   // which phrase we're on
    let charIndex     = 0;   // which character in the phrase
    let isDeleting    = false;
    let typingSpeed   = 100; // ms between each character

    function typeEffect() {
      const current = phrases[phraseIndex];

      if (!isDeleting) {
        // Typing forward
        typedEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === current.length) {
          // Finished typing — pause then start deleting
          isDeleting = true;
          typingSpeed = 1800; // wait before deleting
        } else {
          typingSpeed = 100;
        }
      } else {
        // Deleting
        typedEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          // Done deleting — move to next phrase
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          typingSpeed = 400; // small pause before typing next
        } else {
          typingSpeed = 55;
        }
      }

      setTimeout(typeEffect, typingSpeed);
    }

    // Start after a bit of delay so loader finishes first
    setTimeout(typeEffect, 1500);
  }


  // -------------------------------------------------------
  // 7. ANIMATED SKILL BARS
  // The bars animate from 0 to their target width when
  // the skills section scrolls into view
  // -------------------------------------------------------
  const skillFills = document.querySelectorAll(".skill-fill");

  // IntersectionObserver watches for elements entering the viewport
  if (skillFills.length > 0) {
    const skillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute("data-width");
          bar.style.width = targetWidth + "%";
          skillObserver.unobserve(bar); // stop watching once animated
        }
      });
    }, { threshold: 0.3 });

    skillFills.forEach(function (bar) {
      skillObserver.observe(bar);
    });
  }


  // -------------------------------------------------------
  // 8. SCROLL TO TOP BUTTON
  // Smooth scrolls back to the top of the page
  // -------------------------------------------------------
  const scrollTopBtn = document.getElementById("scrollTop");

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }


  // -------------------------------------------------------
  // 9. CONTACT FORM VALIDATION
  // Checks that all fields are filled in correctly before
  // "submitting" — no backend needed, just shows success msg
  // -------------------------------------------------------
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();  // stop the form from actually submitting/refreshing

      // Get all field values
      const name    = document.getElementById("name");
      const email   = document.getElementById("email");
      const subject = document.getElementById("subject");
      const message = document.getElementById("message");

      // Get all error message spans
      const nameErr    = document.getElementById("nameError");
      const emailErr   = document.getElementById("emailError");
      const subjectErr = document.getElementById("subjectError");
      const messageErr = document.getElementById("messageError");

      // Reset errors before validating again
      clearErrors([name, email, subject, message]);
      clearMessages([nameErr, emailErr, subjectErr, messageErr]);

      let isValid = true; // assume valid, set false if any check fails

      // --- Validate Name ---
      if (name.value.trim() === "") {
        showError(name, nameErr, "Please enter your name.");
        isValid = false;
      } else if (name.value.trim().length < 2) {
        showError(name, nameErr, "Name must be at least 2 characters.");
        isValid = false;
      }

      // --- Validate Email ---
      // Simple email check using a regular expression
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email.value.trim() === "") {
        showError(email, emailErr, "Please enter your email.");
        isValid = false;
      } else if (!emailPattern.test(email.value.trim())) {
        showError(email, emailErr, "Please enter a valid email address.");
        isValid = false;
      }

      // --- Validate Subject ---
      if (subject.value.trim() === "") {
        showError(subject, subjectErr, "Please enter a subject.");
        isValid = false;
      }

      // --- Validate Message ---
      if (message.value.trim() === "") {
        showError(message, messageErr, "Please write a message.");
        isValid = false;
      } else if (message.value.trim().length < 10) {
        showError(message, messageErr, "Message is too short. Write at least 10 characters.");
        isValid = false;
      }

      // If everything passed, show success and clear the form
      if (isValid) {
        const successMsg = document.getElementById("successMsg");
        if (successMsg) {
          successMsg.classList.add("show");
          // Auto-hide after 5 seconds
          setTimeout(function () {
            successMsg.classList.remove("show");
          }, 5000);
        }

        // Clear all fields
        contactForm.reset();
      }
    });

    // Real-time: remove error styling as user starts typing
    const fields = contactForm.querySelectorAll("input, textarea");
    fields.forEach(function (field) {
      field.addEventListener("input", function () {
        field.classList.remove("error");
        const errId = field.id + "Error";
        const errEl = document.getElementById(errId);
        if (errEl) errEl.textContent = "";
      });
    });
  }

  // Helper: mark a field as invalid and show error text
  function showError(field, errorEl, message) {
    field.classList.add("error");
    if (errorEl) errorEl.textContent = message;
  }

  // Helper: remove error class from a list of fields
  function clearErrors(fields) {
    fields.forEach(function (f) {
      if (f) f.classList.remove("error");
    });
  }

  // Helper: clear error message text
  function clearMessages(errorEls) {
    errorEls.forEach(function (el) {
      if (el) el.textContent = "";
    });
  }


  // -------------------------------------------------------
  // 10. FADE-IN ANIMATION ON SCROLL
  // Adds a little animation when sections scroll into view
  // Makes the page feel more alive without being annoying
  // -------------------------------------------------------
  const fadeTargets = document.querySelectorAll(
    ".project-card, .skill-item, .learned-card, .timeline-item, .fact"
  );

  if (fadeTargets.length > 0) {
    const fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          // stagger the animation a bit based on index
          setTimeout(function () {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, i * 60);
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeTargets.forEach(function (el) {
      // Start invisible and slightly below
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      fadeObserver.observe(el);
    });
  }

}); // end DOMContentLoaded