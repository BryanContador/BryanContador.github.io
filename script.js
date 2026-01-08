/**
 * Benjamin Counter Website JavaScript
 * Handles randomizers, navigation, theme switching, gallery rendering, and interactive features
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
    // GALLERY GENERATOR
    // ==========================================================================

    function renderGallery() {
        const container = document.getElementById('dynamic-gallery-container');
        
        // If no container found (e.g. index.html or about.html), exit
        if (!container) return; 

        const category = container.dataset.category;
        const layout = container.dataset.layout; // Detect layout type
        
        // Check if galleryData exists (from data.js)
        if (typeof galleryData === 'undefined') {
            console.error('galleryData is not defined. Make sure data.js is loaded.');
            return;
        }

        const items = galleryData[category];

        if (!items) {
            console.error(`No data found for category: ${category}`);
            return;
        }

        // --- LIST LAYOUT (Characters / Categories) ---
        if (layout === 'list') {
            container.className = 'category-list-grid';

            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'category-card';
                
                if (item.id) {
                    card.onclick = () => {
                        window.location.href = `character.html?id=${item.id}`;
                    };
                }
                
                //  Thumbnail Container
                const imgContainer = document.createElement('div');
                imgContainer.className = 'category-thumb-container';

                const img = document.createElement('img');
                img.className = 'category-thumb';
                
                if (item.thumb) {
                    img.src = item.thumb;
                } else {
                    img.src = 'resources/logo.png'; 
                }
                
                img.alt = item.name;
                img.loading = 'lazy';

                imgContainer.appendChild(img);

                const nameTag = document.createElement('h3');
                nameTag.className = 'category-name';
                nameTag.textContent = item.name;

                card.appendChild(imgContainer);
                card.appendChild(nameTag);

                container.appendChild(card);
            });

        } else {
            // --- STANDARD GALLERY LAYOUT (Images / Fanart / Sketches) ---
            container.className = 'gallery-grid';

            items.forEach(item => {
                if (item.type === 'separator') {
                    // Create separator
                    const separatorDiv = document.createElement('div');
                    separatorDiv.className = 'gallery-separator-line';
                    container.appendChild(separatorDiv);
                } else if (item.type === 'image') {
                    // Create gallery item
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'gallery-item';

                    const img = document.createElement('img');
                    img.className = 'gallery-image';
                    img.src = item.thumb;
                    img.alt = item.title || 'Gallery Image';
                    img.loading = 'lazy';
                    
                    // Assign dataset attributes for Modal logic
                    img.dataset.highResSrc = item.highRes;
                    img.dataset.title = item.title;
                    img.dataset.description = item.description;

                    if (item.sensitive) {
                        img.dataset.sensitive = 'true';
                    }

                    if (item.altSources && item.altSources.length > 0) {
                        img.dataset.altSources = item.altSources.join(',');
                    }

                    itemDiv.appendChild(img);
                    container.appendChild(itemDiv);
                }
            });
        }
    }

    // Render the gallery BEFORE initializing the modal
    renderGallery();

    // ==========================================================================
    // GALLERY MODAL FUNCTIONALITY (CENTRALIZED)
    // ==========================================================================
    
    // Modal logic is only for standard gallery images, not character lists
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
        // Retrieve loader element (added in HTML update)
        const loader = document.getElementById('modal-loader');

        const galleryItems = [];
        let currentImageIndex = 0;
        let lastFocusedElement;
        let currentSourceIndex = 0;
        let isSwitching = false;

        // Select ONLY the standard gallery images generated
        const galleryImageElements = document.querySelectorAll('.gallery-image');
        
        // If no gallery images (e.g., we are in character list view), stop modal init
        if (galleryImageElements.length === 0) return;

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
            if (!text) return '';
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
            
            // --- FIX FOR FLASHING: Disable transitions instantly ---
            modalImg.style.transition = 'none';
            modalImgNext.style.transition = 'none';
            
            // Reset states - Clear warning/blur initially so loader is visible
            modal.classList.remove('show-warning');
            modalImg.classList.remove('blurred');
            modalImgNext.classList.remove('blurred');

            modalImg.style.opacity = '0'; // Force invisible instantly
            modalImgNext.style.opacity = '';
            
            modalImg.classList.remove('is-fading');
            modalImgNext.classList.remove('is-fading');
            // Remove error class if present
            modalImg.classList.remove('is-error');

            currentImageIndex = index;
            const item = galleryItems[currentImageIndex];

            currentSourceIndex = 0;

            modalTitle.textContent = item.title;
            modalDescription.innerHTML = linkify(item.description);

            // Set alt text for modal images
            const altText = item.title ? `Drawing: ${item.title}` : item.description ? `Drawing: ${item.description.split('.')[0]}` : 'Gallery drawing';
            modalImg.alt = altText;
            modalImgNext.alt = altText;

            // sensitive-content warning tag logic moved after load---

            // Set loading="lazy" for modal images
            modalImg.setAttribute('loading', 'lazy');
            modalImgNext.setAttribute('loading', 'lazy');

            // --- CHANGED: Open Modal Immediately with Loader ---
            
            // Show Modal UI
            modal.style.display = 'flex';
            closeModalBtn.focus();

            // Setup Loading State
            if (loader) {
                loader.style.display = 'block';
                loader.textContent = 'LOADING...';
            }
            modalImg.classList.add('is-loading'); // Ensures CSS keeps it hidden

            // Set Image Source
            modalImg.src = item.sources[0];
            modalImgNext.src = ''; 
            modalImgNext.classList.remove('is-fading');

            // Restore transitions after a tiny delay so the "Hide" was instant
            setTimeout(() => {
                modalImg.style.transition = '';
                modalImgNext.style.transition = '';
            }, 50);

            //Handle Image Load
            modalImg.onload = () => {
                // Hide loader, show image
                if (loader) loader.style.display = 'none';
                modalImg.classList.remove('is-loading');
                
                modalImg.style.opacity = ''; 

                // Apply Sensitive Warning ONLY after load is complete
                if (item.isSensitive && !item.isRevealed) {
                    modal.classList.add('show-warning');
                    modalImg.classList.add('blurred');
                    modalImgNext.classList.add('blurred');
                } else {
                    modal.classList.remove('show-warning');
                    modalImg.classList.remove('blurred');
                    modalImgNext.classList.remove('blurred');
                }

                // Logic for Alternative Button
                if (item.sources.length > 1) {
                    altBtn.style.display = 'inline-block';
                    altBtn.textContent = 'View Alternative';
                    // Preload first alternative image if available
                    if (item.sources[1]) {
                        const preloadAlt = new Image();
                        preloadAlt.src = item.sources[1];
                    }
                } else {
                    altBtn.style.display = 'none';
                }
            };

            modalImg.onerror = () => {
                if (loader) loader.textContent = "Error loading image";
            };
        }

        function closeModal() {
            modal.style.display = 'none';
            // Stop loading if user closes modal early
            modalImg.src = ''; 
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
        // REMOVED: Gave a lot of trouble on mobile while trying to swipe. Just deteled them for simplicity lol
        /*  
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
        */

        imageContainer.addEventListener('click', function(event) {
            // Disable zoom on small screens
            if (window.innerWidth <= 768) return; 

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
            if (isSwitching) {
                altBtn.textContent = 'PLEASE WAIT';
                return;
            }

            const item = galleryItems[currentImageIndex];
            if (item.sources.length <= 1) return;

            isSwitching = true; // Block new clics
            altBtn.disabled = true; // Disable clicks
            altBtn.textContent = 'PLEASE WAIT'; // Show wait message

            let currentImg = document.getElementById('modal-img');
            let nextImg = document.getElementById('modal-img-next');

            currentSourceIndex = (currentSourceIndex + 1) % item.sources.length;
            
            const originalBtnText = currentSourceIndex === item.sources.length - 1 ? 'View Original' :
                                    currentSourceIndex === 0 ? 'View Alternative' :
                                    `View Alternative ${currentSourceIndex + 1}`;
            const tempImg = new Image();
            tempImg.src = item.sources[currentSourceIndex];

            tempImg.onload = () => {
                nextImg.src = item.sources[currentSourceIndex];

                // fadding 
                nextImg.alt = currentImg.alt;

                // Preload next alternative image if available
                const nextAltIndex = (currentSourceIndex + 1) % item.sources.length;
                if (item.sources[nextAltIndex]) {
                    const preloadNextAlt = new Image();
                    preloadNextAlt.src = item.sources[nextAltIndex];
                }

                currentImg.classList.add('is-fading');
                nextImg.classList.add('is-fading');

                nextImg.addEventListener('transitionend', () => {
                    currentImg.style.transition = 'none';
                    nextImg.style.transition = 'none';
                    currentImg.src = nextImg.src;
                    currentImg.alt = nextImg.alt;

                    currentImg.style.opacity = '1';
                    nextImg.style.opacity = '0';
                    currentImg.classList.remove('is-fading');
                    nextImg.classList.remove('is-fading');
                    nextImg.src = '';

                    // restore transitions
                    setTimeout(() => {
                        currentImg.style.transition = '';
                        nextImg.style.transition = '';
                        currentImg.style.opacity = '';
                        nextImg.style.opacity = '';

                        setTimeout(() => {
                            isSwitching = false;
                            altBtn.disabled = false;
                            altBtn.textContent = originalBtnText; // Restore original button text
                        }, 500); // Delay
                    }, 0);
                }, { once: true });
            };
        });
    }
    initializeGalleryModal();

    //--- User String logic ---    
    const secretInput = document.getElementById('secret-input');

    const SECRET_DESTINATIONS = {
        //string : dest,
        "3cc93b2a02bca5ed6dfd9626007d0c37acc72e87fe3887923ee8de4a52dbb14d": 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08": "sketches.html", // "test"
        "0832c0adf05418144b7b5f01e14600782ba7a302a606b49e3bf26214b765c176": "surprise.html", // name
        //etc...
    };
    
    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    if (secretInput) {
        
        // --- Dynamic Resizing Logic ---
        const resizeInput = () => {
            const span = document.createElement('span');
            span.style.font = getComputedStyle(secretInput).font;
            span.style.visibility = 'hidden';
            span.style.position = 'absolute';
            span.style.whiteSpace = 'pre';
            span.textContent = secretInput.value || secretInput.placeholder || '';
            
            document.body.appendChild(span);
            const textWidth = span.offsetWidth;
            document.body.removeChild(span);

            const newWidth = Math.max(120, textWidth + 20); 
            
            if (document.activeElement === secretInput || secretInput.value.length > 0) {
                 secretInput.style.width = `${newWidth}px`;
            } else {
                 secretInput.style.width = '80px'; 
            }
        };

        secretInput.addEventListener('input', resizeInput);
        secretInput.addEventListener('focus', resizeInput); 
        secretInput.addEventListener('blur', resizeInput); 

        // --- Check Logic ---
        secretInput.addEventListener('input', async (e) => {
            resizeInput();

            const val = e.target.value.trim(); 

            if (val.length === 0) {
                e.target.style.borderColor = ''; 
                return;
            }
            
            const currentHash = await sha256(val);

            if (SECRET_DESTINATIONS[currentHash]) {
                e.target.style.borderColor = '#00ff00'; 
                setTimeout(() => {
                    window.location.href = SECRET_DESTINATIONS[currentHash];
                }, 300); 
            } else {
                e.target.style.borderColor = 'var(--text-color)';
            }
        });
    }

    // ==========================================================================
    // CHARACTER PROFILE LOADER
    // ==========================================================================

    function loadCharacterProfile() {
        const charNameEl = document.getElementById('char-name');
        if (!charNameEl) return;

        // NEW: Get Lore elements
        const loreWrapper = document.getElementById('lore-wrapper');
        const loreBtn = document.getElementById('lore-expand-btn');
        const loreFade = document.querySelector('.lore-fade-overlay');

        const urlParams = new URLSearchParams(window.location.search);
        const charId = urlParams.get('id');

        if (!charId || !galleryData.categories) {
            charNameEl.textContent = "CHARACTER NOT FOUND";
            if(loreBtn) loreBtn.style.display = 'none';
            return;
        }

        const character = galleryData.categories.find(c => c.id === charId);

        if (character) {
            document.title = `${character.name} - Benjamin Counter`;
            charNameEl.textContent = character.name;
            
            const bioEl = document.getElementById('char-bio');
            if (bioEl) bioEl.textContent = character.bio || "No bio available.";

            // --- Updated Lore Logic ---
            const loreEl = document.getElementById('char-lore');
            if (loreEl) {
                loreEl.textContent = character.lore || "No story available yet.";

                if (loreWrapper && loreBtn) {
                     // Reset to default state first (collapsed)
                     loreWrapper.classList.add('collapsed');
                     loreWrapper.classList.remove('expanded');
                     loreBtn.style.display = 'none'; // Hide initially to prevent jump
                     if(loreFade) loreFade.style.display = 'block';

                     // Wait for render to calculate height
                     setTimeout(() => {
                        const fullHeight = loreEl.scrollHeight;
                        const collapsedHeight = 250;

                        if (fullHeight <= collapsedHeight + 50) {
                            // Text is short
                            loreWrapper.classList.remove('collapsed');
                            loreWrapper.classList.add('expanded');
                            loreBtn.style.display = 'none';
                            if(loreFade) loreFade.style.display = 'none';
                        } else {
                            // Text is long
                            loreBtn.style.display = 'block';
                            if(loreFade) loreFade.style.display = 'block';
                        }
                     }, 50);
                }
            }

            const imgEl = document.getElementById('char-profile-img');
            if (imgEl) {
                imgEl.src = character.profileImage || character.thumb || 'resources/logo.png';
                imgEl.alt = character.name;
            }

            const galleryContainer = document.getElementById('dynamic-gallery-container');
            if (galleryContainer && character.galleryKey) {
                galleryContainer.dataset.category = character.galleryKey;
                
                renderGallery();
                
                initializeGalleryModal();
            } else {
                document.querySelector('.gallery').style.display = 'none';
                document.querySelector('.gallery-separator-line').style.display = 'none';
                document.querySelectorAll('h3')[1].style.display = 'none';
            }
        } else {
            charNameEl.textContent = "CHARACTER NOT FOUND";
        }

        // Add Event Listener to button (prevent duplicate listeners)
        if (loreBtn && !loreBtn.dataset.hasListener) {
            loreBtn.addEventListener('click', () => {
                if (loreWrapper) {
                    loreWrapper.classList.toggle('collapsed');
                    loreWrapper.classList.toggle('expanded');
                }
            });
            loreBtn.dataset.hasListener = "true";
        }
    }

    loadCharacterProfile();
});