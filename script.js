// CARGA DE LOS VIDEOS EN EL DOM

// Cojo el contenedor donde se veran los videos
const contenedorJuegos = document.getElementById('contenedor_juegos');
// Cojo la plantilla que tengo en el HTML para poder clonar y rellenar con los datos que me interesan
const plantilla = document.getElementById('plantilla');

// Cojo el ID del ultimo video visto desde el local storage
const ultimoReproducido = localStorage.getItem('ultimoReproducido');

// Por cada video del array creo un nuevo article para mostrarlo en el DOM insertando los datos en la plantilla
videos.forEach(video => {
    // Creo una copia exacta de la plantilla 
    const nuevoArticulo = plantilla.cloneNode(true);

    // Limpio el ID "plantilla" del clon para evitar duplicados en el HTML
    nuevoArticulo.removeAttribute('id');
    // Guardo la categoría en un atributo 'data' para filtrar mejor despues
    nuevoArticulo.dataset.categoria = video.category.toLowerCase();

    // Localizo la imagen dentro del nuevo artículo y le asigno la miniatura del video y un texto alternativo
    const miniatura = nuevoArticulo.querySelector('.js-miniatura');
    miniatura.src = video.thumbnail;
    miniatura.alt = video.title;

    // Pongo los datos del video en sus elementos correspondientes dentro del nuevo artículo
    nuevoArticulo.querySelector('.js-titulo').textContent = video.title;
    nuevoArticulo.querySelector('.js-categoria').textContent = "- " + video.category;
    nuevoArticulo.querySelector('.js-runner').textContent = video.runner;
    nuevoArticulo.querySelector('.js-tiempo').textContent = video.time;

    // LOCAL STORAGE 
    
    // Cojo el progreso guardado de los video o si no hay nada creo uno vacio
    const progresoGuardado = JSON.parse(localStorage.getItem('progresoVideos')) || {};
    // Busco la info del video usando su ID para saber si esta marcado como visto o no
    const infoVideo = progresoGuardado[video.id];
    
    // Si existe información y el video está marcado como "visto", muestro que el video está visto
    if (infoVideo && infoVideo.visto) {
        const etiquetaVisto = nuevoArticulo.querySelector('.js-visto');
        if (etiquetaVisto) {
            etiquetaVisto.classList.remove('hidden'); // Quita la clase que lo oculta
        }
    }

    // Comparo el ID del video actual con el guardado como ultimo reproducido
    if (ultimoReproducido && parseInt(ultimoReproducido) === video.id) {
            const etiquetaUltimo = nuevoArticulo.querySelector('.js-ultimo');
            if (etiquetaUltimo) {
                etiquetaUltimo.classList.remove('hidden'); // Muestra la etiqueta de ultimo visto si coincide con el ID del video
            }
            // Añade un borde de color para poder verlo bien
            nuevoArticulo.classList.add('border-indigo-500'); 
        }

    // Al hacer clic en la tarjeta del video, redirigimos a la página del reproductor pasando el ID del video clickado por URL
    nuevoArticulo.addEventListener("click", () => {
        window.location.href = `reproductor.html?id=${video.id}`; //Aqui paso el ID
    });

    // Añado el artículo del juego ya con todo al final del contenedor principal, asi por cada video
    contenedorJuegos.appendChild(nuevoArticulo);
});

// Borro la plantilla original del DOM ya que solo servía como un "molde"  inicial
plantilla.remove();


//  CONTROL DE LOS BOTONES DE FILTROS 

// Selecciono todos los botones que el  ID comience por boton_
const botonesFiltro = document.querySelectorAll('[id^="boton_"]');

// Defino los conjuntos de clases de Tailwind para estados visuales (si está activo o inactivo para aplicarlo más facilmente)
const clasesActivo = ['bg-indigo-600', 'hover:bg-indigo-500', 'text-white', 'shadow-lg', 'shadow-indigo-500/30'];
const clasesInactivo = ['bg-gray-800', 'hover:bg-gray-700', 'text-gray-300', 'border', 'border-gray-700'];

// Asigno el evento de clic a cada botón de filtro
botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
        
        // Primero: Resetear todos los botones al estado "inactivo"
        botonesFiltro.forEach(b => {
            b.classList.remove(...clasesActivo); //Los tres puntos sirven para separar los elementos del array y pasarlos como clases individuales a la función
            b.classList.add(...clasesInactivo);
        });

        // Segundo: Aplicar las clases de estado "activo" solo al botón pulsado
        boton.classList.remove(...clasesInactivo);
        boton.classList.add(...clasesActivo);

        // Extraigo el nombre de la categoría eliminando el prefijo "boton_" del ID
        const categoria = boton.id.replace('boton_', '');
        
        // Ejecuto la función que oculta o muestra los videos
        filtrarJuegos(categoria);
    });
});


// FUNCIÓN DE FILTRADO 

function filtrarJuegos(categoriaFiltro) {
    // Selecciono todos los artículos que acabamos de generar en el contenedor
    const articlesJuegos = document.querySelectorAll('#contenedor_juegos article');
    
    articlesJuegos.forEach(article => {
        // Obtenemos la categoría guardada anteriormente en el dataset del artículo
        const categoriaJuego = article.getAttribute('data-categoria');
        
        // Verificamos si la categoría del video contiene el texto del filtro aplicado
        // Esto permite que "any" coincida con "any%" o "any% glitchless"
        if (categoriaJuego.includes(categoriaFiltro)) {
            article.classList.remove('hidden'); // Lo muestra
        } else {
            article.classList.add('hidden');    // Lo oculta
        }
    });
}