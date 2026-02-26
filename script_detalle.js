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

}