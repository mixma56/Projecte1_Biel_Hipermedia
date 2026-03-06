// OBTENCIÓN DEL VIDEO DESDE LA URL 

// Lee los parámetros de la URL 
const parametrosURL = new URLSearchParams(window.location.search);
// Extrae el valor del parámetro 'id'
const idVideoStr = parametrosURL.get('id'); 
// Convierte ese ID de texto a número entero
const idBuscado = parseInt(idVideoStr);
// Busca en el array 'videos' el objeto que coincida con ese ID
const videoEncontrado = videos.find(video => video.id === idBuscado);

// Si el video existe en nuestra base de datos, cargamos su información en el HTML y configuramos el reproductor
if (videoEncontrado) {
    // CARGA DE INFORMACIÓN EN EL HTML 
    document.getElementById('detalle-titulo').textContent = videoEncontrado.title;
    document.getElementById('detalle-categoria').textContent = videoEncontrado.category;
    document.getElementById('detalle-runner').textContent = videoEncontrado.runner;
    document.getElementById('detalle-tiempo').textContent = videoEncontrado.time;
    document.getElementById('detalle-descripcion').textContent = videoEncontrado.description;
    
    // Guarda este ID como el último que el usuario ha intentado reproducir, esto nos sirve para mostrarlo luego en la página principal
    localStorage.setItem('ultimoReproducido', idBuscado);
    
    // CONFIGURACIÓN DEL  VIDEO 
    const videoElemento = document.getElementById('detalle-video');
    videoElemento.src = videoEncontrado.videoUrl; // Fuente del archivo de video
    videoElemento.poster = videoEncontrado.thumbnail; // Imagen de portada antes de dar play

    // CAPTURA DE ELEMENTOS DE CONTROL 
    const playBtn = document.getElementById('play-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const videoContainer = document.getElementById('video-container');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const muteBtn = document.getElementById('mute-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const fullscreenBtn = document.getElementById('fullscreen-btn');

    //  UTILIDADES 
    // Función para convertir segundos, por ejemplo de 90 a "1:30"
    const formatTime = (time) => {
        if (!time) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    // LÓGICA DE REPRODUCCIÓN (PLAY/PAUSE)
    const togglePlay = () => {  
        if (videoElemento.paused) {
            videoElemento.play();
            playIcon.classList.add('hidden');    // Oculta icono Play
            pauseIcon.classList.remove('hidden'); // Muestra icono Pause
        } else {
            videoElemento.pause();
            playIcon.classList.remove('hidden'); // Muestra icono Play
            pauseIcon.classList.add('hidden');    // Oculta icono Pause
        }
    };

    // Listeners para poder hacer play o pause tanto con el botón como haciendo clic en el video
    playBtn.addEventListener('click', togglePlay);
    videoContainer.addEventListener('click', togglePlay);

    // Cuando el navegador ya conoce la duración del video, actualiza la interfaz
    videoElemento.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(videoElemento.duration);
        progressBar.max = videoElemento.duration; // Define el tope de la barra de progreso
    });

    // LOCAL STORAGE
    
    // Recupera el historial de progreso de todos los videos
    const progresoGuardado = JSON.parse(localStorage.getItem('progresoVideos')) || {};
    const progresoActual = progresoGuardado[idBuscado];

    // Si el usuario ya había visto parte del video, lo ponemos donde se quedó
    if (progresoActual && progresoActual.tiempo) {
        videoElemento.currentTime = progresoActual.tiempo;
    }

    // Se ejecuta cada vez que el tiempo del video avanza
    videoElemento.addEventListener('timeupdate', () => {
        const tiempoActual = videoElemento.currentTime;
        const duracionTotal = videoElemento.duration;

        // Actualiza el texto de tiempo y la posición de la barra
        currentTimeEl.textContent = formatTime(tiempoActual);
        progressBar.value = tiempoActual;

        // Actualizamos el objeto de progreso en LocalStorage
        const progreso = JSON.parse(localStorage.getItem('progresoVideos')) || {};
        let estadoVisto = false;

        // Mantenemos el estado de "visto" si ya lo estaba
        if (progreso[idBuscado]) {
            estadoVisto = progreso[idBuscado].visto;
        }

        // Si faltan menos de 2 segundos para acabar, marcamos como "visto" (visto = true)
        if (duracionTotal && tiempoActual >= (duracionTotal - 2)) {
            estadoVisto = true;
        }
        
        // Guardamos el segundo actual y si está completado
        progreso[idBuscado] = {
            tiempo: tiempoActual,
            visto: estadoVisto
        };
        
        localStorage.setItem('progresoVideos', JSON.stringify(progreso));
    });

    // INTERACCIÓN CON LA BARRA Y EL VOLUMEN
    
    // Permite al usuario saltar a un punto del video moviendo la barra
    progressBar.addEventListener('input', () => {
        videoElemento.currentTime = progressBar.value;
    });

    let lastVolume = 1; // Para recordar el volumen antes de silenciar

    // Control del slider de volumen
    volumeSlider.addEventListener('input', () => {
        videoElemento.volume = volumeSlider.value;
        videoElemento.muted = volumeSlider.value == 0;
        // Si el volumen es mayor a 0, guardamos este valor como "último volumen conocido"
        if (videoElemento.volume > 0) {
            lastVolume = videoElemento.volume;
        } else {
            lastVolume = 1;
        }
    });

    // Botón de Mute (Silenciar/Activar sonido)
    muteBtn.addEventListener('click', () => {
        videoElemento.muted = !videoElemento.muted;
        if (videoElemento.muted) {
            volumeSlider.value = 0; // Visualmente ponemos la barra a cero
        } else {
            volumeSlider.value = lastVolume; // Restauramos el valor anterior
            videoElemento.volume = lastVolume;
        }
    });
}

//  GESTIÓN DE PANTALLA COMPLETA 

fullscreenBtn.addEventListener('click', () => {
    // Si no estamos en pantalla completa, intentamos entrar
    if (!document.fullscreenElement) {
        if (videoElemento.requestFullscreen) {
            videoElemento.requestFullscreen();
        } else if (videoElemento.webkitRequestFullscreen) { 
            videoElemento.webkitRequestFullscreen();
        }
    } else {
        // Si ya estamos, salimos de ella
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
});