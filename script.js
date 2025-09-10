document.addEventListener('DOMContentLoaded', () => {

    //  BLOQUE DE RANDOMIZERS
    const introTextElement = document.getElementById('intro-text-randomizer');
    if (introTextElement) {
        const introTexts = [`Have a look around.<br>This site is under constant development, so don't freak out if it doesn't look the same each time you visit.`, "Welcome, stranger. What are you buying?", "I used to be an adventurer like you. Then I took an arrow in the knee...", "War... War never changes.", "FUCK MINNESOTA.", "FUCK YOU IN PARTICULAR", "As I break apart."];
        if (Math.random() < 0.25) {
            const alternativeTexts = introTexts.slice(1);
            introTextElement.innerHTML = alternativeTexts[Math.floor(Math.random() * alternativeTexts.length)];
        }
    }
    const footerQuoteElement = document.getElementById('footer-quote');
    if (footerQuoteElement) {
        const footerQuotes = ["Everything in this life is impossible until someone comes and does it.", "Do a barrel roll!", "Start diggin in yo butt, twin", "Would you remember me tomorrow if i was gone?", "I'll always be dreaming of you.", "Minnesota, exist.", "Wish you were here...", "FUCK YOU", "I HATE YOU.", "FUCK YOU IN PARTICULAR"];
        if (Math.random() < 0.25) {
            const alternativeQuotes = footerQuotes.slice(1);
            footerQuoteElement.textContent = `"${alternativeQuotes[Math.floor(Math.random() * alternativeQuotes.length)]}"`;
        }
    }
    const headerTitleElement = document.getElementById('header-title');
    if (headerTitleElement) {
        const alternativeTitles = ["FUCK YOU IN PARTICULAR"];
        if (Math.random() < 0.01) {
            headerTitleElement.textContent = alternativeTitles[Math.floor(Math.random() * alternativeTitles.length)];
        }
    }

    //  MENÚ HAMBURGUESA
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

    //  INDICADOR DE NAVEGACIÓN CON ANIMACIÓN
    const navLinksForIndicator = document.querySelectorAll('#nav-menu li a');
    const indicator = document.getElementById('nav-indicator');
    const navContainer = document.querySelector('.nav-container');
    if (indicator && navContainer && navLinksForIndicator.length > 0) {
        function moveIndicatorTo(targetLink) {
            if (!targetLink) return;
            const linkRect = targetLink.getBoundingClientRect();
            const containerRect = navContainer.getBoundingClientRect();
            const left = linkRect.left - containerRect.left;
            const width = linkRect.width;
            indicator.style.left = `${left}px`;
            indicator.style.width = `${width}px`;
        }

        function setInitialPosition() {
            let currentPage = window.location.pathname.split('/').pop();
            if (currentPage === '' || currentPage === 'index.html') {
                currentPage = 'index.html';
            }
            const activeLink = Array.from(navLinksForIndicator).find(link => link.getAttribute('href') === currentPage);
            document.fonts.ready.then(() => moveIndicatorTo(activeLink));
        }

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

        setInitialPosition();
        window.addEventListener('resize', setInitialPosition);
    }

    //  INTERRUPTOR DE TEMA
    const themeSwitcher = document.getElementById('theme-switcher');
    if (themeSwitcher) {
        const body = document.body;
        const footerLogo = document.querySelector('.footer-logo');
        const profilePicture = document.querySelector('.profile-picture');
        const indexLogo = document.querySelector('.index-logo');

        const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

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

        const toggleTheme = () => {
            const isDark = body.classList.contains('dark-mode');
            const newTheme = isDark ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        };

        const initializeTheme = () => {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
        };

        themeSwitcher.addEventListener('click', toggleTheme);
        initializeTheme();
    }
});