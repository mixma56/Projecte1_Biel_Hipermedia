        
        //CARGA DE LOS VIDEOS EN EL DOM
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

            nuevoArticulo.addEventListener("click", () => {
                window.location.href = `reproductor.html?id=${video.id}`;
            });

            contenedorJuegos.appendChild(nuevoArticulo);

        });

        plantilla.remove();

        //MANEJO DE LOS BOTONES DE FILTROS
        const botonAny = document.getElementById('boton_any');
        const botonGlitchless = document.getElementById('boton_glitchless');
        const boton100 = document.getElementById('boton_100');

        //clases para saber si esta activo o no el boton
        const clasesActivo = ['bg-indigo-600', 'hover:bg-indigo-500', 'text-white', 'shadow-lg', 'shadow-indigo-500/30'];
        const clasesInactivo = ['bg-gray-800', 'hover:bg-gray-700', 'text-gray-300', 'border', 'border-gray-700'];

        botonAny.addEventListener("click", () => {
            
            botonAny.classList.remove(...clasesInactivo);
            botonAny.classList.add(...clasesActivo);

            
            botonGlitchless.classList.remove(...clasesActivo);
            botonGlitchless.classList.add(...clasesInactivo);
            
            boton100.classList.remove(...clasesActivo);
            boton100.classList.add(...clasesInactivo);

            filtrarJuegos('any');
        });

        botonGlitchless.addEventListener("click", () => {
            
            botonGlitchless.classList.remove(...clasesInactivo);
            botonGlitchless.classList.add(...clasesActivo);

            
            botonAny.classList.remove(...clasesActivo);
            botonAny.classList.add(...clasesInactivo);
            
            boton100.classList.remove(...clasesActivo);
            boton100.classList.add(...clasesInactivo);

            filtrarJuegos('glitchless');
        });

        boton100.addEventListener("click", () => {
            
            boton100.classList.remove(...clasesInactivo);
            boton100.classList.add(...clasesActivo);

            
            botonAny.classList.remove(...clasesActivo);
            botonAny.classList.add(...clasesInactivo);
            
            botonGlitchless.classList.remove(...clasesActivo);
            botonGlitchless.classList.add(...clasesInactivo);

            filtrarJuegos('100');
        });


        //FILTRO DE LOS JUEGOS (opcional), se tiene que acabar
        const articlesJuegos = document.querySelectorAll('article');

        function filtrarJuegos(categoria) {

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

        

