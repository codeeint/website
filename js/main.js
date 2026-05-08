// Custom Cursor Tracking
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

if (cursor && cursorRing) {
  document.addEventListener('mousemove', (e) => {
    // Update main cursor instantly
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Update ring with slight delay for smooth effect
    setTimeout(() => {
      cursorRing.style.left = e.clientX + 'px';
      cursorRing.style.top = e.clientY + 'px';
    }, 50);
  });

  // Add hover state for interactive elements
  const interactives = document.querySelectorAll('a, button, .btn, .sector-card, .p-card, .cap-card, .testimo-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
  });
}

// Mobile Nav Toggle
function toggleMobileNav() {
  const mobileNav = document.getElementById('mobile-nav');
  const hamburger = document.querySelector('.nav-hamburger');
  if (mobileNav) {
    mobileNav.classList.toggle('open');
    // Simple hamburger animation
    if (mobileNav.classList.contains('open')) {
      hamburger.children[0].style.transform = 'translateY(7px) rotate(45deg)';
      hamburger.children[1].style.opacity = '0';
      hamburger.children[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      hamburger.children[0].style.transform = 'none';
      hamburger.children[1].style.opacity = '1';
      hamburger.children[2].style.transform = 'none';
    }
  }
}

// Scroll Reveal Animations
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Counter Animation
        if (entry.target.classList.contains('stat-item') || entry.target.querySelector('.stat-num, .nvc-n')) {
          const numEl = entry.target.querySelector('.stat-num') || entry.target.querySelector('.nvc-n');
          if (numEl && numEl.hasAttribute('data-count') && !numEl.classList.contains('counted')) {
            animateValue(numEl, 0, parseInt(numEl.getAttribute('data-count')), 1500, numEl.getAttribute('data-suffix') || '');
            numEl.classList.add('counted');
          }
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  
  revealElements.forEach(el => revealObserver.observe(el));
}

// Number Counter Animation
function animateValue(obj, start, end, duration, suffix = '') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // easing out
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeProgress * (end - start) + start);
    obj.innerHTML = current + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.innerHTML = end + suffix;
    }
  };
  window.requestAnimationFrame(step);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
});

/**
 * PRODUCTION-READY FORM HANDLER (EmailJS)
 * This function handles all form submissions across the site.
 */
async function handleFormSubmission(event, serviceId = 'service_5k8stto', templateId = 'YOUR_TEMPLATE_ID') {
  event.preventDefault();
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;

  // 1. Loading State
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="ph ph-spinner-gap" style="animation: spin 1s linear infinite;"></i> Sending...';

  try {
    // 2. Send via EmailJS
    const response = await emailjs.sendForm(serviceId, templateId, form);
    
    if (response.status === 200) {
      // 3. Success State
      submitBtn.innerHTML = '<i class="ph ph-check"></i> Sent Successfully!';
      submitBtn.style.background = '#22c55e';
      form.reset();
      
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        submitBtn.style.background = '';
        alert("Thank you! Your enquiry has been sent. Our team will get back to you within 24-48 hours.");
      }, 3000);
    }
  } catch (error) {
    console.error("EmailJS Error:", error);
    submitBtn.innerHTML = '<i class="ph ph-warning"></i> Error. Try again?';
    submitBtn.style.background = '#ef4444';
    submitBtn.disabled = false;
    
    setTimeout(() => {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.style.background = '';
    }, 4000);
  }
}

// Add CSS for spinner if not present
const style = document.createElement('style');
style.textContent = `
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);
