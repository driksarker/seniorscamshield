// =========================================================
// Senior Scam Shield — interactions
// =========================================================

// Checkout buttons have their href, target, and rel set directly in the HTML
// (https://seniorscamshield.gumroad.com/l/kubmg). No JS override here — that
// would clobber the real product URL.

// Accordion (How it works + FAQ)
document.querySelectorAll('[data-accordion]').forEach(group => {
  const rows = group.querySelectorAll('.acc-row, .faq-row');
  rows.forEach(row => {
    const btn = row.querySelector('.acc-head, .faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const wasOpen = row.classList.contains('is-open');
      // Close all in this group
      rows.forEach(r => {
        r.classList.remove('is-open');
        const b = r.querySelector('.acc-head, .faq-q');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      // Toggle current
      if (!wasOpen) {
        row.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
});

// Reveal on scroll
const revealEls = document.querySelectorAll(
  '.section-header, .card, .acc-row, .examples-card, .reviews-card, .founder, .faq-row, .final-cta'
);
revealEls.forEach(el => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        const delay = (i % 4) * 60;
        setTimeout(() => e.target.classList.add('in'), delay);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// Mobile menu toggle + auto-close
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
function closeMobileNav() {
  if (!nav || !toggle) return;
  nav.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
}
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  // Close menu when any nav item is tapped
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Close on Escape or when clicking outside
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) closeMobileNav();
  });
  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('is-open')) return;
    if (nav.contains(e.target) || toggle.contains(e.target)) return;
    closeMobileNav();
  });
}

// Smooth scroll for internal anchor links (offsets the sticky header)
const HEADER_OFFSET = 80;
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length <= 1 || id === '#') return; // ignore bare "#" links
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', id);
  });
});
