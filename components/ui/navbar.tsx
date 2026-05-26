"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Menu, X } from "lucide-react";

const links = [
  { label: "Serviços",      href: "#servicos"      },
  { label: "Diferenciais",  href: "#diferenciais"  },
  { label: "Sobre",         href: "#sobre"          },
  { label: "Clínica",       href: "#clinica"        },
  { label: "Depoimentos",   href: "#depoimentos"   },
];

const openWhatsApp = () => {
  const url = `https://wa.me/5512988432041?text=${encodeURIComponent("Olá, Dra. Suellen! Gostaria de agendar uma avaliação.")}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [activeHash,  setActiveHash]  = useState("");

  // Background on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track active section
  useEffect(() => {
    const sections = links.map(l => document.querySelector(l.href) as HTMLElement | null);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHash(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLinkClick = (href: string) => {
    setMenuOpen(false);
    setActiveHash(href);
  };

  return (
    <>
      <motion.header
        className={`navbar${scrolled ? " navbar--scrolled" : ""}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container navbar-inner">

          {/* Logo */}
          <a href="#" className="navbar-logo" aria-label="Suellen Mello Podologia — ir ao topo">
            <span className="navbar-logo-name">Suellen Mello</span>
            <span className="navbar-logo-sub">Podologia Avançada</span>
          </a>

          {/* Desktop nav */}
          <nav className="navbar-links" aria-label="Navegação principal">
            {links.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className={`navbar-link${activeHash === href ? " navbar-link--active" : ""}`}
                onClick={() => handleLinkClick(href)}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <button
            onClick={openWhatsApp}
            className="btn btn-primary navbar-cta"
            aria-label="Agendar via WhatsApp"
          >
            <MessageCircle size={16} />
            Agendar
          </button>

          {/* Mobile hamburger */}
          <button
            className="navbar-burger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="navbar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="navbar-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <nav aria-label="Menu móvel">
                {links.map(({ label, href }, i) => (
                  <motion.a
                    key={href}
                    href={href}
                    className={`navbar-drawer-link${activeHash === href ? " navbar-link--active" : ""}`}
                    onClick={() => handleLinkClick(href)}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 + 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {label}
                  </motion.a>
                ))}

                <motion.button
                  onClick={openWhatsApp}
                  className="btn btn-primary btn-large"
                  style={{ width: "100%", marginTop: "1.5rem", justifyContent: "center" }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <MessageCircle size={18} />
                  Agendar Avaliação
                </motion.button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
