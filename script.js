// --- NUEVO JAVASCRIPT - MÁS INTELIGENTE Y FUNCIONAL ---

// 1. Encontrar los elementos con los que vamos a trabajar
const themeToggle = document.querySelector('#theme-toggle');
const body = document.body;

// 2. Definir el tema por defecto que queremos
const defaultTheme = 'dark'; // 'dark' para modo oscuro, 'light' para modo claro

// 3. Función para aplicar el tema
function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.checked = true; // El toggle está "activado" en modo oscuro
    } else {
        body.classList.remove('dark-mode');
        themeToggle.checked = false; // El toggle está "desactivado" en modo claro
    }
}

// 4. Cuando el usuario hace clic en el interruptor
themeToggle.addEventListener('change', () => {
    // Comprobamos si el interruptor está ahora activado
    if (themeToggle.checked) {
        // Si está activado, es modo oscuro
        applyTheme('dark');
        localStorage.setItem('theme', 'dark'); // Guardamos la elección
    } else {
        // Si no, es modo claro
        applyTheme('light');
        localStorage.setItem('theme', 'light'); // Guardamos la elección
    }
});

// 5. Al cargar la página, comprobar si el usuario ya tenía un tema guardado
// Si no hay nada guardado (primera visita), usamos el tema por defecto.
const savedTheme = localStorage.getItem('theme') || defaultTheme;
applyTheme(savedTheme);