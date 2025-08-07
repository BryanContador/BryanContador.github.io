// Seleccionamos el interruptor (el checkbox)
const themeSwitch = document.querySelector('#checkbox');

// Cuando el interruptor cambia de estado (se activa o desactiva)
themeSwitch.addEventListener('change', () => {
  // 'toggle' añade la clase si no está, y la quita si ya está.
  // Con una sola línea, cambiamos entre los dos modos.
  document.body.classList.toggle('dark-mode');
});