"use client";

import { motion } from "framer-motion";
import { MessageCircle, ChevronDown, Star, Award, Clock } from "lucide-react";

const openWhatsApp = () => {
  const url = `https://wa.me/5512988432041?text=${encodeURIComponent("Olá, Dra. Suellen! Gostaria de agendar uma avaliação.")}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay },
  }),
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.2 },
  },
};

const stats = [
  { icon: Clock,  value: "+19",    label: "anos de experiência" },
  { icon: Star,   value: "5★",     label: "avaliações no Google" },
  { icon: Award,  value: "FAAP",   label: "formação especializada" },
];

export default function HeroSection() {
  return (
    <section
      className="hero-section"
      aria-label="Apresentação"
    >
      {/* Decorative background blobs */}
      <div className="hero-blob hero-blob-1" aria-hidden="true" />
      <div className="hero-blob hero-blob-2" aria-hidden="true" />

      <div className="container hero-container">

        {/* ── Left: copy ── */}
        <div className="hero-copy">

          <motion.span
            className="section-tag"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            Podologia Avançada · São José dos Campos
          </motion.span>

          <motion.h1
            className="hero-heading"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.12}
          >
            Seus pés merecem{" "}
            <span className="italic-serif hero-heading-accent">
              cuidado especializado
            </span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.22}
          >
            Dra. Suellen Mello trata unhas encravadas, infeccionadas e micoses com
            protocolos clínicos avançados — incluindo{" "}
            <strong>laserterapia</strong> — desde 2006.
          </motion.p>

          <motion.div
            className="hero-actions"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.34}
          >
            <button
              onClick={openWhatsApp}
              className="btn btn-primary btn-large"
              aria-label="Agendar avaliação via WhatsApp"
            >
              <MessageCircle size={20} />
              Agendar Avaliação
            </button>

            <a href="#servicos" className="btn btn-secondary btn-large">
              Ver tratamentos
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="hero-stats"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.46}
          >
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="hero-stat">
                <Icon size={15} className="hero-stat-icon" />
                <span className="hero-stat-value">{value}</span>
                <span className="hero-stat-label">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right: photo ── */}
        <motion.div
          className="hero-image-wrap"
          variants={fadeRight}
          initial="hidden"
          animate="visible"
        >
          {/* Floating badge */}
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hero-badge-dot" />
            <span>Atendimento disponível</span>
          </motion.div>

          <div className="hero-photo-frame">
            <img
              src="/assets/image/suellen1.jpeg"
              alt="Dra. Suellen Mello — Podóloga em São José dos Campos"
              className="hero-photo"
              width={540}
              height={680}
            />
            {/* Subtle overlay gradient at bottom */}
            <div className="hero-photo-overlay" aria-hidden="true" />
          </div>

          {/* Decorative accent ring */}
          <div className="hero-ring" aria-hidden="true" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#problema"
        className="hero-scroll-hint"
        aria-label="Rolar para o conteúdo"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown size={20} />
        </motion.span>
      </motion.a>
    </section>
  );
}
