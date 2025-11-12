document.addEventListener('DOMContentLoaded', () => {
  // Replace lucide icons
  if (window.lucide && window.lucide.createIcons) {
    window.lucide.createIcons();
  }

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', !isHidden);
      mobileToggle.setAttribute('aria-label', isHidden ? 'Cerrar menú' : 'Abrir menú');
      mobileToggle.innerHTML = '';
      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', isHidden ? 'x' : 'menu');
      mobileToggle.appendChild(icon);
      if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
    });

    // Close mobile menu when navigating
    mobileMenu.querySelectorAll('a[data-nav]').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileToggle.innerHTML = '<i data-lucide="menu"></i>';
        if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
      });
    });
  }

  // Active nav highlight
  const markActiveNav = () => {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('a[data-nav]').forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      const isActive = (path === '' && href.endsWith('index.html')) || href.endsWith(path);
      a.classList.toggle('border-white', isActive);
      a.classList.toggle('border-transparent', !isActive);
    });
  };
  markActiveNav();

  // Simple toast utility
  const toastContainer = document.getElementById('toast-container');
  function showToast(type, title, description) {
    if (!toastContainer) return;
    const wrap = document.createElement('div');
    wrap.className = `min-w-[260px] max-w-[340px] mb-2 rounded-lg shadow-lg px-4 py-3 text-white ${type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-600' : 'bg-stone-800'}`;
    wrap.innerHTML = `<div class="font-medium">${title || ''}</div>${description ? `<div class="opacity-90 text-sm">${description}</div>` : ''}`;
    toastContainer.appendChild(wrap);
    setTimeout(() => {
      wrap.style.opacity = '0';
      wrap.style.transition = 'opacity .3s ease';
      setTimeout(() => wrap.remove(), 300);
    }, 2500);
  }
  window.$toast = { success: (t, d) => showToast('success', t, d), error: (t, d) => showToast('error', t, d) };

  // Hero slider (only on index)
  const slider = document.querySelector('[data-slider]');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.hero-slide'));
    const indicators = document.getElementById('slider-indicators');
    let current = 0;

    const renderIndicators = () => {
      if (!indicators) return;
      indicators.innerHTML = '';
      slides.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.className = 'indicator-btn' + (i === current ? ' active' : '');
        btn.setAttribute('aria-label', `Ir a la diapositiva ${i + 1}`);
        btn.addEventListener('click', () => {
          current = i;
          update();
        });
        indicators.appendChild(btn);
      });
    };

    const update = () => {
      slides.forEach((s, i) => s.classList.toggle('active', i === current));
      if (indicators) {
        indicators.querySelectorAll('.indicator-btn').forEach((b, i) => b.classList.toggle('active', i === current));
      }
    };

    renderIndicators();
    update();
    setInterval(() => {
      current = (current + 1) % slides.length;
      update();
    }, 5000);
  }

  // Page-specific logic
  const page = (document.body.getAttribute('data-page') || '').toLowerCase();

  // Login page
  if (page === 'login') {
    const form = document.querySelector('#login-form');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const remember = document.getElementById('rememberMe');
    const toggle = document.getElementById('togglePassword');

    const setError = (id, msg) => {
      const el = document.getElementById(id + '-error');
      if (el) el.textContent = msg || '';
    };

    if (toggle && password) {
      toggle.addEventListener('click', () => {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        toggle.setAttribute('aria-label', type === 'password' ? 'Mostrar contraseña' : 'Ocultar contraseña');
        toggle.innerHTML = `<i data-lucide="${type === 'password' ? 'eye' : 'eye-off'}"></i>`;
        if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
      });
    }

    form && form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      // Email
      const emailVal = (email && email.value || '').trim();
      if (!emailVal) { setError('email', 'El email es obligatorio'); ok = false; } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) { setError('email', 'El email no es válido'); ok = false; } else setError('email', '');
      // Password
      const passVal = (password && password.value || '');
      if (!passVal) { setError('password', 'La contraseña es obligatoria'); ok = false; } else if (passVal.length < 6) { setError('password', 'La contraseña debe tener al menos 6 caracteres'); ok = false; } else setError('password', '');

      if (ok) {
        window.$toast.success('¡Inicio de sesión exitoso!', `Bienvenido de vuelta, ${emailVal}`);
        // console.log({ email: emailVal, remember: remember && remember.checked, password: '***' })
      } else {
        window.$toast.error('Por favor, corrige los errores del formulario');
      }
    });
  }

  // Contact page
  if (page === 'contacto') {
    const form = document.getElementById('contact-form');
    const fields = ['nombre','apellidos','email','telefono','asunto','tipoConsulta','fechaVisita','numeroPersonas','mensaje','newsletter','privacidad'];

    const setError = (name, msg) => {
      const el = document.getElementById(name + '-error');
      if (el) el.textContent = msg || '';
    };

    const get = (id) => document.getElementById(id);

    const validate = () => {
      const values = Object.fromEntries(fields.map(f => [f, (get(f) && (get(f).type === 'checkbox' ? get(f).checked : get(f).value))]));
      const errors = {};
      if (!String(values.nombre||'').trim()) errors.nombre = 'El nombre es obligatorio';
      if (!String(values.apellidos||'').trim()) errors.apellidos = 'Los apellidos son obligatorios';
      const emailVal = String(values.email||'');
      if (!emailVal) errors.email = 'El email es obligatorio';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) errors.email = 'El email no es válido';
      const telVal = String(values.telefono||'').replace(/\s/g,'');
      if (telVal && !/^\d{9,15}$/.test(telVal)) errors.telefono = 'El teléfono debe contener entre 9 y 15 dígitos';
      if (!String(values.asunto||'').trim()) errors.asunto = 'El asunto es obligatorio';
      if (!String(values.tipoConsulta||'')) errors.tipoConsulta = 'Selecciona un tipo de consulta';
      const msg = String(values.mensaje||'').trim();
      if (!msg) errors.mensaje = 'El mensaje es obligatorio'; else if (msg.length < 10) errors.mensaje = 'El mensaje debe tener al menos 10 caracteres';
      if (!values.privacidad) errors.privacidad = 'Debes aceptar la política de privacidad';
      return { values, errors };
    };

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const { values, errors } = validate();
        Object.keys(errors).forEach(k => setError(k, errors[k]));
        // clear others
        fields.filter(k => !(k in errors)).forEach(k => setError(k, ''));
        if (Object.keys(errors).length === 0) {
          window.$toast.success('¡Mensaje enviado correctamente!', 'Te responderemos lo antes posible');
          if (form instanceof HTMLFormElement) form.reset();
        } else {
          window.$toast.error('Por favor, corrige los errores del formulario');
        }
      });

      // Clear error on input
      fields.forEach(name => {
        const el = get(name);
        if (!el) return;
        el.addEventListener('input', () => setError(name, ''));
        if (el.type === 'checkbox') el.addEventListener('change', () => setError(name, ''));
      });
    }
  }

  // Registro page
  if (page === 'registro') {
    const form = document.getElementById('registro-form');
    const get = (id) => document.getElementById(id);
    const setError = (name, msg) => {
      const el = document.getElementById(name + '-error');
      if (el) el.textContent = msg || '';
    };

    const validate = () => {
      const v = (id) => get(id);
      const values = {
        nombre: v('nombre')?.value?.trim() || '',
        apellidos: v('apellidos')?.value?.trim() || '',
        email: v('email')?.value || '',
        telefono: (v('telefono')?.value || '').replace(/\s/g,''),
        fechaNacimiento: v('fechaNacimiento')?.value || '',
        genero: v('genero')?.value || '',
        ciudad: v('ciudad')?.value || '',
        pais: v('pais')?.value || '',
        password: v('password')?.value || '',
        confirmPassword: v('confirmPassword')?.value || '',
        newsletter: v('newsletter')?.checked || false,
        terminos: v('terminos')?.checked || false,
      };
      const errors = {};
      if (!values.nombre) errors.nombre = 'El nombre es obligatorio';
      if (!values.apellidos) errors.apellidos = 'Los apellidos son obligatorios';
      if (!values.email) errors.email = 'El email es obligatorio';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'El email no es válido';
      if (values.telefono && !/^\d{9,15}$/.test(values.telefono)) errors.telefono = 'El teléfono debe contener entre 9 y 15 dígitos';
      if (!values.fechaNacimiento) errors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
      else {
        const birth = new Date(values.fechaNacimiento);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        if (age < 18) errors.fechaNacimiento = 'Debes ser mayor de 18 años';
      }
      if (!values.genero) errors.genero = 'Selecciona un género';
      if (!values.password) errors.password = 'La contraseña es obligatoria';
      else if (values.password.length < 8) errors.password = 'La contraseña debe tener al menos 8 caracteres';
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(values.password)) errors.password = 'Debe contener mayúsculas, minúsculas y números';
      if (!values.confirmPassword) errors.confirmPassword = 'Confirma tu contraseña';
      else if (values.password !== values.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden';
      if (!values.terminos) errors.terminos = 'Debes aceptar los términos y condiciones';
      return { values, errors };
    };

    if (form) {
      // Toggle password visibility
      const toggle1 = document.getElementById('togglePassword');
      const toggle2 = document.getElementById('toggleConfirmPassword');
      const pass1 = document.getElementById('password');
      const pass2 = document.getElementById('confirmPassword');
      const toggle = (btn, input) => {
        if (!btn || !input) return;
        btn.addEventListener('click', () => {
          const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
          input.setAttribute('type', type);
          btn.innerHTML = `<i data-lucide="${type === 'password' ? 'eye' : 'eye-off'}"></i>`;
          if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
        });
      };
      toggle(toggle1, pass1);
      toggle(toggle2, pass2);

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const { errors } = validate();
        Object.keys(errors).forEach(k => setError(k, errors[k]));
        ['nombre','apellidos','email','telefono','fechaNacimiento','genero','password','confirmPassword','terminos'].filter(k => !(k in errors)).forEach(k => setError(k, ''));
        if (Object.keys(errors).length === 0) {
          window.$toast.success('¡Registro exitoso!', 'Tu cuenta ha sido creada correctamente');
          if (form instanceof HTMLFormElement) form.reset();
        } else {
          window.$toast.error('Por favor, corrige los errores del formulario');
        }
      });

      // Clear error on input
      ['nombre','apellidos','email','telefono','fechaNacimiento','genero','ciudad','pais','password','confirmPassword','newsletter','terminos'].forEach(name => {
        const el = get(name);
        if (!el) return;
        el.addEventListener('input', () => setError(name, ''));
        if (el.type === 'checkbox' || el.tagName === 'SELECT') el.addEventListener('change', () => setError(name, ''));
      });
    }
  }
});
