/**
 * Benjamin Counter Website JavaScript
 * Handles randomizers, navigation, theme switching, and interactive features
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // RANDOMIZER FUNCTIONS
    // ==========================================================================
    
    // Randomize intro text
    const introTextElement = document.getElementById('intro-text-randomizer');
    if (introTextElement) {
        const introTexts = [
            `Have a look around.<br>This site is under constant development, so don't freak out if it doesn't look the same each time you visit.`,
            "Welcome, stranger. What are you buying?",
            "I used to be an adventurer like you. Then I took an arrow in the knee...",
            "War... War never changes.",
            "FUCK MINNESOTA.",
            "FUCK YOU IN PARTICULAR",
            "As I break apart."
        ];
        
        if (Math.random() < 0.25) {
            const alternativeTexts = introTexts.slice(1);
            introTextElement.innerHTML = alternativeTexts[Math.floor(Math.random() * alternativeTexts.length)];
        }
    }
    
    // Randomize footer quote
    const footerQuoteElement = document.getElementById('footer-quote');
    if (footerQuoteElement) {
        const footerQuotes = [
            "Everything in this life is impossible until someone comes and does it.",
            "Do a barrel roll!",
            "Start diggin in yo butt, twin",
            "Would you remember me tomorrow if i was gone?",
            "I'll always be dreaming of you.",
            "Minnesota, exist.",
            "Wish you were here...",
            "FUCK YOU",
            "I HATE YOU.",
            "FUCK YOU IN PARTICULAR"
        ];
        
        if (Math.random() < 0.25) {
            const alternativeQuotes = footerQuotes.slice(1);
            footerQuoteElement.textContent = `"${alternativeQuotes[Math.floor(Math.random() * alternativeQuotes.length)]}"`;
        }
    }
    
    // Randomize header title (very rare)
    const headerTitleElement = document.getElementById('header-title');
    if (headerTitleElement) {
        const alternativeTitles = ["FUCK YOU IN PARTICULAR"];
        if (Math.random() < 0.01) {
            headerTitleElement.textContent = alternativeTitles[Math.floor(Math.random() * alternativeTitles.length)];
        }
    }

    // ==========================================================================
    // HAMBURGER MENU FUNCTIONALITY
    // ==========================================================================
    
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('show-menu');
            hamburgerBtn.innerHTML = navMenu.classList.contains('show-menu') ? '&times;' : '&#9776;';
        });
        
        const navLinksInMenu = navMenu.querySelectorAll('a');
        navLinksInMenu.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show-menu');
                hamburgerBtn.innerHTML = '&#9776;';
            });
        });
    }

    // ==========================================================================
    // NAVIGATION INDICATOR WITH ANIMATION
    // ==========================================================================
    
    const navLinksForIndicator = document.querySelectorAll('#nav-menu li a');
    const indicator = document.getElementById('nav-indicator');
    const navContainer = document.querySelector('.nav-container');
    
    if (indicator && navContainer && navLinksForIndicator.length > 0) {
        
        /**
         * Move the navigation indicator to the specified link
         * @param {HTMLElement} targetLink - The link element to move the indicator to
         */
        function moveIndicatorTo(targetLink) {
            if (!targetLink) return;
            
            const linkRect = targetLink.getBoundingClientRect();
            const containerRect = navContainer.getBoundingClientRect();
            const left = linkRect.left - containerRect.left;
            const width = linkRect.width;
            
            indicator.style.left = `${left}px`;
            indicator.style.width = `${width}px`;
        }

        /**
         * Set the initial position of the indicator based on current page
         */
        function setInitialPosition() {
            let currentPage = window.location.pathname.split('/').pop();
            if (currentPage === '' || currentPage === 'index.html') {
                currentPage = 'index.html';
            }
            
            const activeLink = Array.from(navLinksForIndicator).find(link => 
                link.getAttribute('href') === currentPage
            );
            
            document.fonts.ready.then(() => moveIndicatorTo(activeLink));
        }

        // Add click listeners to navigation links
        navLinksForIndicator.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetUrl = link.href;
                
                moveIndicatorTo(link);
                
                indicator.addEventListener('transitionend', () => {
                    window.location.href = targetUrl;
                }, { once: true });
            });
        });

        // Initialize and handle window resize
        setInitialPosition();
        window.addEventListener('resize', setInitialPosition);
    }

    // ==========================================================================
    // THEME SWITCHER FUNCTIONALITY
    // ==========================================================================
    
    const themeSwitcher = document.getElementById('theme-switcher');
    
    if (themeSwitcher) {
        const body = document.body;
        const footerLogo = document.querySelector('.footer-logo');
        const profilePicture = document.querySelector('.profile-picture');
        const indexLogo = document.querySelector('.index-logo');

        // SVG icons for theme switcher
        const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

        /**
         * Apply the specified theme to the page
         * @param {string} theme - The theme to apply ('light' or 'dark')
         */
        const applyTheme = (theme) => {
            body.classList.toggle('dark-mode', theme === 'dark');
            themeSwitcher.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
            
            if (theme === 'dark') {
                if (indexLogo) indexLogo.src = 'resources/C_white.png';
                if (footerLogo) footerLogo.src = 'resources/logo_v2.png';
                if (profilePicture) profilePicture.src = 'resources/logo_v2.png';
            } else {
                if (indexLogo) indexLogo.src = 'resources/C.png';
                if (footerLogo) footerLogo.src = 'resources/logo.png';
                if (profilePicture) profilePicture.src = 'resources/logo.png';
            }
        };

        /**
         * Toggle between light and dark themes
         */
        const toggleTheme = () => {
            const isDark = body.classList.contains('dark-mode');
            const newTheme = isDark ? 'light' : 'dark';
            
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        };

        /**
         * Initialize theme based on saved preference or system preference
         */
        const initializeTheme = () => {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
        };

        // Add event listener and initialize theme
        themeSwitcher.addEventListener('click', toggleTheme);
        initializeTheme();
    }
    
    // ==========================================================================
    // GALLERY MODAL FUNCTIONALITY (CENTRALIZED)
    // ==========================================================================
    
    // all modal logic
    function initializeGalleryModal() {
        const modal = document.getElementById('modal');
        if (!modal) {
            return;
        }

        const modalImg = document.getElementById('modal-img');
        const modalImgNext = document.getElementById('modal-img-next');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        const imageContainer = document.getElementById('modal-image-container');
        const closeModalBtn = document.getElementById('modal-close');
        const prevBtn = document.getElementById('modal-prev');
        const nextBtn = document.getElementById('modal-next');
        const warningOverlay = document.getElementById('modal-warning');
        const continueBtn = document.getElementById('warning-continue-btn');
        const altBtn = document.getElementById('modal-alt-btn');

        const galleryItems = [];
        let currentImageIndex = 0;
        let lastFocusedElement;
        let currentSourceIndex = 0;

        const galleryImageElements = document.querySelectorAll('.gallery-image');
        galleryImageElements.forEach((img, index) => {
            const sources = [img.dataset.highResSrc];
            const altSources = img.dataset.altSources;

            if (altSources) {
                sources.push(...altSources.split(','));
            }

            galleryItems.push({
                element: img,
                sources: sources,
                highResSrc: img.dataset.highResSrc,
                altSrc: img.dataset.altSrc,
                title: img.dataset.title,
                description: img.dataset.description,
                isSensitive: img.dataset.sensitive === 'true',
                isRevealed: false
            });

            img.addEventListener('click', () => {
                openModalAtIndex(index);
            });
        });
        
        function linkify(text) {
            const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|(\b[a-z0-9.-]+\.(com|org|net|io)\b(\/[^ \t\n\r<]*)?)/ig;
            return text.replace(urlPattern, function(url) {
                let href = url;
                if (!href.startsWith('http')) {
                    href = 'https://' + href;
                }
                return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
            });
        }

        function openModalAtIndex(index) {
            lastFocusedElement = document.activeElement;
            
            imageContainer.classList.remove('zoomed');
            modal.classList.remove('is-zoomed');
            modalImg.style.transformOrigin = 'center center';
            modalImgNext.style.transformOrigin = 'center center';
            modal.classList.remove('show-warning');
            modalImg.classList.remove('blurred');
            modalImgNext.classList.remove('blurred');

            currentImageIndex = index;
            const item = galleryItems[currentImageIndex];

            currentSourceIndex = 0;

            modalTitle.textContent = item.title;
            modalDescription.innerHTML = linkify(item.description);

            // sensitive-content
            if (item.isSensitive && !item.isRevealed) {
                modal.classList.add('show-warning');
                modalImg.classList.add('blurred');
                modalImgNext.classList.add('blurred');
            } else {
                modal.classList.remove('show-warning');
                modalImg.classList.remove('blurred');
                modalImgNext.classList.remove('blurred');
            }

            const tempImg = new Image();
            tempImg.src = item.sources[0];
            
            tempImg.onload = () => {
                modalImg.src = item.sources[0];
                modalImgNext.src = ''; // Reset next image
                modalImgNext.classList.remove('is-fading');

                if (item.sources.length > 1) {
                    altBtn.style.display = 'inline-block';
                    altBtn.textContent = 'View Alternative';
                } else {
                    altBtn.style.display = 'none';
                }

                modal.style.display = 'flex';
                closeModalBtn.focus();
            }
        }

        function closeModal() {
            modal.style.display = 'none';
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        }

        function showNextImage() {
            const nextIndex = (currentImageIndex + 1) % galleryItems.length;
            openModalAtIndex(nextIndex);
        }

        function showPrevImage() {
            const prevIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
            openModalAtIndex(prevIndex);
        }

        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal();
        });
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        
        continueBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            if (galleryItems[currentImageIndex]) {
                galleryItems[currentImageIndex].isRevealed = true;
            }
            modal.classList.remove('show-warning');
            modalImg.classList.remove('blurred');
            modalImgNext.classList.remove('blurred');
        });

        // --- Keyboard and focus (A11y Focus Trap) ---
        const focusableElementsSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        let focusableElements = [];
        let firstFocusableElement, lastFocusableElement;

        modal.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeModal();
                return;
            }
            
            if (modal.classList.contains('is-zoomed')) return;

            if (event.key === 'ArrowRight') showNextImage();
            if (event.key === 'ArrowLeft') showPrevImage();
            
            // Focus Trap Logic
            if (event.key === 'Tab') {
                focusableElements = Array.from(modal.querySelectorAll(focusableElementsSelector)).filter(el => el.offsetParent !== null);
                firstFocusableElement = focusableElements[0];
                lastFocusableElement = focusableElements[focusableElements.length - 1];

                if (event.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        event.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        event.preventDefault();
                    }
                }
            }
        });
        
        // --- Zoom & Swipe logic ---
        let touchStartX = 0;
        modal.addEventListener('touchstart', (event) => {
            if (imageContainer.classList.contains('zoomed')) return;
            touchStartX = event.changedTouches[0].screenX;
        }, { passive: true });

        modal.addEventListener('touchend', (event) => {
            if (imageContainer.classList.contains('zoomed')) return;
            const touchEndX = event.changedTouches[0].screenX;
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) showNextImage();
            if (touchEndX > touchStartX + swipeThreshold) showPrevImage();
        });
        
        imageContainer.addEventListener('click', function(event) {
            if (modal.classList.contains('show-warning')) return;
            event.stopPropagation();
            this.classList.toggle('zoomed');
            modal.classList.toggle('is-zoomed');
            if (!this.classList.contains('zoomed')) {
                modalImg.style.transformOrigin = 'center center';
                modalImgNext.style.transformOrigin = 'center center';
            }
        });

        imageContainer.addEventListener('mousemove', function(event) {
            if (this.classList.contains('zoomed')) {
                const rect = this.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 100;
                const y = ((event.clientY - rect.top) / rect.height) * 100;
                modalImg.style.transformOrigin = `${x}% ${y}%`;
                modalImgNext.style.transformOrigin = `${x}% ${y}%`;
            }
        });

        imageContainer.addEventListener('mouseleave', function() {
            if (!this.classList.contains('zoomed')) {
                modalImg.style.transformOrigin = 'center center';
                modalImgNext.style.transformOrigin = 'center center';
            }
        });
        
        // --- button alternative logic ---
        altBtn.addEventListener('click', () => {
            const item = galleryItems[currentImageIndex];
            if (item.sources.length <= 1) return;

            let currentImg = document.getElementById('modal-img');
            let nextImg = document.getElementById('modal-img-next');

            currentSourceIndex = (currentSourceIndex + 1) % item.sources.length;
            
            if (currentSourceIndex === item.sources.length - 1) {
                altBtn.textContent = 'View Original';
            } else if (currentSourceIndex === 0) {
                altBtn.textContent = 'View Alternative';
            } else {
                altBtn.textContent = `View Alternative ${currentSourceIndex + 1}`;
            }

            // element next change
            const tempImg = new Image();
            tempImg.src = item.sources[currentSourceIndex];

            tempImg.onload = () => {
                nextImg.src = item.sources[currentSourceIndex];

                //anim fading
                currentImg.classList.add('is-fading');
                nextImg.classList.add('is-fading');

                // interchance roles
                nextImg.addEventListener('transitionend', () => {
                    // Limpiar las clases de ambos elementos
                    currentImg.classList.remove('is-fading');
                    nextImg.classList.remove('is-fading');
                    currentImg.id = 'modal-img-next';
                    nextImg.id = 'modal-img';

                }, { once: true });
            };
        });
    }
    initializeGalleryModal();
});