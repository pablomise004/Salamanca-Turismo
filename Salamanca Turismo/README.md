
  # Descubre Salamanca (versión estática HTML/CSS/JS)

  Este proyecto ha sido convertido para no usar React ni TypeScript. Ahora es un sitio estático hecho con HTML, CSS y JavaScript puro, preservando la interfaz y la funcionalidad original.

  Páginas incluidas:
  - index.html (Inicio con slider, secciones destacadas y CTA)
  - blog.html
  - restaurantes.html
  - museos.html
  - curiosidades.html
  - contacto.html (formulario con validación y toasts)
  - login.html (formulario con validación, mostrar/ocultar contraseña y toasts)
  - registro.html (formulario con validación, mostrar/ocultar contraseñas y toasts)

  El estilo reutiliza el CSS utilitario ya generado en `src/index.css`. Los iconos se renderizan con Lucide (desde CDN).

  ## Ejecutar en local

  1. Instala dependencias (solo un servidor estático opcional):

  ```powershell
  npm i
  ```

  2. Arranca un servidor estático (opcional). También puedes abrir los HTML directamente en el navegador:

  ```powershell
  npm run serve
  ```

  3. Abre en el navegador:
  - http://localhost:3000/index.html

  ## Estructura relevante

  - `index.html` y demás páginas en la raíz
  - `assets/js/main.js` Lógica común: menú móvil, slider, toasts y validaciones de formularios
  - `src/index.css` Utilidades CSS (precompilado tipo Tailwind)

  ## Notas

  - Ya no se usa React, Vite ni TypeScript.
  - Los enlaces de navegación van entre archivos HTML (multi-página) replicando el enrutado original.
  