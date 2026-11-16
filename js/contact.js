/**
 * Green Haven Residences - Contact & Visit Booking Logic
 * Handles interactive booking form submission, real-time input validation,
 * URL parameter pre-filling, and user confirmation feedback.
 */

export function initContactForm() {
  const form = document.getElementById('visitForm');
  const successAlert = document.getElementById('formSuccessAlert');

  if (!form) return;

  // Pre-fill interest from URL parameter (e.g., ?interest=3%20BHK)
  const urlParams = new URLSearchParams(window.location.search);
  const interestParam = urlParams.get('interest');
  if (interestParam) {
    const select = document.getElementById('interestedIn');
    if (select) {
      for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value.toLowerCase().includes(interestParam.toLowerCase()) || 
            select.options[i].text.toLowerCase().includes(interestParam.toLowerCase())) {
          select.selectedIndex = i;
          break;
        }
      }
    }
  }

  // Set minimum date to tomorrow
  const dateInput = document.getElementById('preferredDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  // Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Full Name
    const nameInput = document.getElementById('fullName');
    const nameGroup = nameInput ? nameInput.closest('.form-group') : null;
    if (nameInput && nameInput.value.trim().length < 2) {
      if (nameGroup) nameGroup.classList.add('has-error');
      isValid = false;
    } else if (nameGroup) {
      nameGroup.classList.remove('has-error');
    }

    // Validate Phone
    const phoneInput = document.getElementById('phoneNumber');
    const phoneGroup = phoneInput ? phoneInput.closest('.form-group') : null;
    const phoneRegex = /^[\d\s+\-()]{7,20}$/;
    if (phoneInput && !phoneRegex.test(phoneInput.value.trim())) {
      if (phoneGroup) phoneGroup.classList.add('has-error');
      isValid = false;
    } else if (phoneGroup) {
      phoneGroup.classList.remove('has-error');
    }

    // Validate Email
    const emailInput = document.getElementById('emailAddress');
    const emailGroup = emailInput ? emailInput.closest('.form-group') : null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput && !emailRegex.test(emailInput.value.trim())) {
      if (emailGroup) emailGroup.classList.add('has-error');
      isValid = false;
    } else if (emailGroup) {
      emailGroup.classList.remove('has-error');
    }

    // Validate Interested In
    const interestSelect = document.getElementById('interestedIn');
    const interestGroup = interestSelect ? interestSelect.closest('.form-group') : null;
    if (interestSelect && !interestSelect.value) {
      if (interestGroup) interestGroup.classList.add('has-error');
      isValid = false;
    } else if (interestGroup) {
      interestGroup.classList.remove('has-error');
    }

    // Validate Date
    const preferredDate = document.getElementById('preferredDate');
    const dateGroup = preferredDate ? preferredDate.closest('.form-group') : null;
    if (preferredDate && !preferredDate.value) {
      if (dateGroup) dateGroup.classList.add('has-error');
      isValid = false;
    } else if (dateGroup) {
      dateGroup.classList.remove('has-error');
    }

    if (isValid) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Registering Visit...</span>';
      }

      // Simulate asynchronous API submission
      setTimeout(() => {
        if (successAlert) {
          successAlert.classList.add('show');
          successAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        form.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span>Request a Visit</span>
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          `;
        }
      }, 700);
    }
  });

  // Clear errors on input
  form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group) group.classList.remove('has-error');
    });
  });
}
