// Premium Loading Screen
window.addEventListener("load", () => {
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 1200); // Give the CSS animation time to complete
});

// DOM Elements
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const currentYear = document.querySelector("#current-year");
const backToTopBtn = document.getElementById("back-to-top");
const progressCircle = document.querySelector(".progress-ring__circle");
const progressBar = document.getElementById("scroll-progress-bar");
const siteHeader = document.querySelector(".site-header");
const navIndicator = document.querySelector(".nav-indicator");
const ambientWaves = document.getElementById("ambient-waves");

// Set Current Year
if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

// Canvas Starfield Logic
const canvas = document.getElementById("starfield");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let stars = [];
  
  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars(); // Re-populate on resize
  };
  
  const createStars = () => {
    stars = [];
    // Responsive density: roughly 1 star per 2500px^2 area
    const numStars = Math.floor((canvas.width * canvas.height) / 2500);
    for(let i=0; i<numStars; i++) {
      // 10% of particles are "dust" (large, faint, slow)
      const isDust = Math.random() > 0.9;
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: isDust ? Math.random() * 4 + 2 : Math.random() * 1.2 + 0.3,
        baseAlpha: isDust ? Math.random() * 0.03 + 0.01 : Math.random() * 0.4 + 0.1,
        phase: Math.random() * Math.PI * 2,
        speed: isDust ? (Math.random() * 0.005) + 0.001 : (Math.random() * 0.03) + 0.005,
        sparkle: !isDust && Math.random() > 0.93, // 7% chance of intense sparkling for stars only
        isDust: isDust
      });
    }
  };
  
  const drawStars = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
      star.phase += star.speed;
      
      // Drift dust slowly upwards
      if (star.isDust) {
        star.y -= star.speed * 20;
        if (star.y < -10) star.y = canvas.height + 10;
      }

      // Oscillate alpha
      let alpha = star.baseAlpha;
      if (!star.isDust) {
        alpha += Math.sin(star.phase) * (star.sparkle ? 0.5 : 0.2);
        alpha = Math.max(0, Math.min(1, alpha));
      }
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  };
  
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    requestAnimationFrame(drawStars);
  } else {
    // Static render for reduced motion
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.baseAlpha})`;
      ctx.fill();
    });
  }
}

// Custom Cursor & Mouse Parallax
const cursor = document.getElementById("custom-cursor");
const cursorRing = document.getElementById("cursor-ring");
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;
let isCursorActive = false;

if (cursor && cursorRing && window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  isCursorActive = true;
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Update center dot instantly
    cursor.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
    
    // Ambient Waves Parallax (15-20px max movement)
    if (ambientWaves) {
      const xOffset = ((mouseX / window.innerWidth) - 0.5) * 40;
      const yOffset = ((mouseY / window.innerHeight) - 0.5) * 40;
      ambientWaves.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    }
  });

  const animateRing = () => {
    // Smooth interpolation for the outer ring
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    
    cursorRing.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
    requestAnimationFrame(animateRing);
  };
  requestAnimationFrame(animateRing);

  // Add hover states to interactive elements
  const interactiveElements = document.querySelectorAll("a, button, input, textarea, .interactive, .interactive-icon");
  interactiveElements.forEach(el => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("hover");
      cursorRing.classList.add("hover");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("hover");
      cursorRing.classList.remove("hover");
    });
  });

  // 3D Card Mouse Parallax
  const cards = document.querySelectorAll(".info-card, .skill-card, .project-card, .education-card, .certification-card");
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate rotation (max 2 degrees)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -2;
      const rotateY = ((x - centerX) / centerX) * 2;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener("mouseleave", () => {
      card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
    });
  });
}

// Color Evolution System
const colorStops = [
  { percent: 0, c1: [14, 165, 233], c2: [59, 130, 246] }, // Deep Blue / Sky Blue
  { percent: 0.25, c1: [20, 184, 166], c2: [99, 102, 241] }, // Teal / Indigo (Dramatic shift)
  { percent: 0.5, c1: [16, 185, 129], c2: [14, 165, 233] }, // Emerald / Sky Blue
  { percent: 0.75, c1: [99, 102, 241], c2: [236, 72, 153] }, // Indigo / Pink
  { percent: 1, c1: [245, 158, 11], c2: [225, 29, 72] } // Amber / Rose
];

const lerpColor = (start, end, factor) => {
  return [
    Math.round(start[0] + (end[0] - start[0]) * factor),
    Math.round(start[1] + (end[1] - start[1]) * factor),
    Math.round(start[2] + (end[2] - start[2]) * factor)
  ];
};

const updateAmbientColors = (scrollPercent) => {
  let startStop = colorStops[0];
  let endStop = colorStops[colorStops.length - 1];
  
  for (let i = 0; i < colorStops.length - 1; i++) {
    if (scrollPercent >= colorStops[i].percent && scrollPercent <= colorStops[i+1].percent) {
      startStop = colorStops[i];
      endStop = colorStops[i+1];
      break;
    }
  }
  
  const range = endStop.percent - startStop.percent;
  const factor = range === 0 ? 0 : (scrollPercent - startStop.percent) / range;
  
  const c1 = lerpColor(startStop.c1, endStop.c1, factor);
  const c2 = lerpColor(startStop.c2, endStop.c2, factor);
  
  document.documentElement.style.setProperty('--ambient-rgb-1', `${c1[0]}, ${c1[1]}, ${c1[2]}`);
  document.documentElement.style.setProperty('--ambient-rgb-2', `${c2[0]}, ${c2[1]}, ${c2[2]}`);
  document.documentElement.style.setProperty('--ambient-color-1', `rgba(${c1[0]}, ${c1[1]}, ${c1[2]}, 0.35)`);
  document.documentElement.style.setProperty('--ambient-color-2', `rgba(${c2[0]}, ${c2[1]}, ${c2[2]}, 0.35)`);
};

// Navigation Pill Indicator Logic
const updateNavIndicator = (activeLink) => {
  if (!navIndicator || window.innerWidth < 900) return;
  
  if (activeLink) {
    const linkRect = activeLink.getBoundingClientRect();
    const navRect = document.querySelector('.nav-menu').getBoundingClientRect();
    
    navIndicator.style.width = `${linkRect.width}px`;
    navIndicator.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
    navIndicator.style.opacity = '1';
  } else {
    navIndicator.style.opacity = '0';
  }
};

const setActiveLink = (sectionId) => {
  let activeFound = false;
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === `#${sectionId}`) {
      link.classList.add("active");
      updateNavIndicator(link);
      activeFound = true;
    } else {
      link.classList.remove("active");
    }
  });
  if (!activeFound) updateNavIndicator(null);
};

// Mobile Menu
const closeMenu = () => {
  navMenu.classList.remove("open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
};

const openMenu = () => {
  navMenu.classList.add("open");
  document.body.classList.add("menu-open");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
};

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.contains("open") ? closeMenu() : openMenu();
  });
  navLinks.forEach(link => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900) {
      if (navMenu.classList.contains("open")) closeMenu();
      const activeLink = document.querySelector('.nav-link.active');
      updateNavIndicator(activeLink);
    }
  });
}

// Scroll Progress & SVG Ring setup
let circumference = 0;
if (progressCircle) {
  const radius = progressCircle.r.baseVal.value;
  circumference = radius * 2 * Math.PI;
  progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
  progressCircle.style.strokeDashoffset = circumference;
}

// Intersection Observer for scroll animations (Staggered Reveals & Scroll Spy)
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Trigger CSS Reveal
          entry.target.classList.add('visible');
          
          // Scroll spy check
          if (entry.target.tagName.toLowerCase() === 'section' && entry.target.id) {
            setActiveLink(entry.target.id);
          }
          
          // Stop observing to trigger only once
          if (entry.target.classList.contains('reveal-up') || 
              entry.target.classList.contains('reveal-left') || 
              entry.target.classList.contains('reveal-right') || 
              entry.target.classList.contains('reveal-scale') || 
              entry.target.classList.contains('reveal-blur') ||
              entry.target.classList.contains('section-heading')) {
            observer.unobserve(entry.target);
          }
        }
      });
    },
    { rootMargin: "0px 0px -15% 0px", threshold: 0 }
  );

  sections.forEach(section => observer.observe(section));
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .section-heading').forEach(el => observer.observe(el));
} else {
  // Fallback / Reduced Motion
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .section-heading').forEach(el => el.classList.add('visible'));
}

// Unified Scroll Event
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = docHeight > 0 ? (Math.max(0, Math.min(1, scrollY / docHeight))) : 0;
  
  // Dynamic Shadow Offset (moves from 4px to 12px based on scroll depth)
  const shadowY = 4 + (scrollPercent * 8);
  document.documentElement.style.setProperty('--shadow-y', `${shadowY}px`);

  // Ambient Color Evolution
  updateAmbientColors(scrollPercent);
  
  // Navbar Shrink
  if (scrollY > 50) {
    siteHeader.classList.add("scrolled");
  } else {
    siteHeader.classList.remove("scrolled");
  }

  // Top Progress Bar
  if (progressBar) {
    progressBar.style.width = `${scrollPercent * 100}%`;
  }
  
  // Mobile Scroll Indicator
  const mobileScrollIndicator = document.getElementById("mobile-scroll-indicator");
  if (mobileScrollIndicator) {
    mobileScrollIndicator.style.height = `${scrollPercent * 100}%`;
  }

  // Back to Top Button & SVG Ring
  if (backToTopBtn) {
    if (scrollY > 400) {
      backToTopBtn.classList.add("visible");
      if (progressCircle) {
        progressCircle.style.strokeDashoffset = circumference - (scrollPercent * circumference);
      }
    } else {
      backToTopBtn.classList.remove("visible");
    }
  }
  
  // Fallback Scroll Spy
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let currentSection = "hero";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop) {
        currentSection = section.id;
      }
    });
    setActiveLink(currentSection);
  }
});

// Initial Color Set
updateAmbientColors(0);

// Back to Top Click
if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Contact Form AJAX Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i><span>Sending...</span>';
    submitBtn.disabled = true;

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    .then(async (response) => {
      if (response.status == 200) {
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i><span>Message Sent!</span>';
        submitBtn.style.background = '#10b981'; /* Emerald success color */
        contactForm.reset();
        
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      } else {
        submitBtn.innerHTML = '<i class="fa-solid fa-xmark"></i><span>Error. Try Again</span>';
        submitBtn.style.background = '#ef4444'; /* Red error color */
        
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }
    })
    .catch(error => {
      submitBtn.innerHTML = '<i class="fa-solid fa-xmark"></i><span>Network Error</span>';
      submitBtn.style.background = '#ef4444';
      
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    });
  });
}
