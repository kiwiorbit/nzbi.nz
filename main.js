/**
 * main.js
 * Contains essential functionality for the website
 */

// Register Service Worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  // Initialize mobile menu functionality
  initMobileMenu();

  // Highlight current page in navigation
  highlightCurrentPage();

  // Set current year in footer copyright
  setFooterYear();

  // Initialize animated counters if elements exist
  initAnimatedCounters();

  // Initialize floating particles for hero section
  initFloatingParticles();

  // Initialize tab switcher if tab elements exist
  initTabSwitcher();

  // Initialize accordion FAQ if elements exist
  initAccordionFAQ();

  // Initialize Prophet Guidance section with TypewriterRTL
  initProphetGuidance();
});

/**
 * Initialize mobile menu toggle functionality
 */
function initMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.toggle('hidden');
      const menuIcon = mobileMenuButton.querySelector('svg path');

      if (!isHidden) {
        menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
      } else {
        menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
      }
    });
  }
}

/**
 * Highlight the current page in the navigation
 */
function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath ||
        (currentPath === '/' && href === '/index.html') ||
        (currentPath !== '/' && href !== '/' && currentPath.includes(href))) {
      link.classList.add('text-primary-color', 'font-bold');
    }
  });
}

/**
 * Set the current year in the footer copyright text
 */
function setFooterYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}


/**
 * Animated Counters
 * Creates animated number counters that count up to a target value
 */
function initAnimatedCounters() {
  // Find all elements with data-counter attribute
  const counterElements = document.querySelectorAll('[data-counter]');
  if (!counterElements.length) return;

  counterElements.forEach((element, index) => {
    // Generate ID if needed and extract options
    element.id = element.id || `animated-counter-${index}`;

    const options = {
      element,
      end: parseFloat(element.dataset.counter || '0'),
      duration: parseInt(element.dataset.duration || '2000', 10),
      prefix: element.dataset.prefix || '',
      suffix: element.dataset.suffix || '',
      title: element.dataset.title || '',
      decimals: parseInt(element.dataset.decimals || '0', 10)
    };

    // Create counter and observe
    setupCounter(options);
  });
}

/**
 * Setup counter with elements and observer
 * @param {Object} options - Counter configuration options
 */
function setupCounter(options) {
  const { element, prefix, suffix, title } = options;

  // Create counter elements with template literals
  element.innerHTML = `
    <div class="text-3xl font-bold mb-2 text-center w-full">${prefix}0${suffix}</div>
    ${title ? `<div class="text-sm opacity-80 text-center w-full">${title}</div>` : ''}
  `;

  // Set up intersection observer
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounter(options);
      observer.disconnect();
    }
  }, { threshold: 0.1 });

  observer.observe(element);
}

/**
 * Animate the counter from 0 to the target value
 * @param {Object} options - Counter configuration options
 */
function animateCounter(options) {
  const { element, end, duration, prefix, suffix, decimals } = options;
  const counterElement = element.querySelector('div');
  if (!counterElement) return;

  let startTime = null;

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const currentValue = progress * end;

    counterElement.textContent = `${prefix}${formatNumber(currentValue, decimals)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

/**
 * Format number with commas and decimals
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places to show
 * @returns {string} Formatted number
 */
function formatNumber(num, decimals) {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}



/**
 * FloatingParticles.js
 * Creates animated floating particles with neural network-like connections
 */

/**
 * Initialize floating particles in the hero container
 */
function initFloatingParticles() {
  const container = document.getElementById('hero-container');
  if (!container) return;

  createNeuralNetwork(container, {
    particleCount: 40,
    colors: ['#6366f1', '#a5b4fc', '#8b5cf6', '#c4b5fd', '#ffffff'],
    minSize: 2, maxSize: 4,
    speed: 0.7,
    minOpacity: 0.3, maxOpacity: 0.7,
    connectionDistance: 180,
    connectionOpacity: 0.2,
    connectionWidth: 0.8,
    connectionColor: '#a5b4fc'
  });
}

/**
 * Create a neural network with particles and connections
 * @param {HTMLElement} container - The container element
 * @param {Object} config - Configuration for particles and connections
 */
function createNeuralNetwork(container, config) {
  // Setup canvas
  const canvas = setupCanvas(container);
  const ctx = canvas.getContext('2d');
  const particles = createParticles(container, canvas, config);

  // Add CSS for particles
  addParticleStyles();

  // Animation loop
  (function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateParticles(particles, canvas, ctx, config);
    requestAnimationFrame(animate);
  })();
}

/**
 * Setup canvas for drawing connections
 * @param {HTMLElement} container - The container element
 * @returns {HTMLCanvasElement} The canvas element
 */
function setupCanvas(container) {
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position: 'absolute', top: '0', left: '0',
    width: '100%', height: '100%', pointerEvents: 'none'
  });
  container.appendChild(canvas);

  // Set canvas size
  const resizeCanvas = () => {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  return canvas;
}

/**
 * Create particles in the container
 * @param {HTMLElement} container - The container element
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {Object} config - Configuration for particles
 * @returns {Array} Array of particle objects
 */
function createParticles(container, canvas, config) {
  const particles = [];

  for (let i = 0; i < config.particleCount; i++) {
    // Random properties
    const size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    const opacity = Math.random() * (config.maxOpacity - config.minOpacity) + config.minOpacity;

    // Create particle element
    const element = document.createElement('div');
    element.className = 'neural-particle';

    // Set styles
    Object.assign(element.style, {
      position: 'absolute',
      width: `${size}px`, height: `${size}px`,
      backgroundColor: color,
      borderRadius: '50%',
      opacity: opacity.toString(),
      boxShadow: `0 0 ${size}px ${color}`,
      zIndex: '2'
    });

    container.appendChild(element);

    // Store particle data
    particles.push({
      element,
      size,
      color,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speedX: (Math.random() - 0.5) * config.speed,
      speedY: (Math.random() - 0.5) * config.speed,
      opacity
    });
  }

  return particles;
}

/**
 * Add CSS styles for particles
 */
function addParticleStyles() {
  if (!document.getElementById('floating-particles-keyframes')) {
    const style = document.createElement('style');
    style.id = 'floating-particles-keyframes';
    style.textContent = '.neural-particle { transition: transform 3s ease-in-out; }';
    document.head.appendChild(style);
  }
}

/**
 * Update particles and draw connections
 * @param {Array} particles - Array of particle objects
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {Object} config - Configuration for particles and connections
 */
function updateParticles(particles, canvas, ctx, config) {
  particles.forEach((particle, i) => {
    // Update position
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    // Bounce off edges
    if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
    if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

    // Update element position
    particle.element.style.left = `${particle.x}px`;
    particle.element.style.top = `${particle.y}px`;

    // Draw connections
    drawConnections(particle, particles.slice(i + 1), ctx, config);
  });
}

/**
 * Draw connections between particles
 * @param {Object} particle - The source particle
 * @param {Array} otherParticles - Array of other particles to connect to
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {Object} config - Configuration for connections
 */
function drawConnections(particle, otherParticles, ctx, config) {
  otherParticles.forEach(otherParticle => {
    const dx = particle.x - otherParticle.x;
    const dy = particle.y - otherParticle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < config.connectionDistance) {
      // Use fixed opacity instead of distance-based opacity
      const opacity = config.connectionOpacity;

      ctx.beginPath();
      ctx.moveTo(particle.x, particle.y);
      ctx.lineTo(otherParticle.x, otherParticle.y);

      // Parse color
      let r = 165, g = 180, b = 252;
      if (config.connectionColor.startsWith('#')) {
        const hex = config.connectionColor.substring(1);
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      }

      ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      ctx.lineWidth = config.connectionWidth;
      ctx.stroke();
    }
  });
}


/**
 * Tab Switcher
 * Creates a tabbed interface that switches between content sections
 */
function initTabSwitcher() {
  // Look for specific tab IDs (announcements/events tabs)
  const tabAnnouncements = document.getElementById('tab-announcements');
  const tabEvents = document.getElementById('tab-events');

  if (tabAnnouncements && tabEvents) {
    const tabs = [tabAnnouncements, tabEvents];

    // Find corresponding content sections
    const contentAnnouncements = document.getElementById('content-announcements');
    const contentEvents = document.getElementById('content-events');

    if (contentAnnouncements && contentEvents) {
      const contents = [contentAnnouncements, contentEvents];

      // Define classes for active and inactive tabs
      const activeTabClass = 'px-8 py-4 border-b-2 border-primary-color text-black font-bold cursor-pointer relative transition-all';
      const inactiveTabClass = 'px-8 py-4 border-b-2 border-transparent text-black font-medium cursor-pointer relative transition-all hover:text-primary-color';

      // Set up event listeners for tabs
      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
          // Update tab styles and attributes
          tabs.forEach((t, i) => {
            if (i === index) {
              // Active tab
              t.className = activeTabClass;
              t.setAttribute('aria-selected', 'true');
            } else {
              // Inactive tab
              t.className = inactiveTabClass;
              t.setAttribute('aria-selected', 'false');
            }
          });

          // Show/hide content sections
          contents.forEach((content, i) => {
            if (i === index) {
              // Show active content
              content.classList.remove('hidden');
              content.classList.add('block');
            } else {
              // Hide inactive content
              content.classList.remove('block');
              content.classList.add('hidden');
            }
          });
        });
      });
    }
  }

  // Look for tab groups with role="tablist"
  const tabGroups = document.querySelectorAll('[role="tablist"]');
  tabGroups.forEach(tabGroup => {
    // Find all tabs in this group
    const tabs = Array.from(tabGroup.querySelectorAll('[role="tab"]'));

    if (tabs.length > 0) {
      // Find corresponding content sections
      const contents = tabs.map(tab => {
        const contentId = tab.getAttribute('aria-controls');
        return document.getElementById(contentId);
      }).filter(content => content !== null);

      // Define classes for active and inactive tabs
      const activeTabClass = 'px-6 py-3 border-b-2 border-primary-color text-primary-color font-bold cursor-pointer';
      const inactiveTabClass = 'px-6 py-3 border-b-2 border-transparent text-black font-medium cursor-pointer';

      // Set up event listeners for tabs
      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
          // Update tab styles and attributes
          tabs.forEach((t, i) => {
            if (i === index) {
              // Active tab
              t.className = activeTabClass;
              t.setAttribute('aria-selected', 'true');
            } else {
              // Inactive tab
              t.className = inactiveTabClass;
              t.setAttribute('aria-selected', 'false');
            }
          });

          // Show/hide content sections
          contents.forEach((content, i) => {
            if (content) {
              if (i === index) {
                // Show active content
                content.classList.remove('hidden');
                content.classList.add('block');
              } else {
                // Hide inactive content
                content.classList.remove('block');
                content.classList.add('hidden');
              }
            }
          });
        });
      });

      // Activate the tab that has aria-selected="true" or the first tab
      const selectedTabIndex = tabs.findIndex(tab =>
        tab.getAttribute('aria-selected') === 'true'
      );

      if (selectedTabIndex >= 0) {
        // Simulate a click on the selected tab
        tabs[selectedTabIndex].click();
      } else if (tabs.length > 0) {
        // Simulate a click on the first tab
        tabs[0].click();
      }
    }
  });
}

/**
 * Accordion FAQ
 * Creates an accordion-style FAQ component with expandable/collapsible items
 */
function initAccordionFAQ() {
  // Look for FAQ accordion container
  const container = document.getElementById('faq-accordion');
  if (!container) return;

  // Check if container has data-faqs attribute or existing items
  let faqs = [];
  if (container.hasAttribute('data-faqs')) {
    try {
      faqs = JSON.parse(container.getAttribute('data-faqs'));
      renderAccordion(container, faqs);
    } catch (e) {
      console.error('Error parsing FAQ data:', e);
      return;
    }
  } else {
    // Use existing items if present
    const existingItems = container.querySelectorAll('.faq-item');
    if (existingItems.length > 0) {
      setupAccordionListeners(container);
    }
  }
}

/**
 * Render accordion HTML from FAQ data
 * @param {HTMLElement} container - The accordion container
 * @param {Array} faqs - Array of FAQ objects with question and answer properties
 */
function renderAccordion(container, faqs) {
  // Create accordion HTML with template literals
  const accordionHTML = `
    <div class="faq-accordion">
      ${faqs.map((faq, index) => `
        <div class="faq-item mb-4 rounded-xl overflow-hidden transition-all duration-300 shadow border-transparent"
             data-faq-index="${index}"
             style="transform: scale(1); border-left: 4px solid transparent;
                    transition: transform 0.3s ease, border-left 0.3s ease, box-shadow 0.3s ease;">
          <button class="faq-toggle w-full text-left p-5 font-semibold flex justify-between items-center
                         bg-white hover:bg-gray-50 transition-colors"
                  aria-expanded="false"
                  aria-controls="faq-content-${index}">
            <span class="pr-8">${faq.question}</span>
            <span class="faq-icon flex-shrink-0">
              <svg class="w-6 h-6 transition-transform duration-300 rotate-0"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg"
                   style="transition: transform 0.3s ease;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </span>
          </button>
          <div id="faq-content-${index}"
               class="faq-content overflow-hidden transition-all duration-300 ease-in-out bg-gray-50"
               style="max-height: 0; opacity: 0; transition: max-height 0.3s ease, opacity 0.3s ease;">
            <div class="p-5 border-t border-gray-100">
              <p class="text-gray-700">${faq.answer}</p>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Set accordion HTML and initialize listeners
  container.innerHTML = accordionHTML;
  setupAccordionListeners(container);
}

/**
 * Set up event listeners for accordion items
 * @param {HTMLElement} container - The accordion container
 */
function setupAccordionListeners(container) {
  // Get all toggle buttons
  const toggleButtons = container.querySelectorAll('.faq-toggle');
  let activeIndex = -1;

  // Add click event listeners
  toggleButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const isExpanding = activeIndex !== index;
      const newActiveIndex = isExpanding ? index : -1;

      // Update all items (close everything first)
      updateAccordionItems(container, newActiveIndex);

      // Update active index after all items are updated
      activeIndex = newActiveIndex;
    });
  });
}

/**
 * Update all accordion items based on active index
 * @param {HTMLElement} container - The accordion container
 * @param {number} activeIndex - Index of the active item (-1 if none)
 */
function updateAccordionItems(container, activeIndex) {
  const faqItems = container.querySelectorAll('.faq-item');

  faqItems.forEach((item, index) => {
    const isActive = index === activeIndex;
    const button = item.querySelector('.faq-toggle');
    const icon = item.querySelector('.faq-icon svg');
    const content = item.querySelector('.faq-content');

    // Update item state based on whether it's active
    if (isActive) {
      // Expand this item
      item.classList.remove('shadow', 'border-transparent');
      item.classList.add('shadow-lg', 'border-primary-color');
      item.style.transform = 'scale(1.02)';
      item.style.borderLeft = '4px solid var(--primary-color)';
      button.setAttribute('aria-expanded', 'true');
      icon.classList.remove('rotate-0');
      icon.classList.add('rotate-45');
      content.style.maxHeight = '500px';
      content.style.opacity = '1';
    } else {
      // Collapse this item
      item.classList.remove('shadow-lg', 'border-primary-color');
      item.classList.add('shadow', 'border-transparent');
      item.style.transform = 'scale(1)';
      item.style.borderLeft = '4px solid transparent';
      button.setAttribute('aria-expanded', 'false');
      icon.classList.remove('rotate-45');
      icon.classList.add('rotate-0');
      content.style.maxHeight = '0';
      content.style.opacity = '0';
    }
  });
}


/**
 * TypewriterRTL - Creates a typewriter effect for right-to-left text
 * @param {Object} options - Configuration options
 */
function TypewriterRTL(options) {
  // Merge options with defaults
  const settings = Object.assign({
    element: null,
    text: '',
    speed: 80, // 20% faster than original 100
    delay: 500,
    cursor: true
  }, options);

  if (!settings.element) return console.error('TypewriterRTL: No element specified');

  let currentIndex = 0;
  let interval;
  let cursorElement;

  // Set element properties
  settings.element.setAttribute('dir', 'rtl');
  settings.element.style.textAlign = 'center';

  // Create cursor if enabled
  if (settings.cursor) {
    cursorElement = document.createElement('span');
    cursorElement.className = 'typing-cursor';
    cursorElement.textContent = '|';
    cursorElement.style.animation = 'cursor-blink 1s step-end infinite';
    settings.element.appendChild(cursorElement);
  }

  // Start typing after delay
  setTimeout(() => {
    interval = setInterval(() => {
      if (currentIndex < settings.text.length) {
        settings.element.textContent = settings.text.substring(0, ++currentIndex);
        if (settings.cursor) settings.element.appendChild(cursorElement);
      } else {
        clearInterval(interval);
        if (settings.cursor) {
          setTimeout(() => cursorElement.style.display = 'none', 2000);
        }
      }
    }, settings.speed);
  }, settings.delay);

  // Return public methods
  return {
    stop: () => clearInterval(interval),
    reset: () => {
      clearInterval(interval);
      currentIndex = 0;
      settings.element.textContent = '';
      if (settings.cursor && cursorElement) settings.element.appendChild(cursorElement);
    }
  };
}

// Initialize TypewriterRTL for the moonsighting page
function initProphetGuidance() {
  const hadithElement = document.getElementById('hadith-arabic');
  if (!hadithElement) return;

  // Initialize the TypewriterRTL for Arabic text
  new TypewriterRTL({
    element: hadithElement,
    text: 'إِذَا رَأَيْتُمُوهُ فَصُومُوا وَإِذَا رَأَيْتُمُوهُ فَأَفْطِرُوا فَإِنْ أُغْمِيَ عَلَيْكُمْ فَعُدُّوا ثَلاَثِينَ',
    speed: 80, // 20% faster than original 100
    delay: 1000
  });

  // Animate elements with delays
  const elements = [
    { id: 'hadith-translation', delay: 3200 }, // 20% faster than 4000
    { id: 'hadith-citation', delay: 3600 },    // 20% faster than 4500
    { id: 'hadith-description', delay: 4000 }  // 20% faster than 5000
  ];

  elements.forEach(({ id, delay }) => {
    const element = document.getElementById(id);
    if (element) {
      setTimeout(() => {
        element.style.opacity = '1';
        element.classList.add('animate-fadeIn');
      }, delay);
    }
  });
}

// Contact form submission
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
  e.preventDefault();

  // Here you would normally send the form data to a server
  // For demonstration purposes, we'll just show an alert
  alert('Thank you for your message! We will get back to you soon.');
  this.reset();
});
