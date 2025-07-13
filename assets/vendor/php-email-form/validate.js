/**
* AllCellphones Contact Form Validation - Enhanced
* Based on PHP Email Form Validation v3.10
* Enhanced for AllCellphones website functionality
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function(form) {
    // Add real-time validation
    addRealTimeValidation(form);
    
    form.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute('action');
      
      if (!action) {
        displayError(thisForm, 'Error de configuración del formulario');
        return;
      }

      // Client-side validation
      if (!validateForm(thisForm)) {
        return;
      }

      // Show loading state
      showLoading(thisForm);

      let formData = new FormData(thisForm);

      // Submit form
      submitForm(thisForm, action, formData);
    });
  });

  function addRealTimeValidation(form) {
    // Email validation
    const emailInputs = form.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateEmail(this);
      });
    });

    // Required field validation
    const requiredInputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    requiredInputs.forEach(input => {
      input.addEventListener('blur', function() {
        validateRequired(this);
      });
    });

    // Phone validation (if present)
    const phoneInputs = form.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
      input.addEventListener('input', function() {
        formatPhone(this);
      });
    });
  }

  function validateForm(form) {
    let isValid = true;
    
    // Clear previous validation states
    clearValidationStates(form);

    // Validate required fields
    const requiredFields = form.querySelectorAll('input[required], textarea[required], select[required]');
    requiredFields.forEach(field => {
      if (!validateRequired(field)) {
        isValid = false;
      }
    });

    // Validate email fields
    const emailFields = form.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
      if (field.value && !validateEmail(field)) {
        isValid = false;
      }
    });

    // Validate message length
    const messageField = form.querySelector('textarea[name="message"]');
    if (messageField && messageField.value.trim().length < 10) {
      setFieldError(messageField, 'El mensaje debe tener al menos 10 caracteres');
      isValid = false;
    }

    if (!isValid) {
      displayError(form, 'Por favor corregí los errores marcados en el formulario');
    }

    return isValid;
  }

  function validateRequired(field) {
    const value = field.value.trim();
    
    if (!value) {
      setFieldError(field, 'Este campo es obligatorio');
      return false;
    }

    // Name validation
    if (field.name === 'name' && value.length < 2) {
      setFieldError(field, 'El nombre debe tener al menos 2 caracteres');
      return false;
    }

    setFieldSuccess(field);
    return true;
  }

  function validateEmail(field) {
    const email = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
      setFieldError(field, 'Por favor ingresá un email válido');
      return false;
    }

    if (email) {
      setFieldSuccess(field);
    }
    return true;
  }

  function formatPhone(field) {
    let value = field.value.replace(/\D/g, '');
    
    // Format Argentine phone numbers
    if (value.startsWith('54')) {
      // International format
      value = value.replace(/^54(\d{2})(\d{4})(\d{4})$/, '+54 $1 $2-$3');
    } else if (value.startsWith('9')) {
      // Mobile with area code
      value = value.replace(/^9(\d{2,4})(\d{4})(\d{4})$/, '$1 $2-$3');
    } else if (value.length >= 10) {
      // Standard format
      value = value.replace(/^(\d{2,4})(\d{4})(\d{4})$/, '$1 $2-$3');
    }
    
    field.value = value;
  }

  function setFieldError(field, message) {
    const formGroup = field.closest('.form-group') || field.closest('.col-md-6') || field.closest('.col-md-12');
    if (formGroup) {
      formGroup.classList.add('has-error');
      formGroup.classList.remove('has-success');
      
      // Remove existing error message
      const existingError = formGroup.querySelector('.field-error');
      if (existingError) {
        existingError.remove();
      }
      
      // Add new error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'field-error text-danger small mt-1';
      errorDiv.textContent = message;
      formGroup.appendChild(errorDiv);
    }
    
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
  }

  function setFieldSuccess(field) {
    const formGroup = field.closest('.form-group') || field.closest('.col-md-6') || field.closest('.col-md-12');
    if (formGroup) {
      formGroup.classList.add('has-success');
      formGroup.classList.remove('has-error');
      
      // Remove error message
      const existingError = formGroup.querySelector('.field-error');
      if (existingError) {
        existingError.remove();
      }
    }
    
    field.classList.add('is-valid');
    field.classList.remove('is-invalid');
  }

  function clearValidationStates(form) {
    // Clear all validation classes and error messages
    const fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(field => {
      field.classList.remove('is-valid', 'is-invalid');
      const formGroup = field.closest('.form-group') || field.closest('.col-md-6') || field.closest('.col-md-12');
      if (formGroup) {
        formGroup.classList.remove('has-error', 'has-success');
        const errorMsg = formGroup.querySelector('.field-error');
        if (errorMsg) {
          errorMsg.remove();
        }
      }
    });
  }

  function showLoading(form) {
    const loadingEl = form.querySelector('.loading');
    const errorEl = form.querySelector('.error-message');
    const successEl = form.querySelector('.sent-message');
    
    if (loadingEl) loadingEl.classList.add('d-block');
    if (errorEl) errorEl.classList.remove('d-block');
    if (successEl) successEl.classList.remove('d-block');
  }

  function hideLoading(form) {
    const loadingEl = form.querySelector('.loading');
    if (loadingEl) loadingEl.classList.remove('d-block');
  }

  function submitForm(form, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      hideLoading(form);
      
      if (data.success) {
        displaySuccess(form, data.message);
        form.reset();
        clearValidationStates(form);
        
        // Optional: Redirect to thank you page or scroll to top
        setTimeout(() => {
          form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 1000);
        
      } else {
        displayError(form, data.message || 'Error al enviar el formulario');
      }
    })
    .catch(error => {
      hideLoading(form);
      console.error('Form submission error:', error);
      
      let errorMessage = 'Hubo un problema al enviar tu consulta. ';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage += 'Por favor verificá tu conexión a internet e intentá nuevamente.';
      } else {
        errorMessage += 'Por favor intentá nuevamente o contactanos por WhatsApp: +54 9 351 505 4213';
      }
      
      displayError(form, errorMessage);
    });
  }

  function displayError(form, message) {
    hideLoading(form);
    const errorEl = form.querySelector('.error-message');
    const successEl = form.querySelector('.sent-message');
    
    if (errorEl) {
      errorEl.innerHTML = message;
      errorEl.classList.add('d-block');
    }
    if (successEl) {
      successEl.classList.remove('d-block');
    }
    
    // Scroll to error message
    errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function displaySuccess(form, message) {
    hideLoading(form);
    const errorEl = form.querySelector('.error-message');
    const successEl = form.querySelector('.sent-message');
    
    if (successEl) {
      successEl.innerHTML = message;
      successEl.classList.add('d-block');
    }
    if (errorEl) {
      errorEl.classList.remove('d-block');
    }
  }

})();
