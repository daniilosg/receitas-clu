(() => {
  'use strict';

  const config = window.CozinhaComLuConfig || {};

  // Aplica os controles comerciais definidos em /config.js.
  const setVisibility = (selector, visible) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.hidden = !visible;
    });
  };

  setVisibility('.bonus-bridge, .bonuses', config.mostrarBonus !== false);
  setVisibility('.alerta-up, .plano-recomendado-wrap', config.mostrarPlanoCompleto !== false);

  const renderPrice = (element, value) => {
    if (!element || typeof value !== 'string' || !value.trim()) return;
    const price = value.trim();
    const commaIndex = price.lastIndexOf(',');
    if (commaIndex > -1) {
      const whole = price.slice(0, commaIndex);
      const cents = price.slice(commaIndex);
      element.innerHTML = `${whole}<sub>${cents}</sub>`;
    } else {
      element.textContent = price;
    }
  };

  // Precos e links de pagamento tambem sao lidos de /config.js.
  ['basico', 'completo'].forEach((planName) => {
    const plan = config.planos?.[planName];
    if (!plan) return;

    const currentPrice = document.querySelector(`[data-preco="${planName}"]`);
    renderPrice(currentPrice, plan.preco);

    const oldPrice = document.querySelector(`[data-preco-antes="${planName}"]`);
    if (oldPrice && plan.precoAntes) oldPrice.textContent = `Antes: ${plan.precoAntes}`;

    const checkout = document.querySelector(`a[data-plano="${planName}"]`);
    if (checkout && plan.linkPagamento) checkout.href = plan.linkPagamento;
  });

  // Oferta dinamica: sempre ate amanha no calendario de Lisboa (Europe/Lisbon).
  const urgency = document.getElementById('urgencia-txt');
  if (urgency) {
    try {
      const lisbonParts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Lisbon',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).formatToParts(new Date()).reduce((acc, part) => {
        if (part.type !== 'literal') acc[part.type] = part.value;
        return acc;
      }, {});

      const lisbonCalendarDate = new Date(Date.UTC(
        Number(lisbonParts.year),
        Number(lisbonParts.month) - 1,
        Number(lisbonParts.day) + 1
      ));
      const day = String(lisbonCalendarDate.getUTCDate()).padStart(2, '0');
      const month = String(lisbonCalendarDate.getUTCMonth() + 1).padStart(2, '0');
      const year = lisbonCalendarDate.getUTCFullYear();
      urgency.textContent = `Oferta especial disponível apenas até ${day}/${month}/${year}`;
    } catch (_) {
      // Fallback apenas para navegadores sem suporte a timeZone no Intl.
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const day = String(tomorrow.getDate()).padStart(2, '0');
      const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
      urgency.textContent = `Oferta especial disponível apenas até ${day}/${month}/${tomorrow.getFullYear()}`;
    }
  }

  // Barra de progresso de leitura.
  const progress = document.getElementById('progressBar');
  if (progress) {
    let ticking = false;
    const updateProgress = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const percent = total > 0 ? Math.min((window.scrollY / total) * 100, 100) : 0;
      progress.style.width = `${percent}%`;
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
    updateProgress();
  }

  // FAQ: mantem somente um item aberto por vez.
  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const wasOpen = item?.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach((el) => el.classList.remove('open'));
      if (item && !wasOpen) item.classList.add('open');
    });
  });

  // Animacoes de entrada, equivalentes as da referencia.
  const initReveal = () => {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.anim-fade-up,.anim-scale,.anim-left,.anim-right,.anim-zoom').forEach((el) => el.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.ideal-card-wrap').forEach((el, i) => {
      el.classList.add('anim-fade-up');
      if (i > 0) el.classList.add(`delay-${Math.min(i, 7)}`);
      io.observe(el);
    });
    document.querySelectorAll('.bonus-card').forEach((el, i) => {
      el.classList.add('anim-scale', `delay-${Math.min((i % 3) + 1, 7)}`);
      io.observe(el);
    });
    document.querySelectorAll('.dor-box, .produto-inner, .bonus-bridge').forEach((el) => {
      el.classList.add('anim-left'); io.observe(el);
    });
    document.querySelectorAll('.depo-carousel-wrapper, .depoimentos h2').forEach((el) => {
      el.classList.add('anim-right'); io.observe(el);
    });
    document.querySelectorAll('.garantia-card, .autoridade-inner').forEach((el) => {
      el.classList.add('anim-zoom'); io.observe(el);
    });
    document.querySelectorAll('.checklist').forEach((list) => {
      const checkIo = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            checkIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      checkIo.observe(list);
    });
    document.querySelectorAll('.faq-item').forEach((el, i) => {
      el.classList.add('anim-fade-up', `delay-${Math.min(i + 1, 7)}`);
      io.observe(el);
    });
  };

  if ('requestIdleCallback' in window) requestIdleCallback(initReveal, { timeout: 800 });
  else setTimeout(initReveal, 200);

  // Carrossel continuo da prova social.
  const track = document.getElementById('provaTrack');
  if (track && !track.dataset.cloned) {
    const items = Array.from(track.children);
    items.forEach((item) => track.appendChild(item.cloneNode(true)));
    track.dataset.cloned = 'true';
    const updateDistance = () => {
      const firstClone = track.children[items.length];
      if (firstClone) track.style.setProperty('--prova-scroll-dist', `${firstClone.offsetLeft}px`);
    };
    updateDistance();
    setTimeout(updateDistance, 300);
    setTimeout(updateDistance, 1000);
    window.addEventListener('resize', updateDistance, { passive: true });
  }

  // Rolagem suave dos CTAs internos.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 8;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // Repassa parametros de campanha/UTM aos checkouts Hotmart sem alterar os links base.
  const campaignParams = new URLSearchParams(window.location.search);
  document.querySelectorAll('a[data-checkout="hotmart"]').forEach((link) => {
    try {
      const checkout = new URL(link.href);
      campaignParams.forEach((value, key) => {
        if (!checkout.searchParams.has(key)) checkout.searchParams.set(key, value);
      });
      link.href = checkout.toString();
    } catch (_) {}
  });

  // Vimeo API carregada apos o load, como na pagina de referencia.
  window.addEventListener('load', () => {
    const script = document.createElement('script');
    script.src = 'https://player.vimeo.com/api/player.js';
    script.async = true;
    document.head.appendChild(script);
  }, { once: true });
})();
