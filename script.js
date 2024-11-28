let bubbles = [];
let bubbleCount = 120 ;
let stressLevel = 50;  // Comienza en la mitad
let bubbleContainer = document.getElementById('bubble-container');
let stressBar = document.getElementById('stress-level');
let bubbleSounds = [
  document.getElementById('bubble-sound1'),
  document.getElementById('bubble-sound2'),
  document.getElementById('bubble-sound3')
];
let relaxMusic = document.getElementById('relax-music');
let tenseMusic = document.getElementById('tense-music');
let lastExplosionTime = Date.now();

relaxMusic.volume = 0.3;
tenseMusic.volume = 0.3;

function generateBubbles() {
  bubbleContainer.innerHTML = '';
  for (let i = 0; i < bubbleCount; i++) {
    let bubble = document.createElement('img');
    bubble.src = 'img/burb1.jpeg'
    bubble.classList.add('bubble');
    bubble.addEventListener('click', () => popBubble(bubble));
    bubbleContainer.appendChild(bubble);
    bubbles.push(bubble);
  }
}

function popBubble(bubble) {
  // Verificar si la burbuja ya está explotada
  if (bubble.classList.contains('deflated')) {
    return; // No hacer nada si ya fue explotada
  }

  // Reproducir sonido aleatorio
  let sound = bubbleSounds[Math.floor(Math.random() * bubbleSounds.length)];
  sound.play();

  // Aplicar animación de desaparición
  bubble.classList.add('bubble-animate');

  // Cambiar a imagen desinflada después de la animación
  setTimeout(() => {
    bubble.src = 'img/burbexplo.jpeg'; // Imagen de burbuja explotada
    bubble.classList.remove('bubble-animate'); // Quitar animación previa
    bubble.classList.add('bubble-exploded-animate'); // Aplicar animación de aparición
    bubble.classList.add('deflated');
    bubble.removeEventListener('click', () => popBubble(bubble));
  }, 300); // Tiempo que dura la animación inicial (300ms)

  bubble.classList.add('deflated');
  // Reducir la barra de estrés
  stressLevel = Math.max(0, stressLevel - 0.25);
  updateStressBar();

  // Actualizar el último tiempo de explosión
  lastExplosionTime = Date.now();
  checkAllBubblesPopped();
}
function checkAllBubblesPopped() {
  const allPopped = bubbles.every(bubble => bubble.classList.contains('deflated'));

  if (allPopped) {
    // Reiniciar el juego cuando todas las burbujas estén explotadas
    setTimeout(() => { 
      generateBubbles(); // Volver a generar burbujas
    }, 1000); // Pausa de 1 segundo antes de reiniciar
  }
}
//Niveles de la barra
function updateStressBar() {
  stressBar.style.width = `${stressLevel}%`;

  if (stressLevel <= 20) {
    stressBar.style.backgroundColor = 'green';
    tenseMusic.pause();
    relaxMusic.play();
  } else if (stressLevel <= 60) {
    stressBar.style.backgroundColor = 'yellow';
    tenseMusic.pause();
    relaxMusic.play();
  } else {
    stressBar.style.backgroundColor = 'red';
    tenseMusic.play();
    relaxMusic.pause();
  }
}

function checkInactivity() {
  if (Date.now() - lastExplosionTime > 1800) {  // 3 minutos
    stressLevel = Math.min(100, stressLevel + 1);
    updateStressBar();
  }
}

setInterval(checkInactivity, 1000);

generateBubbles();
updateStressBar();
relaxMusic.play();


