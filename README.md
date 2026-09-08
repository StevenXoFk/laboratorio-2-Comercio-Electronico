
# Laboratorio-2 — Comercio Electrónico

Tienda de comercio electrónico (rubro: maquinaria pesada) construida con React + Vite, con búsqueda instantánea y filtros mediante Algolia / `react-instantsearch`.

## Decisiones de Diseño (UI)

Cuando integramos los componentes de búsqueda de Algolia (`react-instantsearch`), la decisión de fondo fue no dejarlos con su apariencia por defecto. De fábrica, esos componentes traen un estilo genérico que no tiene nada que ver con la identidad visual que ya habíamos definido en el Proyecto I, así que optamos por quitarles todo lo que no servía botones duplicados, íconos propios de la librería, colores neutros de Algolia y reconstruir su apariencia desde cero con nuestro propio CSS, uno por cada zona de la interfaz: uno para el header y la barra de búsqueda, otro para el panel de filtros, y otro para la paginación.

La barra de búsqueda, por ejemplo, terminó viviendo dentro de un header con el degradé amarillo de la marca y quedó fija en la parte superior de la pantalla; le agregamos un ícono de lupa propio y le quitamos los botones de "buscar" y "limpiar" que trae el componente original, porque en una búsqueda en tiempo real esos botones no cumplen ninguna función. En el panel de filtros hicimos algo parecido: el filtro de categorías y el de rango de precio se rediseñaron para que los checkboxes y los contadores de resultados se vieran como el resto de la tienda, y hasta agregamos las etiquetas "Mínimo" y "Máximo" en el filtro de precio porque el componente original no las trae y sin ellas no quedaba claro qué representaba cada campo. La paginación, que originalmente es una simple lista de números en texto plano, se convirtió en botones cuadrados con bordes redondeados para que combinara con el estilo de tarjetas del resto del catálogo.

Para que todo esto funcionara también en modo oscuro sin duplicar trabajo, separamos el color en dos roles distintos. Los colores neutros de la interfaz fondos, bordes, texto están definidos como variables que cambian automáticamente de valor según el tema activo, así que cuando el usuario activa el modo oscuro, la búsqueda, los filtros y la paginación cambian de aspecto junto con el resto de la página sin que hubiera que escribir lógica adicional en esos componentes. El amarillo de la marca, en cambio, lo dejamos fijo en ambos temas a propósito: lo usamos siempre como la señal de "esto está activo o seleccionado" al pasar el mouse sobre una opción, al elegir una categoría, en el botón de limpiar filtros, en la página actual de la paginación para que esa función se reconozca de inmediato sin importar si la tienda está en modo claro u oscuro.

## Experiencia de Usuario (UX)

La barra de búsqueda se puso en el header y se dejó fija arriba de la pantalla porque queríamos que estuviera disponible en todo momento, sin que el usuario tenga que interrumpir lo que está haciendo ni volver a subir con el scroll cada vez que quiera buscar otra cosa. Si la búsqueda solo apareciera al principio de la página y desapareciera al bajar, cada nueva búsqueda implicaría un paso extra innecesario.

Los filtros de categoría y precio se ubicaron en un panel a la izquierda porque es la disposición que cualquier usuario ya reconoce de otras tiendas en línea: filtros a un lado, resultados al otro. Usar un patrón conocido evita que el usuario tenga que aprender a usar la interfaz desde cero. Además, hicimos que ese panel se pueda colapsar, porque aunque los filtros deben estar siempre accesibles, no queríamos que le quitaran protagonismo a los productos, que son lo que realmente le interesa ver al usuario en un catálogo.

La paginación se dejó debajo de la cuadrícula de productos, al final del todo, porque es ahí donde naturalmente termina el recorrido visual del usuario: primero recorre todas las tarjetas de la página actual, y solo cuando llega al final tiene sentido preguntarle si quiere ver más productos o si ya encontró lo que buscaba y prefiere entrar al detalle de alguno. Poner la paginación arriba o flotando en otro lugar de la pantalla habría interrumpido ese orden natural de lectura.

## Manejo de Estados (Empty State)

Cuando una búsqueda o una combinación de filtros no arroja ningún resultado, el catálogo no se queda en blanco: en ese caso se reemplaza la cuadrícula de productos por un mensaje que le avisa al usuario que no se encontró nada con esa combinación. Ese mensaje no es siempre igual, sino que cambia según lo que el usuario haya hecho: si escribió algo en el buscador, el mensaje le repite exactamente lo que buscó, para que quede claro que sí se tomó en cuenta su búsqueda; si no escribió nada y el problema es solo que los filtros aplicados son demasiado restrictivos, en cambio le sugiere quitar algún filtro o ajustar el rango de precio.

Además, siempre que haya algún filtro o búsqueda activa que esté causando ese resultado vacío, aparece un botón para limpiar todo de un solo clic, en vez de obligar al usuario a ir uno por uno deshaciendo cada filtro que había aplicado. La idea detrás de esto es que un resultado vacío no debería ser un callejón sin salida: el usuario siempre tiene una acción clara para volver a ver productos.

## Enlaces

- **Repositorio:** https://github.com/StevenXoFk/laboratorio-2-Comercio-Electronico
- **Aplicación desplegada:** https://stevenxofk.github.io/laboratorio-2-Comercio-Electronico/

El deploy a GitHub Pages está automatizado con GitHub Actions: cada push a la rama principal compila el proyecto y lo publica directo, sin pasos manuales.