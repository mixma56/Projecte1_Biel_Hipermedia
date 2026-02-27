// CARGA DE LOS VIDEOS EN EL DOM
const contenedorJuegos = document.getElementById('contenedor_juegos');
const plantilla = document.getElementById('plantilla');

videos.forEach(video => {
    const nuevoArticulo = plantilla.cloneNode(true);

    nuevoArticulo.removeAttribute('id');
    nuevoArticulo.dataset.categoria = video.category.toLowerCase();

    const miniatura = nuevoArticulo.querySelector('.js-miniatura');
    miniatura.src = video.thumbnail;
    miniatura.alt = video.title;

    nuevoArticulo.querySelector('.js-titulo').textContent = video.title;
    nuevoArticulo.querySelector('.js-categoria').textContent = "- " + video.category;
    nuevoArticulo.querySelector('.js-runner').textContent = video.runner;
    nuevoArticulo.querySelector('.js-tiempo').textContent = video.time;

    //LOCAL STORAGE
    const progresoGuardado = JSON.parse(localStorage.getItem('progresoVideos')) || {};
    const infoVideo = progresoGuardado[video.id];
    //mirar si está visto o no (info de script_detalle)
    if (infoVideo && infoVideo.visto) {
        const etiquetaVisto = nuevoArticulo.querySelector('.js-visto');
        if (etiquetaVisto) {
            etiquetaVisto.classList.remove('hidden');
        }
    }

    nuevoArticulo.addEventListener("click", () => {
        window.location.href = `reproductor.html?id=${video.id}`;
    });

    contenedorJuegos.appendChild(nuevoArticulo);
});

plantilla.remove();

// MANEJO DE LOS BOTONES DE FILTROS
const botonesFiltro = document.querySelectorAll('[id^="boton_"]');


// Clases para saber si está activo o no el botón
const clasesActivo = ['bg-indigo-600', 'hover:bg-indigo-500', 'text-white', 'shadow-lg', 'shadow-indigo-500/30'];
const clasesInactivo = ['bg-gray-800', 'hover:bg-gray-700', 'text-gray-300', 'border', 'border-gray-700'];

botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
        
        botonesFiltro.forEach(b => {
            b.classList.remove(...clasesActivo);
            b.classList.add(...clasesInactivo);
        });

        boton.classList.remove(...clasesInactivo);
        boton.classList.add(...clasesActivo);

        const categoria = boton.id.replace('boton_', '');
        
        filtrarJuegos(categoria);
    });
});

// FILTRO DE LOS JUEGOS
function filtrarJuegos(categoria) {
    // Es mejor seleccionar los artículos dinámicamente cada vez que filtras
    const articlesJuegos = document.querySelectorAll('#contenedor_juegos article');
    
    articlesJuegos.forEach(article => {
        if (categoria === 'any') {
            article.classList.remove('hidden');
        } else {
            const categoriaJuego = article.getAttribute('data-categoria');
            if (categoriaJuego === categoria) {
                article.classList.remove('hidden');
            } else {
                article.classList.add('hidden');
            }
        }
    });
}