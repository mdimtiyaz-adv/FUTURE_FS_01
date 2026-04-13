/* ==========================================
   PORTFOLIO WEBSITE — main.js
   ========================================== */

// ==================== HEADER SCROLL EFFECT ====================
const upScroll = () => {
    const header = document.querySelector("header");
    if (window.scrollY >= 40) {
        header.classList.add("header__style");
    } else {
        header.classList.remove("header__style");
    }
};
window.addEventListener("scroll", upScroll);

// ==================== TYPEWRITER EFFECT ====================
document.addEventListener("DOMContentLoaded", function () {
    const texts = ["I am a Full Stack Developer", "I build modern websites"];
    let count = 0;
    let index = 0;
    let deleting = false;

    function type() {
        const typewriterEl = document.getElementById("typeWritter");
        if (!typewriterEl) return;

        const currentText = texts[count];
        let letter = deleting
            ? currentText.slice(0, index--)
            : currentText.slice(0, ++index);
        typewriterEl.innerText = letter;

        if (!deleting && index === currentText.length) {
            deleting = true;
            setTimeout(type, 1500);
        } else if (deleting && index === 0) {
            deleting = false;
            count = (count + 1) % texts.length;
            setTimeout(type, 150);
        } else {
            setTimeout(type, 150);
        }
    }

    type();
});

// ==================== CUSTOM CURSOR ====================
const cursor = document.querySelector("#cursor");
const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

if (isTouchDevice && cursor) {
    cursor.style.display = "none";
} else if (cursor) {
    document.body.addEventListener("mousemove", (val) => {
        gsap.to(cursor, {
            x: val.x,
            y: val.y,
            duration: 1,
            ease: "back.out(1.7)",
        });
    });
}

// ==================== HAMBURGER MENU ====================
const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");
const navOverlay = document.getElementById("nav-overlay");
const navLinks = document.querySelectorAll(".nav-link");

function openMenu() {
    navMenu.classList.add("show-menu");
    navOverlay.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeMenu() {
    navMenu.classList.remove("show-menu");
    navOverlay.classList.remove("show");
    document.body.style.overflow = "";
}

if (navToggle) navToggle.addEventListener("click", openMenu);
if (navClose) navClose.addEventListener("click", closeMenu);
if (navOverlay) navOverlay.addEventListener("click", closeMenu);

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (navMenu.classList.contains("show-menu")) closeMenu();
    });
});

// ==================== PROJECT MODAL LOGIC ====================
const projectModal = document.getElementById("project-modal");
const modalClose = document.getElementById("modal-close");
const detailBtns = document.querySelectorAll(".detail-btn");

const modalTitle = document.getElementById("modal-title");
const modalPeriod = document.getElementById("modal-period");
const modalDesc = document.getElementById("modal-desc");
const modalFeatures = document.getElementById("modal-features");

function openModal(btn) {
    const title = btn.getAttribute("data-title");
    const period = btn.getAttribute("data-period");
    const desc = btn.getAttribute("data-desc");
    const features = btn.getAttribute("data-features").split(",");

    modalTitle.innerText = title;
    modalPeriod.innerText = `Period: ${period}`;
    modalDesc.innerText = desc;
    
    modalFeatures.innerHTML = "";
    features.forEach(feature => {
        const li = document.createElement("li");
        li.innerText = feature.trim();
        modalFeatures.appendChild(li);
    });

    projectModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    projectModal.classList.remove("show");
    // Only re-enable scroll if mobile menu isn't also open
    if (!navMenu.classList.contains("show-menu")) {
        document.body.style.overflow = "";
    }
}

detailBtns.forEach(btn => {
    btn.addEventListener("click", () => openModal(btn));
});

if (modalClose) modalClose.addEventListener("click", closeModal);
if (projectModal) {
    projectModal.addEventListener("click", (e) => {
        if (e.target === projectModal) closeModal();
    });
}

// ==================== ACTIVE NAV LINK ON SCROLL ====================
function highlightNav() {
    const scrollY = window.scrollY + 200;

    const sections = [
        { id: "hero_section", href: "#hero_section" },
        { id: "about-section", href: "#about-section" },
        { id: "skill-section", href: "#skill-section" },
        { id: "section-project", href: "#section-project" },
        { id: "contact", href: "#contact" },
    ];

    sections.forEach((sec) => {
        const el = document.getElementById(sec.id);
        if (!el) return;
        
        const top = el.offsetTop - 100;
        const bottom = top + el.offsetHeight;

        if (scrollY >= top && scrollY < bottom) {
            navLinks.forEach((link) => {
                link.classList.remove("active-link");
                if (link.getAttribute("href") === sec.href) {
                    link.classList.add("active-link");
                }
            });
        }
    });
}
window.addEventListener("scroll", highlightNav);

// ==================== BACK TO TOP ====================
const backToTop = document.getElementById("back-to-top");
window.addEventListener("scroll", () => {
    if (window.scrollY > 400) backToTop.classList.add("show");
    else backToTop.classList.remove("show");
});

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// ==================== SCROLL REVEAL ====================
const revealElements = document.querySelectorAll(".scroll-reveal");
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
);

revealElements.forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.05}s`;
    revealObserver.observe(el);
});

// ==================== CONTACT FORM ====================
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");

if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const btnText = submitBtn.querySelector(".btn-text");
        const btnLoading = submitBtn.querySelector(".btn-loading");

        btnText.style.display = "none";
        btnLoading.style.display = "inline-flex";
        submitBtn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                formStatus.textContent = "✓ Message sent successfully!";
                formStatus.className = "form-status success";
                contactForm.reset();
            } else {
                throw new Error();
            }
        } catch (error) {
            formStatus.textContent = "✗ Something went wrong. Try again later.";
            formStatus.className = "form-status error";
        } finally {
            btnText.style.display = "inline";
            btnLoading.style.display = "none";
            submitBtn.disabled = false;
            setTimeout(() => { formStatus.textContent = ""; }, 5000);
        }
    });
}