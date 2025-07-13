/**
* AllCellphones - Main JavaScript
* Combining Strategy template functionality with AllCellphones interactive features
* Based on Strategy Bootstrap Template by BootstrapMade.com
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToggle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToggle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToggle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    // COMPLETELY DISABLE AOS TO PREVENT FADE ISSUES
    // AOS.init({
    //   duration: 600,
    //   easing: 'ease-in-out',
    //   once: true,
    //   mirror: false,
    //   offset: 120,
    //   disable: function() {
    //     return window.innerWidth < 768;
    //   }
    // });
    
    // Instead, ensure ALL elements are immediately visible
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      if (el.hasAttribute('data-aos')) {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.visibility = 'visible';
        el.removeAttribute('data-aos');
        el.removeAttribute('data-aos-delay');
      }
    });
  }
  
  // Initialize AOS after DOM is ready
  window.addEventListener('load', aosInit);
  
  // Also initialize immediately if DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', aosInit);
  } else {
    aosInit();
  }

  /**
   * AllCellphones specific enhancements
   */
  
  // Enhanced service card interactions
  function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
        this.style.boxShadow = '0 20px 40px rgba(0, 122, 255, 0.2)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '';
      });
    });
  }

  // Trust badge animations
  function initTrustBadges() {
    const trustBadges = document.querySelectorAll('.trust-badge');
    
    trustBadges.forEach((badge, index) => {
      badge.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px) scale(1.05)';
        this.style.background = 'rgba(0, 122, 255, 0.2)';
      });
      
      badge.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.background = 'rgba(0, 122, 255, 0.1)';
      });
    });
  }

  // Enhanced button interactions with ripple effect
  function initButtonEnhancements() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
      btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.pointerEvents = 'none';

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    // Add ripple animation keyframes
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Smooth scrolling for navigation links
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Contact form enhancements
  function initContactForm() {
    const form = document.querySelector('.php-email-form, .contact-form');
    if (!form) return;

    const formInputs = form.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
      // Enhanced focus states
      input.addEventListener('focus', function() {
        this.parentElement.style.borderColor = 'var(--accent-color)';
        this.parentElement.style.boxShadow = '0 0 0 3px rgba(0, 122, 255, 0.1)';
      });
      
      input.addEventListener('blur', function() {
        this.parentElement.style.borderColor = '';
        this.parentElement.style.boxShadow = '';
      });
    });

    // Form submission with enhanced feedback
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const loading = this.querySelector('.loading');
      const errorMessage = this.querySelector('.error-message');
      const sentMessage = this.querySelector('.sent-message');
      const submitBtn = this.querySelector('.btn-submit');

      // Show loading state
      loading.style.display = 'block';
      errorMessage.style.display = 'none';
      sentMessage.style.display = 'none';
      submitBtn.disabled = true;
      submitBtn.textContent = 'ENVIANDO...';

      // Simulate form submission (replace with actual form handling)
      setTimeout(() => {
        loading.style.display = 'none';
        sentMessage.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'ENVIAR MENSAJE';
        
        // Reset form
        this.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          sentMessage.style.display = 'none';
        }, 5000);
      }, 2000);
    });
  }

  // WhatsApp floating button
  function initWhatsAppButton() {
    const whatsappBtn = document.createElement('div');
    whatsappBtn.id = 'whatsapp-float';
    whatsappBtn.innerHTML = `
      <a href="https://wa.me/5493515054213" target="_blank" title="Contactar por WhatsApp">
        <i class="bi bi-whatsapp"></i>
      </a>
    `;
    
    const styles = `
      #whatsapp-float {
        position: fixed;
        bottom: 20px;
        right: 90px;
        z-index: 1000;
        animation: float 3s ease-in-out infinite;
      }
      
      #whatsapp-float a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        background: #25d366;
        border-radius: 50%;
        color: white;
        font-size: 24px;
        text-decoration: none;
        box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
        transition: all 0.3s ease;
      }
      
      #whatsapp-float a:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 25px rgba(37, 211, 102, 0.6);
        color: white;
      }
      
      @media (max-width: 768px) {
        #whatsapp-float {
          bottom: 15px;
          right: 15px;
        }
        
        #whatsapp-float a {
          width: 50px;
          height: 50px;
          font-size: 20px;
        }
      }
      
      @media (max-width: 480px) {
        #whatsapp-float {
          bottom: 90px;
          right: 15px;
        }
      }
    `;
    
    if (!document.querySelector('#whatsapp-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'whatsapp-styles';
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(whatsappBtn);
  }

  // Intersection Observer for scroll animations
  function initScrollAnimations() {
    // DISABLED: Custom scroll animations to prevent fade issues
    return;
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations - exclude hero and about section elements
    const animatedElements = [...document.querySelectorAll('.iphone-category, .contact-info-box, .training-highlights .highlight-card')];
    
    // Only apply scroll animations to service cards that are NOT in the hero or about sections
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
      const heroSection = card.closest('#hero');
      const aboutSection = card.closest('#about');
      if (!heroSection && !aboutSection) {
        animatedElements.push(card);
      }
    });
    
    // Only apply scroll animations to trust badges that are NOT in the hero section
    const trustBadges = document.querySelectorAll('.trust-badge');
    trustBadges.forEach(badge => {
      const heroSection = badge.closest('#hero');
      if (!heroSection) {
        animatedElements.push(badge);
      }
    });
    
    animatedElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observer.observe(el);
    });
  }

  // FAQ functionality is handled by individual page scripts to avoid conflicts

  // Initialize all enhancements
  function initAllCellphones() {
    initServiceCards();
    initTrustBadges();
    initButtonEnhancements();
    initSmoothScrolling();
    initContactForm();
    initWhatsAppButton();
    initScrollAnimations();
    
    // AGGRESSIVE FIX: Force ALL elements to be visible
    function forceAllElementsVisible() {
      // Remove ALL AOS attributes from the entire page
      const allElementsWithAOS = document.querySelectorAll('[data-aos]');
      allElementsWithAOS.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.visibility = 'visible';
        el.removeAttribute('data-aos');
        el.removeAttribute('data-aos-delay');
        el.removeAttribute('data-aos-duration');
        el.removeAttribute('data-aos-easing');
      });
      
      // Force visibility for all major sections
      const allSections = document.querySelectorAll('#hero, #about, #services, #training, #iphones, #call-to-action, #contact');
      allSections.forEach(section => {
        section.style.opacity = '1';
        section.style.visibility = 'visible';
        
        // Force visibility for all children
        const allChildren = section.querySelectorAll('*');
        allChildren.forEach(child => {
          child.style.opacity = '1';
          child.style.visibility = 'visible';
          child.style.transform = 'none';
        });
      });
    }
    
    // Apply fixes immediately and repeatedly
    forceAllElementsVisible();
    setTimeout(forceAllElementsVisible, 10);
    setTimeout(forceAllElementsVisible, 50);
    setTimeout(forceAllElementsVisible, 100);
    setTimeout(forceAllElementsVisible, 200);
    setTimeout(forceAllElementsVisible, 500);
  }

  // Initialize everything when DOM is loaded
  document.addEventListener('DOMContentLoaded', initAllCellphones);

  // Performance optimization: debounce scroll events
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Apply debounce to scroll-heavy functions
  const debouncedScroll = debounce(() => {
    toggleScrolled();
    toggleScrollTop();
  }, 10);

  window.addEventListener('scroll', debouncedScroll);

  // Keyboard navigation improvements
  document.addEventListener('keydown', (e) => {
    // Escape key closes dropdowns
    if (e.key === 'Escape') {
      const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
      openDropdowns.forEach(dropdown => {
        const toggle = dropdown.previousElementSibling;
        if (toggle) {
          toggle.click();
        }
      });
      
      // Close mobile menu
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToggle();
      }
    }
  });

  // CRITICAL: Form Validation System
  const forms = document.querySelectorAll('.php-email-form, .contact-form');
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    // Real-time validation
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearFieldError(input));
    });
    
    // Form submission validation
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(form)) {
        submitForm(form);
      }
    });
  });
  
  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'Este campo es obligatorio.';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Por favor, ingresa un email válido.';
      }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
        errorMessage = 'Por favor, ingresa un teléfono válido.';
      }
    }
    
    // Name validation
    if (field.name === 'name' && value && value.length < 2) {
      isValid = false;
      errorMessage = 'El nombre debe tener al menos 2 caracteres.';
    }
    
    // Message validation
    if (field.name === 'message' && value && value.length < 10) {
      isValid = false;
      errorMessage = 'El mensaje debe tener al menos 10 caracteres.';
    }
    
    showFieldValidation(field, isValid, errorMessage);
    return isValid;
  }
  
  function showFieldValidation(field, isValid, errorMessage) {
    const formGroup = field.closest('.form-group') || field.parentElement;
    let feedback = formGroup.querySelector('.invalid-feedback');
    
    field.classList.remove('is-valid', 'is-invalid');
    
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      formGroup.appendChild(feedback);
    }
    
    if (isValid) {
      field.classList.add('is-valid');
      feedback.style.display = 'none';
    } else {
      field.classList.add('is-invalid');
      feedback.textContent = errorMessage;
      feedback.style.display = 'block';
    }
  }
  
  function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const formGroup = field.closest('.form-group') || field.parentElement;
    const feedback = formGroup.querySelector('.invalid-feedback');
    if (feedback) {
      feedback.style.display = 'none';
    }
  }
  
  function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
      if (!validateField(input)) {
        isFormValid = false;
      }
    });
    
    return isFormValid;
  }
  
  function submitForm(form) {
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    const originalText = submitButton.textContent;
    const loading = form.querySelector('.loading');
    const errorMessage = form.querySelector('.error-message');
    const sentMessage = form.querySelector('.sent-message');
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="bi bi-arrow-clockwise"></i> Enviando...';
    
    // Show loading and hide other messages
    if (loading) loading.style.display = 'block';
    if (errorMessage) errorMessage.style.display = 'none';
    if (sentMessage) sentMessage.style.display = 'none';
    
    // Get form data
    const formData = new FormData(form);
    
    // Submit to Formspree
    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (loading) loading.style.display = 'none';
      
      if (response.ok) {
        // Success
        if (sentMessage) sentMessage.style.display = 'block';
        
        // Reset form
        form.reset();
        form.querySelectorAll('.is-valid, .is-invalid').forEach(field => {
          field.classList.remove('is-valid', 'is-invalid');
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          if (sentMessage) sentMessage.style.display = 'none';
        }, 5000);
      } else {
        // Error response from Formspree
        response.json().then(data => {
          if (errorMessage) {
            const errorSpan = errorMessage.querySelector('span');
            const errorText = data.error || 'Hubo un problema al enviar el mensaje. Por favor intenta nuevamente.';
            if (errorSpan) {
              errorSpan.textContent = errorText;
            } else {
              errorMessage.textContent = errorText;
            }
            errorMessage.style.display = 'block';
          }
        }).catch(() => {
          if (errorMessage) {
            const errorSpan = errorMessage.querySelector('span');
            const errorText = 'Hubo un problema al enviar el mensaje. Por favor intenta nuevamente.';
            if (errorSpan) {
              errorSpan.textContent = errorText;
            } else {
              errorMessage.textContent = errorText;
            }
            errorMessage.style.display = 'block';
          }
        });
      }
    })
    .catch(error => {
      if (loading) loading.style.display = 'none';
      if (errorMessage) {
        const errorSpan = errorMessage.querySelector('span');
        const errorText = 'Error de conexión. Por favor verifica tu conexión a internet e intenta nuevamente.';
        if (errorSpan) {
          errorSpan.textContent = errorText;
        } else {
          errorMessage.textContent = errorText;
        }
        errorMessage.style.display = 'block';
      }
    })
    .finally(() => {
      // Reset button
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    });
  }
  
  function showFormMessage(form, type, message) {
    let messageDiv = form.querySelector('.form-message');
    if (!messageDiv) {
      messageDiv = document.createElement('div');
      messageDiv.className = 'form-message';
      form.appendChild(messageDiv);
    }
    
    messageDiv.className = `form-message alert alert-${type === 'success' ? 'success' : 'danger'}`;
    messageDiv.innerHTML = `<i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i> ${message}`;
    messageDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      messageDiv.style.display = 'none';
    }, 5000);
  }

})();