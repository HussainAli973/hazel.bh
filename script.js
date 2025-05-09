document.addEventListener('DOMContentLoaded', function() {
  
  // 1. Interactive Menu Tabs
  const menuTabs = document.querySelectorAll('.tab-btn');
  const foodCategories = document.querySelectorAll('.menu-category');
  
  if (menuTabs.length > 0) {
    menuTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        menuTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        foodCategories.forEach(category => {
          category.classList.remove('active');
          category.style.display = 'none';
        });
        const selectedCategory = this.getAttribute('data-tab');
        document.getElementById(selectedCategory).classList.add('active');
        document.getElementById(selectedCategory).style.display = 'block';
      });
    });
  }

  // 2. ScrollUp
  const backToTopBtn = document.getElementById("scrollUp");
  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      backToTopBtn.style.display = (window.scrollY > 200) ? "block" : "none";
    });
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 3. Hamburger Menu (Small Screens)
  const mobileMenuBtn = document.querySelector('.hamburger');
  const mainNavigation = document.querySelector('.nav-menu');
  if (mobileMenuBtn && mainNavigation) {
    mobileMenuBtn.addEventListener('click', function() {
      this.classList.toggle('active');
      mainNavigation.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function() {
        mobileMenuBtn.classList.remove('active');
        mainNavigation.classList.remove('active');
      });
    });
  }

  // 4. Sticky Navigation
  const mainHeader = document.querySelector('.header');
  if (mainHeader) {
    window.addEventListener('scroll', function() {
      mainHeader.classList.toggle('sticky', window.scrollY > 0);
    });
  }

  // 5. Light Box 
  const galleryImages = document.querySelectorAll('.event-img');
  if (galleryImages.length >= 5) {
    const lightboxViewer = document.createElement('div');
    lightboxViewer.id = 'lightbox';
    lightboxViewer.innerHTML = `
      <div class="lightbox-content">
        <span class="close" title="Close gallery">&times;</span>
        <div class="lightbox-img-container">
          <img class="lightbox-img" src="" alt="Enlarged dish photo">
        </div>
        <div class="lightbox-caption"></div>
        <button class="prev" aria-label="Previous photo">&#10094;</button>
        <button class="next" aria-label="Next photo">&#10095;</button>
      </div>
    `;
    document.body.appendChild(lightboxViewer);

    let currentImageIndex = 0;
    galleryImages.forEach((img, index) => {
      img.addEventListener('click', function() {
        currentImageIndex = index;
        updateLightbox();
        lightboxViewer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    lightboxViewer.querySelector('.close').addEventListener('click', closeLightbox);
    lightboxViewer.addEventListener('click', function(e) {
      if (e.target === lightboxViewer) closeLightbox();
    });
    lightboxViewer.querySelector('.prev').addEventListener('click', function(e) {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      updateLightbox();
    });
    lightboxViewer.querySelector('.next').addEventListener('click', function(e) {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
      updateLightbox();
    });

    document.addEventListener('keydown', function(e) {
      if (lightboxViewer.style.display !== 'flex') return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightbox();
      }
      else if (e.key === 'ArrowRight') {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightbox();
      }
    });

    function updateLightbox() {
      const currentImg = galleryImages[currentImageIndex];
      const displayedImg = lightboxViewer.querySelector('.lightbox-img');
      const caption = lightboxViewer.querySelector('.lightbox-caption');
      displayedImg.src = currentImg.src;
      displayedImg.alt = currentImg.alt;
      const dishName = currentImg.closest('.event-card').querySelector('.event-title').textContent;
      caption.textContent = dishName;
    }

    function closeLightbox() {
      lightboxViewer.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  // 6. Scroll Animations
  const animateOnScroll = function() {
    const elementsToAnimate = document.querySelectorAll('.animate, .philosophy-item');
    const triggerPoint = window.innerHeight * 0.85;
    elementsToAnimate.forEach(element => {
      if (element.getBoundingClientRect().top < triggerPoint) {
        element.classList.add('animated');
      }
    });
  };
  window.addEventListener('scroll', animateOnScroll);
  window.addEventListener('load', animateOnScroll);

  // 7. Auto-Updating Copyright Year
  const yearElement = document.getElementById('currentYear');
  if (yearElement) yearElement.textContent = new Date().getFullYear();

 

  // 8. Scroll Down Indicator (Index Page)
  const scrollPrompt = document.querySelector('.scroll-down');
  if (scrollPrompt) {
    scrollPrompt.addEventListener('click', function() {
      const nextContent = document.querySelector('section:not(.hero)');
      if (nextContent) nextContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    const arrow = scrollPrompt.querySelector('.arrow');
    let isAnimating = true;
    function floatAnimation() {
      if (isAnimating) {
        arrow.style.transform = 'translateY(-6px) rotate(45deg)';
        setTimeout(() => {
          arrow.style.transform = 'translateY(0) rotate(45deg)';
          setTimeout(floatAnimation, 1200);
        }, 1200);
      }
    }
    floatAnimation();
    scrollPrompt.addEventListener('mouseenter', () => {
      isAnimating = false;
      arrow.style.transform = 'scale(1.15) rotate(45deg)';
    });
    scrollPrompt.addEventListener('mouseleave', () => {
      isAnimating = true;
      arrow.style.transform = 'rotate(45deg)';
      floatAnimation();
    });
  }

  // 9. Promotional Popup (Menu Page Only)
  if (window.location.pathname.includes('menu.html')) {
    const popup = document.getElementById('promoPopup');
    if (popup) {
      popup.classList.add('active');
      document.getElementById('closePopup').addEventListener('click', () => popup.classList.remove('active'));
      popup.addEventListener('click', (e) => {
        if (e.target === popup) popup.classList.remove('active');
      });
    }
  }

  
  // 10. Filter Dropdown (Event Page)
  const eventsFilter = document.querySelector('.events-filter');
  if (eventsFilter) {
    const dropdown = document.querySelector('.filter-dropdown');
    const filterBtn = document.querySelector('.filter-btn');
    const options = document.querySelectorAll('.filter-options .option');
    const eventsGrid = document.querySelector('.events-grid');
    
    // Toggle dropdown visibility
    filterBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdown.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
      dropdown.classList.remove('active');
    });
    
    // Handle option selection
    options.forEach(option => {
      option.addEventListener('click', function() {
        const sortType = this.dataset.sort;
        
        // Update active option
        options.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        
        // Update button text
        filterBtn.innerHTML = this.textContent + '<span class="Filter-arrow">▼</span>';
        
        // Sort events
        sortEvents(sortType);
        
        // Close dropdown
        dropdown.classList.remove('active');
      });
    });
    
    // Initial sort (Next First)
    sortEvents('next-first');
    options[0].classList.add('active');
    
    function sortEvents(sortType) {
      const eventCards = Array.from(document.querySelectorAll('.event-card'));
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      eventCards.sort((a, b) => {
        const dateA = getEventDate(a);
        const dateB = getEventDate(b);
        
        if (sortType === 'next-first') return dateA - dateB;
        if (sortType === 'latest-first') return dateB - dateA;
        return 0;
      });
      
      // Filter if "This Month Only" is selected
      if (sortType === 'current-month') {
        eventCards.forEach(card => {
          const eventDate = getEventDate(card);
          card.style.display = (eventDate.getMonth() === currentMonth && 
                              eventDate.getFullYear() === currentYear) ? 
                              'block' : 'none';
        });
      } else {
        eventCards.forEach(card => card.style.display = 'block');
      }
      
      // Re-append cards (maintaining sort order)
      eventsGrid.innerHTML = '';
      eventCards.forEach(card => eventsGrid.appendChild(card));
    }
    
    function getEventDate(card) {
      const day = card.querySelector('.event-day').textContent;
      const month = card.querySelector('.event-month').textContent;
      const year = new Date().getFullYear();
      
      const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December']
                        .indexOf(month);
      
      return new Date(year, monthIndex, day);
    }
  }

  // 11. Reservation Form Validation
const reservationForm = document.getElementById('reservationForm');
if (reservationForm) {
    // Phone number formatting
    document.getElementById('phone').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 8);
    });

    // Name validation (letters only)
    document.getElementById('name').addEventListener('input', function() {
        this.value = this.value.replace(/[^A-Za-z\s]/g, '');
    });

    // Form submission
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateReservationForm()) {
            submitReservationForm();
        }
    });

    function validateReservationForm() {
        let isValid = true;
        clearErrors();

        // Validate name (letters only)
        const name = document.getElementById('name').value.trim();
        if (!name) {
            showError('name', 'Name is required');
            isValid = false;
        } else if (name.length < 2) {
            showError('name', 'Minimum 2 characters');
            isValid = false;
        }

        // Validate email
        const email = document.getElementById('email').value.trim();
        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('email', 'Invalid email format');
            isValid = false;
        }

        // Validate phone (exactly 8 digits)
        const phone = document.getElementById('phone').value.trim();
        if (!phone) {
            showError('phone', 'Phone is required');
            isValid = false;
        } else if (phone.length !== 8) {
            showError('phone', 'Must be 8 digits');
            isValid = false;
        }

        // Validate date (not in past)
        const date = document.getElementById('date').value;
        if (!date) {
            showError('date', 'Date is required');
            isValid = false;
        } else {
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                showError('date', 'Cannot select past date');
                isValid = false;
            }
        }

        // Validate guests
        const guests = document.getElementById('guests').value;
        if (!guests) {
            showError('guests', 'Party size is required');
            isValid = false;
        }

        // Validate time
        const time = document.getElementById('time').value;
        if (!time) {
            showError('time', 'Time is required');
            isValid = false;
        }

        return isValid;
    }

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const wrapper = field.closest('.input-wrapper') || field.closest('.form-group');
        wrapper.classList.add('error');
        
        let errorElement = wrapper.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            wrapper.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.color = '#e74c3c';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '0.5rem';
    }

    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.input-wrapper, .form-group').forEach(el => {
            el.classList.remove('error');
        });
    }

    function submitReservationForm() {
        const submitBtn = reservationForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Processing...';

        // Simulate form submission
        setTimeout(() => {
            // Play success sound from your audio folder
            const successSound = new Audio('audio/success.mp3'); //Implement multimedia elements (Audio)
            successSound.volume = 0.7; // Set to 70% volume
            successSound.play().catch(e => console.log("Audio play failed:", e));
            
            showReservationSuccess();
            reservationForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Confirm Reservation';
        }, 1500);
    }

    function showReservationSuccess() {
        const popup = document.createElement('div');
        popup.className = 'promo-popup active';
        popup.innerHTML = `
            <div class="popup-content">
                <span class="close-popup" title="Close reservation confirmation">&times;</span>
                <div class="promo-text">
                    <h3>Reservation Confirmed!</h3>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4af37" style="margin: 0 auto 1rem; display: block;">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <p>Thank you for your reservation!</p>
                    <p>We'll contact you if needed.</p>
                    <button class="btn-gold-outline close-popup-btn" style="margin-top: 1.5rem;">
                        Done
                    </button>
                </div>
            </div>
        `;

        // Append to body
        document.body.appendChild(popup);
        document.body.style.overflow = 'hidden';

        // Close handlers
        const closePopup = () => {
            popup.classList.remove('active');
            setTimeout(() => {
                popup.remove();
                document.body.style.overflow = 'auto';
            }, 300);
        };

        popup.querySelector('.close-popup').addEventListener('click', closePopup);
        popup.querySelector('.close-popup-btn').addEventListener('click', closePopup);
        popup.addEventListener('click', (e) => {
            if (e.target === popup) closePopup();
        });

        // Keyboard close
        function handleKeydown(e) {
            if (e.key === 'Escape') {
                closePopup();
                document.removeEventListener('keydown', handleKeydown);
            }
        }
        document.addEventListener('keydown', handleKeydown);
    }
}
});
