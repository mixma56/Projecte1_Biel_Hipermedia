const parametrosURL = new URLSearchParams(window.location.search);
const idVideoStr = parametrosURL.get('id'); 
const idBuscado = parseInt(idVideoStr);
const videoEncontrado = videos.find(video => video.id === idBuscado);

if (videoEncontrado) {
    document.getElementById('detalle-titulo').textContent = videoEncontrado.title;
    document.getElementById('detalle-categoria').textContent = videoEncontrado.category;
    document.getElementById('detalle-runner').textContent = videoEncontrado.runner;
    document.getElementById('detalle-tiempo').textContent = videoEncontrado.time;
    document.getElementById('detalle-descripcion').textContent = videoEncontrado.description;
    
    const videoElemento = document.getElementById('detalle-video');
    videoElemento.src = videoEncontrado.videoUrl;
    videoElemento.poster = videoEncontrado.thumbnail; 

    //  LOCAL STORAGE:
    const progresoGuardado = JSON.parse(localStorage.getItem('progresoVideos')) || {};
    const progresoActual = progresoGuardado[idBuscado];

    // buscar el tiempo guardado
    if (progresoActual && progresoActual.tiempo) {
        videoElemento.currentTime = progresoActual.tiempo;
    }

    // Ir mirando el tiempo y marcar como "visto" si llega al final
    videoElemento.addEventListener('timeupdate', () => {
        const progreso = JSON.parse(localStorage.getItem('progresoVideos')) || {};
        const tiempoActual = videoElemento.currentTime;
        const duracionTotal = videoElemento.duration;
        
        // Comprobar si ya estaba marcado como visto

        if (progreso[idBuscado]){
            let estadoVisto = progreso[idBuscado].visto;
        } else{
            let estadoVisto = false;
        }
    
        // Doy por visto si llega a los ultimos 2 segundos del video
        if (duracionTotal && tiempoActual >= (duracionTotal - 2)) {
            estadoVisto = true;
        }
        
        progreso[idBuscado] = {
            tiempo: tiempoActual,
            visto: estadoVisto
        };
        
        localStorage.setItem('progresoVideos', JSON.stringify(progreso));
    });
}