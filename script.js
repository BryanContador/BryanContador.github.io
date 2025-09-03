document.addEventListener('DOMContentLoaded', () => {

    // --- RANDOMIZER PARA INTRO(SOLO EN INDEX.HTML) ---

    const introTextElement = document.getElementById('intro-text-randomizer');
    if (introTextElement) {
        
        // textos. 
        const introTexts = [
            `Have a look around.<br>This site is under constant development, so don't freak out if it doesn't look the same each time you visit.`,//ORIGINAL
            "Welcome, stranger. What are you buying?", 
            "I used to be an adventurer like you. Then I took an arrow in the knee...",
            "War... War never changes.",
            "FUCK MINNESOTA.",
            "FUCK YOU IN PARTICULAR",
            "As i break apart."
            // ...
        ];

        //chance intro
        const chanceForAlternative = 0.25; 

        if (Math.random() < chanceForAlternative) {
            const alternativeTexts = introTexts.slice(1);
            const randomIndex = Math.floor(Math.random() * alternativeTexts.length);
            introTextElement.innerHTML = alternativeTexts[randomIndex];
        }
    }

    // --- RANDOMIZER PARA FOOTER (EN TODAS LAS PÁGINAS) ---
    const footerQuoteElement = document.getElementById('footer-quote');
    if (footerQuoteElement) {
        const footerQuotes = [
            "Everything in this life is impossible until someone comes and does it.", //OG
            //"Stay awhile and listen...", 
            //"The right man in the wrong place can make all the difference in the world.",
            //"It’s a-me, Mario!",
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
        //chance footer
        const chanceForAlternativeFooter = 0.25;
        if (Math.random() < chanceForAlternativeFooter) {
            const alternativeQuotes = footerQuotes.slice(1);
            const randomIndex = Math.floor(Math.random() * alternativeQuotes.length);
            footerQuoteElement.textContent = `"${alternativeQuotes[randomIndex]}"`;
        }
    }

    // --- RANDOMIZER PARA HEADER ---
const headerTitleElement = document.getElementById('header-title');
if (headerTitleElement) {
        const alternativeTitles = [
            "FUCK YOU IN PARTICULAR"
        ];
         //chance title
        const chanceForAlternativeHeader = 0.01; 
        
        if (Math.random() < chanceForAlternativeHeader) {
            const randomIndex = Math.floor(Math.random() * alternativeTitles.length);
            headerTitleElement.textContent = alternativeTitles[randomIndex];
        }
    }
});