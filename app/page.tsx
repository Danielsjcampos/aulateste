"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import HeroSection from "../components/ui/hero-section";
import Navbar from "../components/ui/navbar";
import {
  Calendar,
  Phone,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
  Zap,
  Sparkles,
  Scissors,
  Droplet,
  CheckSquare,
  Smile,
  HelpCircle,
  Award,
  Activity,
  Heart,
  Check,
  Star,
  Users,
  Clock,
  MapPin,
  Lock,
  AlertTriangle,
  Layers,
  Leaf,
  HeartPulse,
  ScanLine,
} from "lucide-react";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// ─── Animation Variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// ─── Viewport config shared ──────────────────────────────────────────────────
const VP = { once: true, margin: "-80px" };

export default function Home() {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isScrolled, setIsScrolled]       = useState(false);

  // Parallax refs
  const aboutRef   = useRef<HTMLElement>(null);
  const ctaRef     = useRef<HTMLElement>(null);
  const { scrollYProgress: aboutScroll } = useScroll({ target: aboutRef, offset: ["start end", "end start"] });
  const aboutY = useTransform(aboutScroll, [0, 1], ["-6%", "6%"]);

  const openWhatsApp = (message: string) => {
    const url = `https://wa.me/5512988432041?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 80);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPercent(docH > 0 ? (scrollTop / docH) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Scroll Progress */}
      <div className="scroll-progress" style={{ width: `${scrollPercent}%` }} />

      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <HeroSection />

      <main>

        {/* ── 1. PROBLEMA ───────────────────────────────────────────── */}
        <section id="problema" className="section problem-section" aria-label="Sintomas comuns">
          <div className="container">

            <motion.div
              className="section-header"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
            >
              <span className="section-tag">Identificação</span>
              <h2>Você sente alguma <span className="italic-serif">dessas dores?</span></h2>
              <p className="section-subtitle">
                Problemas nos pés não se resolvem sozinhos. Tentar tratamentos caseiros pode agravar a situação e transformar desconforto em lesão séria.
              </p>
            </motion.div>

            <motion.div
              className="problem-grid"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
            >
              <motion.div variants={fadeUp} className="problem-card">
                <div className="card-icon-wrapper">
                  <Scissors className="w-5 h-5" />
                </div>
                <h3>Unha Encravada Recorrente</h3>
                <p>Aquele incômodo que parece melhorar por alguns dias, mas volta a doer ao calçar qualquer sapato.</p>
              </motion.div>

              <motion.div variants={fadeUp} className="problem-card highlight-card">
                <div className="card-icon-wrapper danger-bg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3>Unha Infeccionada com Dor</h3>
                <p>Pulsando, vermelha, inchada e extremamente sensível ao menor toque. Exige cuidado clínico imediato.</p>
              </motion.div>

              <motion.div variants={fadeUp} className="problem-card">
                <div className="card-icon-wrapper">
                  <Leaf className="w-5 h-5" />
                </div>
                <h3>Micose de Unha Persistente</h3>
                <p>Unhas amareladas, grossas ou quebradiças que não melhoram com remédios orais ou esmaltes comuns.</p>
              </motion.div>

              <motion.div variants={fadeUp} className="problem-card">
                <div className="card-icon-wrapper">
                  <Layers className="w-5 h-5" />
                </div>
                <h3>Calos e Calosidades</h3>
                <p>Camadas de pele grossa e dura que causam queimação ao caminhar, muitas vezes tratadas de forma incorreta em casa.</p>
              </motion.div>

              <motion.div variants={fadeUp} className="problem-card">
                <div className="card-icon-wrapper">
                  <ScanLine className="w-5 h-5" />
                </div>
                <h3>Fissuras e Rachaduras</h3>
                <p>Calcanhares extremamente secos com rachaduras profundas que chegam a sangrar e abrir portas para infecções.</p>
              </motion.div>

              <motion.div variants={fadeUp} className="problem-card">
                <div className="card-icon-wrapper warning-bg">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <h3>Pés Diabéticos e Idosos</h3>
                <p>Pés com sensibilidade reduzida que exigem corte técnico preventivo e higiene rigorosa para evitar feridas sérias.</p>
              </motion.div>
            </motion.div>

            <motion.div
              className="problem-footer text-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
            >
              <p className="copy-highlight">Se você se identifica com algum desses sintomas, você está no lugar certo.</p>
              <a href="#servicos" className="btn btn-secondary inline-flex" style={{ marginTop: "1rem" }}>
                Veja como podemos ajudar <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>

          </div>
        </section>

        {/* ── 2. SERVIÇOS ───────────────────────────────────────────── */}
        <section id="servicos" className="section services-section bg-light" aria-label="Tratamentos">
          <div className="container">

            <motion.div
              className="section-header"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
            >
              <span className="section-tag">Tratamentos</span>
              <h2>Cuidado clínico focado na sua <span className="italic-serif">recuperação rápida</span></h2>
              <p className="section-subtitle">
                Protocolos seguros e sem dor desnecessária. Tecnologia de ponta aliada a quase 20 anos de experiência clínica.
              </p>
            </motion.div>

            <motion.div
              className="services-grid"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
            >
              {/* Destaque: Unhas Infeccionadas */}
              <motion.div
                variants={fadeUp}
                className="service-card featured"
                onClick={() => openWhatsApp('Olá Suellen! Gostaria de informações sobre o tratamento de "Unhas Infeccionadas" e agendar uma consulta.')}
              >
                <div className="featured-badge">Especialidade da Casa</div>
                <div className="service-header">
                  <div className="service-icon">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h3>Tratamento de Unhas Infeccionadas</h3>
                </div>
                <p>Protocolo clínico seguro com alívio imediato da dor desde a primeira sessão. Drenagem, desinflamação e recuperação sem trauma — minha maior especialidade.</p>
              </motion.div>

              {/* Laserterapia */}
              <motion.div
                variants={fadeUp}
                className="service-card featured-laser cursor-pointer"
                onClick={() => openWhatsApp('Olá Suellen! Tenho interesse na Laserterapia. Como funciona o agendamento?')}
              >
                <div className="featured-badge-laser">Tecnologia Avançada</div>
                <div className="service-image-container">
                  <img src="/assets/image/clinica 1.jpeg" alt="Laserterapia podológica" className="service-img" loading="lazy" />
                </div>
                <div className="service-header">
                  <div className="service-icon laser-icon">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3>Laserterapia Clínica</h3>
                </div>
                <p>Laser de última geração que acelera cicatrização, reduz inflamação e elimina fungos de dentro para fora, sem efeitos colaterais.</p>
              </motion.div>

              {/* Encravadas */}
              <motion.div
                variants={fadeUp}
                className="service-card"
                onClick={() => openWhatsApp('Olá Suellen! Gostaria de informações sobre Unhas Encravadas.')}
              >
                <div className="service-header">
                  <div className="service-icon"><Sparkles className="w-6 h-6" /></div>
                  <h3>Unhas Encravadas</h3>
                </div>
                <p>Espículaectomia e órteses corretivas para resolução definitiva do encravamento e crescimento saudável da unha.</p>
              </motion.div>

              {/* Calos */}
              <motion.div
                variants={fadeUp}
                className="service-card"
                onClick={() => openWhatsApp('Olá Suellen! Gostaria de informações sobre Calos e Calosidades.')}
              >
                <div className="service-header">
                  <div className="service-icon"><Scissors className="w-6 h-6" /></div>
                  <h3>Calos e Calosidades</h3>
                </div>
                <p>Remoção profissional e indolor da hiperceratose e núcleos de calos, devolvendo conforto ao caminhar com resultados duradouros.</p>
              </motion.div>

              {/* Fissuras */}
              <motion.div
                variants={fadeUp}
                className="service-card"
                onClick={() => openWhatsApp('Olá Suellen! Gostaria de informações sobre Fissuras e Hidratação Profunda.')}
              >
                <div className="service-header">
                  <div className="service-icon"><Droplet className="w-6 h-6" /></div>
                  <h3>Fissuras e Hidratação Profunda</h3>
                </div>
                <p>Desbastamento profissional de rachaduras no calcanhar seguido de hidratação oclusiva de alta performance.</p>
              </motion.div>

              {/* Preventiva */}
              <motion.div
                variants={fadeUp}
                className="service-card"
                onClick={() => openWhatsApp('Olá Suellen! Gostaria de informações sobre Podologia Preventiva.')}
              >
                <div className="service-header">
                  <div className="service-icon"><CheckSquare className="w-6 h-6" /></div>
                  <h3>Podologia Preventiva</h3>
                </div>
                <p>Corte técnico correto, limpeza dos sulcos e lixamento higiênico regular para evitar patologias e garantir bem-estar constante.</p>
              </motion.div>

              {/* Spa */}
              <motion.div
                variants={fadeUp}
                className="service-card"
                onClick={() => openWhatsApp('Olá Suellen! Gostaria de informações sobre o Spa dos Pés Clínico.')}
              >
                <div className="service-header">
                  <div className="service-icon"><Smile className="w-6 h-6" /></div>
                  <h3>Spa dos Pés Clínico</h3>
                </div>
                <p>Higienização profunda, esfoliação suave, hidratação aquecida e massagem relaxante nos pontos de tensão dos pés.</p>
              </motion.div>
            </motion.div>

            <motion.div
              className="services-cta"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
            >
              <p>Dúvidas sobre qual tratamento é o ideal para o seu caso?</p>
              <button
                onClick={() => openWhatsApp("Olá Suellen! Tenho uma dúvida e gostaria de conversar sobre o melhor tratamento para mim.")}
                className="btn btn-outline-dark"
              >
                <HelpCircle className="w-4 h-4" /> Conversar com a Especialista
              </button>
            </motion.div>

          </div>
        </section>

        {/* ── 3. DIFERENCIAIS ───────────────────────────────────────── */}
        <section id="diferenciais" className="section benefits-section" aria-label="Diferenciais">
          <div className="container">

            <motion.div
              className="section-header"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
            >
              <span className="section-tag">Diferenciais</span>
              <h2>Por que pacientes que tentaram de tudo procuram a <span className="italic-serif">Suellen?</span></h2>
              <p className="section-subtitle">
                Quando se trata da saúde dos seus pés, experiência clínica e tecnologia certa fazem toda a diferença entre alívio temporário e cura definitiva.
              </p>
            </motion.div>

            <motion.div
              className="benefits-grid"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
            >
              <motion.div variants={fadeUp} className="benefit-item">
                <span className="benefit-number">01</span>
                <div className="benefit-icon-box">
                  <Award className="w-7 h-7" />
                </div>
                <h3>Quase 20 anos de experiência</h3>
                <p>Atuando ativamente desde 2006. Milhares de casos clínicos resolvidos com sucesso garantem segurança no diagnóstico e suavidade na execução.</p>
              </motion.div>

              <motion.div variants={fadeUp} className="benefit-item">
                <span className="benefit-number">02</span>
                <div className="benefit-icon-box">
                  <Activity className="w-7 h-7" />
                </div>
                <h3>Tecnologia a Laser Avançada</h3>
                <p>O laser age direto na raiz do problema — combate fungos e acelera cicatrizações sem necessidade de medicamentos agressivos ao fígado.</p>
              </motion.div>

              <motion.div variants={fadeUp} className="benefit-item">
                <span className="benefit-number">03</span>
                <div className="benefit-icon-box">
                  <Heart className="w-7 h-7" />
                </div>
                <h3>Atendimento que respeita você</h3>
                <p>Ambiente higienizado, sem julgamentos e sem pressa. Avaliação minuciosa e plano de tratamento personalizado para o seu ritmo e nível de dor.</p>
              </motion.div>
            </motion.div>

          </div>
        </section>

        {/* ── 4. SOBRE ──────────────────────────────────────────────── */}
        <section
          id="sobre"
          className="section about-section bg-light"
          aria-label="Sobre a profissional"
          ref={aboutRef}
        >
          <div className="container">
            <div className="about-grid">

              <motion.div
                className="about-image-wrapper"
                variants={fadeLeft}
                initial="hidden"
                whileInView="visible"
                viewport={VP}
              >
                <div className="about-img-blob" />
                <motion.img
                  src="/assets/image/suellen1.jpeg"
                  alt="Dra. Suellen A. de Mello, Podóloga"
                  className="about-img"
                  style={{ y: aboutY }}
                />
                <div className="about-badge">
                  <span className="badge-num">2006</span>
                  <span className="badge-lbl">Cuidando de Pés</span>
                </div>
              </motion.div>

              <motion.div
                className="about-content"
                variants={fadeRight}
                initial="hidden"
                whileInView="visible"
                viewport={VP}
              >
                <span className="section-tag">A Profissional</span>
                <h2>Conheça quem vai cuidar da <span className="italic-serif">saúde dos seus pés</span></h2>
                <p className="about-lead">
                  Olá, sou a Suellen A. de Mello. Minha missão é devolver a liberdade de caminhar sem dor e o orgulho de exibir pés saudáveis.
                </p>
                <p>
                  Com formação técnica e especialização clínica profunda, atuo na área de podologia desde 2006 em São José dos Campos. Ao longo dessas quase duas décadas, me especializei em <strong>unhas infeccionadas</strong> e na aplicação de <strong>laserterapia clínica</strong>.
                </p>
                <p>
                  Meu compromisso vai muito além da estética: é clínico. Entendo que uma unha encravada ou uma infecção gera limitações severas na rotina. Por isso, meu atendimento une precisão técnica avançada a um cuidado profundamente humanizado e acolhedor.
                </p>

                <div className="about-credentials">
                  <div className="credential-item">
                    <Check className="w-5 h-5" />
                    <span>Formação em Podologia Clínica Avançada</span>
                  </div>
                  <div className="credential-item">
                    <Check className="w-5 h-5" />
                    <span>Habilitação em Laserterapia Fotodinâmica</span>
                  </div>
                  <div className="credential-item">
                    <Check className="w-5 h-5" />
                    <span>Especialização em Órteses e Pés Diabéticos</span>
                  </div>
                </div>

                <div className="about-signature">
                  <span className="signature-name">Suellen A. de Mello</span>
                  <span className="signature-title">Podóloga Clínica Especialista · Desde 2006</span>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── 5. CLÍNICA ────────────────────────────────────────────── */}
        <section id="clinica" className="section clinic-gallery-section" aria-label="Nosso espaço">
          <div className="container">

            <motion.div
              className="section-header text-center"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
            >
              <span className="section-tag">O Consultório</span>
              <h2>Um ambiente moderno, <span className="italic-serif">seguro e acolhedor</span></h2>
              <p className="section-subtitle">
                Projetado para o máximo conforto, seguindo rigorosos padrões de esterilização e biossegurança.
              </p>
            </motion.div>

            <motion.div
              className="clinic-gallery-grid"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
            >
              <motion.div variants={fadeLeft} className="clinic-gallery-card">
                <div className="clinic-img-wrapper">
                  <img
                    src="/assets/image/clinica 1.jpeg"
                    alt="Consultório Suellen Mello — Tecnologia e Conforto"
                    className="clinic-gallery-img"
                    loading="lazy"
                  />
                  <div className="clinic-card-overlay">
                    <span className="clinic-card-title">Tecnologia e Conforto</span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeRight} className="clinic-gallery-card">
                <div className="clinic-img-wrapper">
                  <img
                    src="/assets/image/clinica2.jpeg"
                    alt="Consultório Suellen Mello — Biossegurança"
                    className="clinic-gallery-img"
                    loading="lazy"
                  />
                  <div className="clinic-card-overlay">
                    <span className="clinic-card-title">Biossegurança e Higiene</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </section>

        {/* ── 6. DEPOIMENTOS ────────────────────────────────────────── */}
        <section id="depoimentos" className="section testimonials-section" aria-label="Depoimentos de pacientes">
          <div className="container">

            <motion.div
              className="section-header"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
            >
              <span className="section-tag">Depoimentos</span>
              <h2>O que dizem os nossos <span className="italic-serif">pacientes</span></h2>
              <p className="section-subtitle">
                A satisfação dos nossos pacientes é o nosso maior selo de qualidade.
              </p>
            </motion.div>

            {/* Google Rating */}
            <motion.div
              className="google-rating-summary"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
            >
              <div className="google-logo">
                <svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <span>Google Avaliações</span>
              </div>
              <div className="rating-stars">
                <span className="rating-number">5.0</span>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent-500 text-accent-500" />
                  ))}
                </div>
                <span className="reviews-count">(142 avaliações no Google Maps)</span>
              </div>
            </motion.div>

            <motion.div
              className="testimonials-grid"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
            >
              <motion.div variants={fadeUp} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="patient-info">
                    <span className="patient-name">Carlos Henrique S.</span>
                    <span className="patient-city">São José dos Campos</span>
                  </div>
                  <div className="patient-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-accent-500 text-accent-500" />
                    ))}
                  </div>
                </div>
                <p className="testimonial-text">
                  "Eu sofria com uma unha encravada e inflamada há meses. A Suellen foi espetacular! Usou uma técnica super delicada, explicou tudo e o laser ajudou a cicatrizar muito rápido. Hoje ando sem dor nenhuma. Recomendo de olhos fechados!"
                </p>
                <div className="testimonial-date">Avaliado em Abril de 2026</div>
              </motion.div>

              <motion.div variants={fadeUp} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="patient-info">
                    <span className="patient-name">Mariana Costa L.</span>
                    <span className="patient-city">Jardim Aquarius</span>
                  </div>
                  <div className="patient-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-accent-500 text-accent-500" />
                    ))}
                  </div>
                </div>
                <p className="testimonial-text">
                  "Tratei uma micose de unha que persistia há mais de um ano. O tratamento com laser que a Suellen fez resolveu de verdade. O consultório é extremamente limpo e ela é de uma simpatia e profissionalismo incríveis."
                </p>
                <div className="testimonial-date">Avaliado em Março de 2026</div>
              </motion.div>

              <motion.div variants={fadeUp} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="patient-info">
                    <span className="patient-name">Dona Dirce de Oliveira</span>
                    <span className="patient-city">Vila Ema</span>
                  </div>
                  <div className="patient-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-accent-500 text-accent-500" />
                    ))}
                  </div>
                </div>
                <p className="testimonial-text">
                  "Como sou diabética, tenho muito medo de machucados nos pés. Faço a podologia preventiva mensal com a Suellen há mais de 3 anos. O carinho, a paciência e a higiene impecável me dão total tranquilidade. Uma profissional de ouro."
                </p>
                <div className="testimonial-date">Avaliado em Fevereiro de 2026</div>
              </motion.div>
            </motion.div>

          </div>
        </section>

        {/* ── 7. CTA FINAL ──────────────────────────────────────────── */}
        <section
          id="agendamento"
          className="section cta-final-section"
          aria-label="Agendar avaliação"
          ref={ctaRef}
        >
          <div className="cta-final-overlay" />
          <motion.div
            className="container cta-final-container"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <span className="cta-tag">Chega de conviver com a dor</span>
            <h2>Diga adeus à dor e volte a caminhar <span className="italic-serif">com conforto</span></h2>
            <p className="cta-subtitle">
              Agende agora sua avaliação clínica. Atendemos com hora marcada em consultório com fácil acesso em São José dos Campos.
            </p>

            <div className="cta-buttons">
              <button
                onClick={() => openWhatsApp("Olá Suellen! Gostaria de marcar minha avaliação clínica agora mesmo.")}
                className="btn btn-accent btn-large"
              >
                <MessageSquare className="w-5 h-5" /> Agendar pelo WhatsApp
              </button>
              <button
                onClick={() => openWhatsApp("Olá Suellen! Gostaria de tirar uma dúvida sobre os tratamentos.")}
                className="btn btn-ghost-white btn-large"
              >
                <Phone className="w-5 h-5" /> (12) 98843-2041
              </button>
            </div>

            <div className="cta-features">
              <span className="feature"><Zap className="w-4 h-4" /> Resposta Rápida</span>
              <span className="feature"><Users className="w-4 h-4" /> Sem Filas e Esperas</span>
              <span className="feature"><CheckCircle className="w-4 h-4" /> Atendimento Personalizado</span>
            </div>
          </motion.div>
        </section>

      </main>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="main-footer">
        <div className="footer-grid">
          <div className="footer-col brand-col">
            <a href="#hero" className="logo-area light-logo">
              <span className="logo-text">Suellen Mello</span>
              <span className="logo-subtitle">Podologia Avançada</span>
            </a>
            <p className="footer-desc">
              Desde 2006 cuidando da saúde e reabilitação dos pés de milhares de pacientes em São José dos Campos, aliando experiência clínica sólida à tecnologia a laser.
            </p>
            <div className="social-links">
              <a href="https://instagram.com/suellenpodologa" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon className="w-4 h-4" /> @suellenpodologa
              </a>
            </div>
          </div>

          <div className="footer-col info-col">
            <h3>Atendimento</h3>
            <ul className="footer-info-list">
              <li>
                <Clock className="w-5 h-5" />
                <div>
                  <strong>Horário de Funcionamento</strong>
                  <p>Segunda a Sexta: 08h30 às 18h30<br />Sábado: 08h30 às 13h00</p>
                </div>
              </li>
              <li>
                <MapPin className="w-5 h-5" />
                <div>
                  <strong>Nosso Endereço</strong>
                  <p>Rua das Pêonias, 193 — Sala 2<br />Jardim Motorama<br />São José dos Campos — SP</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="footer-col contact-col">
            <h3>Contato & Agendamentos</h3>
            <p className="contact-instructions">Fale diretamente pelo WhatsApp para tirar dúvidas ou reservar seu horário.</p>
            <button
              onClick={() => openWhatsApp("Olá Suellen! Vi o seu site e gostaria de agendar uma avaliação.")}
              className="btn btn-accent w-full"
            >
              <MessageSquare className="w-5 h-5" /> (12) 98843-2041
            </button>
            <p className="footer-security-note">
              <Lock className="w-3.5 h-3.5" /> Ambiente clínico esterilizado em autoclave.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-flex container">
            <p>&copy; 2026 Suellen A. de Mello — Podologia Avançada. Todos os direitos reservados.</p>
            <p className="dev-credits">
              Desenvolvido com <Heart className="w-3 h-3 fill-danger text-danger" /> para Suellen Mello
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <button
        onClick={() => openWhatsApp("Olá Suellen! Gostaria de tirar uma dúvida e agendar uma avaliação.")}
        className={`whatsapp-floating ${isScrolled ? "visible" : ""}`}
        aria-label="Fale conosco no WhatsApp"
      >
        <div className="whatsapp-floating-pulse" />
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.739-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.428 2.016 13.99 1.01 11.999 1.01c-5.442 0-9.866 4.372-9.87 9.802 0 1.706.467 3.324 1.353 4.72l-.406 1.482.433-.114.88-.242.201-.055zm12.504-7.411c-.267-.134-1.587-.783-1.833-.873-.246-.089-.426-.134-.606.134-.18.267-.696.873-.853 1.05-.157.179-.314.201-.581.067-.267-.134-1.13-.416-2.152-1.328-.795-.71-1.332-1.588-1.489-1.855-.157-.267-.017-.411.116-.544.12-.12.267-.313.401-.469.134-.156.179-.268.268-.446.089-.178.045-.335-.022-.469-.067-.134-.606-1.459-.83-1.993-.218-.526-.459-.453-.606-.46-.14-.007-.303-.008-.466-.008-.163 0-.427.061-.65.304-.224.242-.854.834-.854 2.033 0 1.2.873 2.358.995 2.522.12.164 1.718 2.624 4.161 3.68 1.134.489 2.02.788 2.709.998.777.247 1.485.212 2.043.129.622-.093 1.587-.648 1.811-1.272.224-.624.224-1.16.157-1.272-.068-.112-.247-.179-.514-.313z" />
        </svg>
      </button>
    </>
  );
}
