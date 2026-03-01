const parametrosURL = new URLSearchParams(window.location.search);
const idVideoStr = parametrosURL.get('id'); 
const idBuscado = parseInt(idVideoStr);
const videoEncontrado = videos.find(video => video.id === idBuscado);

if (videoEncontrado) {
    // Info del juego
    document.getElementById('detalle-titulo').textContent = videoEncontrado.title;
    document.getElementById('detalle-categoria').textContent = videoEncontrado.category;
    document.getElementById('detalle-runner').textContent = videoEncontrado.runner;
    document.getElementById('detalle-tiempo').textContent = videoEncontrado.time;
    document.getElementById('detalle-descripcion').textContent = videoEncontrado.description;
    localStorage.setItem('ultimoReproducido', idBuscado);
    
    // Confi del video
    const videoElemento = document.getElementById('detalle-video');
    videoElemento.src = videoEncontrado.videoUrl;
    videoElemento.poster = videoEncontrado.thumbnail; 

    //Elementos de control
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

    // Formateo del tiempo
    const formatTime = (time) => {
        if (!time) return "0:00";
        
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        
        return `${minutes}:${seconds}`;
    };

    // Función Play/Pause 
    const togglePlay = () => {  
        if (videoElemento.paused) {
            videoElemento.play();
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        } else {
            videoElemento.pause();
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }
    };

    playBtn.addEventListener('click', togglePlay);
    videoContainer.addEventListener('click', togglePlay); // tambien funciona tocando el video

    // Cargar la duración total cuando el video esté listo
    videoElemento.addEventListener('loadedmetadata', () => {
        totalTimeEl.textContent = formatTime(videoElemento.duration);
        progressBar.max = videoElemento.duration;
    });

    // Local Storage
    const progresoGuardado = JSON.parse(localStorage.getItem('progresoVideos')) || {};
    const progresoActual = progresoGuardado[idBuscado];

    // Si teníamos un tiempo guardado, adelantamos el vídeo a ese punto
    if (progresoActual && progresoActual.tiempo) {
        videoElemento.currentTime = progresoActual.tiempo;
    }

    videoElemento.addEventListener('timeupdate', () => {
        const tiempoActual = videoElemento.currentTime;
        const duracionTotal = videoElemento.duration;

        // Actualizar Interfaz 
        currentTimeEl.textContent = formatTime(tiempoActual);
        progressBar.value = tiempoActual;

        // Guardado en Local Storage
        const progreso = JSON.parse(localStorage.getItem('progresoVideos')) || {};
        let estadoVisto = false;

        if (progreso[idBuscado]) {
            estadoVisto = progreso[idBuscado].visto;
        }

        // Marcar como visto si quedan menos de 2 segundos
        if (duracionTotal && tiempoActual >= (duracionTotal - 2)) {
            estadoVisto = true;
        }
        
        progreso[idBuscado] = {
            tiempo: tiempoActual,
            visto: estadoVisto
        };
        
        localStorage.setItem('progresoVideos', JSON.stringify(progreso));
    });

    // Barra de progreso
    progressBar.addEventListener('input', () => {
        videoElemento.currentTime = progressBar.value;
    });

    //Control de volumen
    let lastVolume = 1; 

    volumeSlider.addEventListener('input', () => {
        videoElemento.volume = volumeSlider.value;
        videoElemento.muted = volumeSlider.value == 0;
        lastVolume = videoElemento.volume > 0 ? videoElemento.volume : 1;
    });

    muteBtn.addEventListener('click', () => {
        videoElemento.muted = !videoElemento.muted;
        if (videoElemento.muted) {
            volumeSlider.value = 0;
        } else {
            volumeSlider.value = lastVolume;
            videoElemento.volume = lastVolume;
        }
    });
}

//Gestion de la pantalla completa

fullscreenBtn.addEventListener('click', () => {
    // Comprobamos si ya estamos en pantalla completa
    if (!document.fullscreenElement) {
        // Si no lo estamos, pedimos entrar (con compatibilidad para Safari/Móviles)
        if (videoElemento.requestFullscreen) {
            videoElemento.requestFullscreen();
        } else if (videoElemento.webkitRequestFullscreen) { /* Safari/iOS */
            videoElemento.webkitRequestFullscreen();
        }
    } else {
        // Si ya lo estamos, salimos
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari/iOS */
            document.webkitExitFullscreen();
        }
    }
});