/**
 * -------------------------------------------------------------
 * SUELEN MELLO - PODOLOGIA CLÍNICA
 * Interatividade, Animações e Conexão WhatsApp
 * -------------------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Elementos Principais
  const header = document.getElementById('main-header');
  const scrollSentinel = document.getElementById('scroll-sentinel');
  const whatsappFloating = document.getElementById('whatsapp-floating');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const menuIcon = document.getElementById('menu-icon');
  const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav a');

  // Nossos telefones e links dinâmicos do WhatsApp
  const phoneCountry = "55";
  const phoneDDD = "12";
  const phoneNumber = "997654321"; // CEP / Telefone comercial de São José dos Campos
  const baseWhatsAppURL = `https://wa.me/${phoneCountry}${phoneDDD}${phoneNumber}`;

  // ==========================================================================
  // 3. CABEÇALHO DINÂMICO (SHRINK HEADER) & BOTÃO FLUTUANTE
  // ==========================================================================
  // Usar IntersectionObserver no Sentinel de scroll para monitorar a posição
  if (window.IntersectionObserver) {
    const headerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          // Se o sentinela no topo saiu da tela, o usuário rolou para baixo
          header.classList.add('scrolled');
          whatsappFloating.classList.add('visible');
        } else {
          // Voltou ao topo
          header.classList.remove('scrolled');
          whatsappFloating.classList.remove('visible');
        }
      });
    }, {
      root: null,
      threshold: 0,
      rootMargin: '100px 0px 0px 0px' // Ativa quando passa 100px do topo
    });

    if (scrollSentinel) {
      headerObserver.observe(scrollSentinel);
    }
  } else {
    // Fallback para navegadores antigos que não suportam IntersectionObserver
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        header.classList.add('scrolled');
        whatsappFloating.classList.add('visible');
      } else {
        header.classList.remove('scrolled');
        whatsappFloating.classList.remove('visible');
      }
    });
  }

  // ==========================================================================
  // 4. MENU MOBILE DRAWER
  // ==========================================================================
  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNav.classList.contains('open');
      
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Fechar menu mobile se clicar fora dele
    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('open') && !mobileNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Fechar ao pressionar a tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileToggle.setAttribute('aria-label', 'Fechar menu de navegação');
    
    // Atualiza ícone para "close" (x)
    if (typeof lucide !== 'undefined') {
      menuIcon.setAttribute('data-lucide', 'x');
      lucide.createIcons({
        attrs: { id: 'menu-icon' },
        nameAttr: 'data-lucide'
      });
    }
  }

  function closeMobileMenu() {
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-label', 'Abrir menu de navegação');
    
    // Atualiza ícone para "menu"
    if (typeof lucide !== 'undefined') {
      menuIcon.setAttribute('data-lucide', 'menu');
      lucide.createIcons({
        attrs: { id: 'menu-icon' },
        nameAttr: 'data-lucide'
      });
    }
  }

  // Fechar menu ao clicar em qualquer link interna (scroll suave)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // ==========================================================================
  // 5. ANIMAÇÕES DE REVELAÇÃO (SCROLL REVEAL EFFECT)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  if (window.IntersectionObserver) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Desobservar após animar pela primeira vez para performance
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1, // Elemento precisa ter 10% visível para revelar
      rootMargin: '0px 0px -50px 0px' // Margem inferior sutil para melhor sincronia visual
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback: Revela imediatamente para navegadores antigos
    revealElements.forEach(element => {
      element.classList.add('revealed');
    });
  }

  // ==========================================================================
  // 6. LINKS DINÂMICOS DE WHATSAPP CUSTOMIZADOS POR SERVIÇO/AÇÃO
  // ==========================================================================
  // Personalizar mensagens ao clicar em botões específicos para guiar o paciente
  
  const setupWhatsAppLink = (elementId, messageText) => {
    const element = document.getElementById(elementId);
    if (element) {
      const encodedMsg = encodeURIComponent(messageText);
      element.setAttribute('href', `${baseWhatsAppURL}?text=${encodedMsg}`);
    }
  };

  // Mensagens contextuais para maior taxa de conversão
  setupWhatsAppLink('header-cta-btn', 'Olá Suellen! Vi o seu site e gostaria de agendar uma avaliação de podologia clínica.');
  setupWhatsAppLink('hero-cta-btn', 'Olá Suellen! Estou com dor nos pés e preciso agendar uma avaliação urgente.');
  setupWhatsAppLink('final-cta-btn', 'Olá Suellen! Chega de conviver com a dor nos pés, gostaria de marcar minha avaliação clínica agora mesmo.');
  setupWhatsAppLink('whatsapp-floating', 'Olá Suellen! Gostaria de tirar uma dúvida e agendar uma avaliação.');

  // Configura links dinâmicos para cards de serviços
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    const titleElement = card.querySelector('h3');
    if (titleElement) {
      const serviceName = titleElement.textContent.trim();
      
      // Se for o card com imagem (Laserterapia), tratamos de forma especial
      const ctaInCard = card.querySelector('.btn') || card; 
      
      ctaInCard.addEventListener('click', (e) => {
        // Se clicar em outro link dentro do card, não interfere
        if (e.target.tagName === 'A' && e.target !== ctaInCard) return;
        
        let message = `Olá Suellen! Gostaria de informações sobre o tratamento de "${serviceName}" e agendar uma consulta.`;
        if (serviceName.includes('Laser')) {
          message = 'Olá Suellen! Fiquei muito interessado na tecnologia de Laserterapia para os meus pés. Como funciona o agendamento?';
        }
        
        const targetURL = `${baseWhatsAppURL}?text=${encodeURIComponent(message)}`;
        window.open(targetURL, '_blank', 'noopener,noreferrer');
      });
      
      // Adicionar estilo pointer-events nos cards para incentivar clique
      card.style.cursor = 'pointer';
    }
  });

  // ==========================================================================
  // 7. DETECTAR REDUCED MOTION (ACESSIBILIDADE)
  // ==========================================================================
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motionQuery.matches) {
    revealElements.forEach(element => {
      element.classList.add('revealed');
    });
  }
});
