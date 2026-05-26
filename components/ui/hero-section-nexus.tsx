"use client";

import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
    forwardRef,
    useImperativeHandle,
    useMemo,
    type ReactNode,
    type MouseEvent as ReactMouseEvent,
    type SVGProps,
} from 'react';
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValue,
    useSpring,
    useTransform,
    useMotionValueEvent,
    type Transition,
    type VariantLabels,
    type Target,
    type TargetAndTransition,
    type Variants,
} from 'framer-motion';
import { Clock, Star, Award, CheckCircle, HelpCircle, ArrowRight, ShieldAlert, Zap, Sparkles } from 'lucide-react';

function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface RotatingTextRef {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
}

interface RotatingTextProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof motion.span>,
    "children" | "transition" | "initial" | "animate" | "exit"
  > {
  texts: string[];
  transition?: Transition;
  initial?: boolean | Target | VariantLabels;
  animate?: boolean | VariantLabels | any | TargetAndTransition;
  exit?: Target | VariantLabels;
  animatePresenceMode?: "sync" | "wait";
  animatePresenceInitial?: boolean;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | "random" | number;
  loop?: boolean;
  auto?: boolean;
  splitBy?: "characters" | "words" | "lines" | string;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
}

const RotatingText = forwardRef<RotatingTextRef, RotatingTextProps>(
  (
    {
      texts,
      transition = { type: "spring", damping: 25, stiffness: 300 },
      initial = { y: "100%", opacity: 0 },
      animate = { y: 0, opacity: 1 },
      exit = { y: "-120%", opacity: 0 },
      animatePresenceMode = "wait",
      animatePresenceInitial = false,
      rotationInterval = 2200,
      staggerDuration = 0.01,
      staggerFrom = "last",
      loop = true,
      auto = true,
      splitBy = "characters",
      onNext,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
      ...rest
    },
    ref
  ) => {
    const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);

    const splitIntoCharacters = (text: string): string[] => {
      if (typeof Intl !== "undefined" && Intl.Segmenter) {
        try {
           const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
           return Array.from(segmenter.segment(text), (segment) => segment.segment);
        } catch (error) {
           console.error("Intl.Segmenter failed, falling back to simple split:", error);
           return text.split('');
        }
      }
      return text.split('');
    };

    const elements = useMemo(() => {
        const currentText: string = texts[currentTextIndex] ?? '';
        if (splitBy === "characters") {
            const words = currentText.split(/(\s+)/);
            let charCount = 0;
            return words.filter(part => part.length > 0).map((part) => {
                const isSpace = /^\s+$/.test(part);
                const chars = isSpace ? [part] : splitIntoCharacters(part);
                const startIndex = charCount;
                charCount += chars.length;
                return { characters: chars, isSpace: isSpace, startIndex: startIndex };
            });
        }
        if (splitBy === "words") {
            return currentText.split(/(\s+)/).filter(word => word.length > 0).map((word, i) => ({
                characters: [word], isSpace: /^\s+$/.test(word), startIndex: i
            }));
        }
        if (splitBy === "lines") {
            return currentText.split('\n').map((line, i) => ({
                characters: [line], isSpace: false, startIndex: i
            }));
        }
        return currentText.split(splitBy).map((part, i) => ({
            characters: [part], isSpace: false, startIndex: i
        }));
    }, [texts, currentTextIndex, splitBy]);

    const totalElements = useMemo(() => elements.reduce((sum, el) => sum + el.characters.length, 0), [elements]);

    const getStaggerDelay = useCallback(
      (index: number, total: number): number => {
        if (total <= 1 || !staggerDuration) return 0;
        const stagger = staggerDuration;
        switch (staggerFrom) {
          case "first": return index * stagger;
          case "last": return (total - 1 - index) * stagger;
          case "center":
            const center = (total - 1) / 2;
            return Math.abs(center - index) * stagger;
          case "random": return Math.random() * (total - 1) * stagger;
          default:
            if (typeof staggerFrom === 'number') {
              const fromIndex = Math.max(0, Math.min(staggerFrom, total - 1));
              return Math.abs(fromIndex - index) * stagger;
            }
            return index * stagger;
        }
      },
      [staggerFrom, staggerDuration]
    );

    const handleIndexChange = useCallback(
      (newIndex: number) => {
        setCurrentTextIndex(newIndex);
        onNext?.(newIndex);
      },
      [onNext]
    );

    const next = useCallback(() => {
      const nextIndex = currentTextIndex === texts.length - 1 ? (loop ? 0 : currentTextIndex) : currentTextIndex + 1;
      if (nextIndex !== currentTextIndex) handleIndexChange(nextIndex);
    }, [currentTextIndex, texts.length, loop, handleIndexChange]);

    const previous = useCallback(() => {
      const prevIndex = currentTextIndex === 0 ? (loop ? texts.length - 1 : currentTextIndex) : currentTextIndex - 1;
      if (prevIndex !== currentTextIndex) handleIndexChange(prevIndex);
    }, [currentTextIndex, texts.length, loop, handleIndexChange]);

    const jumpTo = useCallback(
      (index: number) => {
        const validIndex = Math.max(0, Math.min(index, texts.length - 1));
        if (validIndex !== currentTextIndex) handleIndexChange(validIndex);
      },
      [texts.length, currentTextIndex, handleIndexChange]
    );

     const reset = useCallback(() => {
        if (currentTextIndex !== 0) handleIndexChange(0);
     }, [currentTextIndex, handleIndexChange]);

    useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [next, previous, jumpTo, reset]);

    useEffect(() => {
      if (!auto || texts.length <= 1) return;
      const intervalId = setInterval(next, rotationInterval);
      return () => clearInterval(intervalId);
    }, [next, rotationInterval, auto, texts.length]);

    return (
      <motion.span
        className={cn("inline-flex flex-wrap whitespace-pre-wrap relative align-bottom pb-[6px]", mainClassName)}
        {...rest}
        layout
      >
        <span className="sr-only">{texts[currentTextIndex]}</span>
        <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
          <motion.div
            key={currentTextIndex}
            className={cn(
               "inline-flex flex-wrap relative",
               splitBy === "lines" ? "flex-col items-start w-full" : "flex-row items-baseline"
            )}
            layout
            aria-hidden="true"
            initial="initial"
            animate="animate"
            exit="exit"
          >
             {elements.map((elementObj, elementIndex) => (
                <span
                    key={elementIndex}
                    className={cn("inline-flex", splitBy === 'lines' ? 'w-full' : '', splitLevelClassName)}
                    style={{ whiteSpace: 'pre' }}
                >
                    {elementObj.characters.map((char, charIndex) => {
                        const globalIndex = elementObj.startIndex + charIndex;
                        return (
                            <motion.span
                                key={`${char}-${charIndex}`}
                                initial={initial}
                                animate={animate}
                                exit={exit}
                                transition={{
                                    ...transition,
                                    delay: getStaggerDelay(globalIndex, totalElements),
                                }}
                                className={cn("inline-block leading-none tracking-tight", elementLevelClassName)}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </motion.span>
                        );
                     })}
                </span>
             ))}
          </motion.div>
        </AnimatePresence>
      </motion.span>
    );
  }
);
RotatingText.displayName = "RotatingText";

const ShinyText: React.FC<{ text: string; className?: string }> = ({ text, className = "" }) => (
    <span className={cn("relative overflow-hidden inline-block", className)}>
        {text}
        <span style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
            animation: 'shine 2.5s infinite linear',
            opacity: 0.6,
            pointerEvents: 'none'
        }}></span>
        <style>{`
            @keyframes shine {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `}</style>
    </span>
);

const ChevronDownIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 ml-1.5 inline-block transition-transform duration-250 group-hover:rotate-180" {...props}>
     <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
   </svg>
);

const MenuIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const CloseIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

const ExternalLinkIcon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1.5 opacity-70 group-hover:opacity-100 transition-opacity" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

interface NavLinkProps {
    href?: string;
    children: ReactNode;
    hasDropdown?: boolean;
    className?: string;
    onClick?: (event: ReactMouseEvent<HTMLAnchorElement>) => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href = "#", children, hasDropdown = false, className = "", onClick }) => (
   <motion.a
     href={href}
     onClick={onClick}
     className={cn("relative group text-sm font-medium text-purple-200/80 hover:text-white transition-colors duration-250 flex items-center py-1 font-sans", className)}
     whileHover="hover"
   >
     {children}
     {hasDropdown && <ChevronDownIcon />}
     {!hasDropdown && (
          <motion.div
            className="absolute bottom-[-2px] left-0 right-0 h-[1px] bg-[#C5A880]"
            variants={{ initial: { scaleX: 0, originX: 0.5 }, hover: { scaleX: 1, originX: 0.5 } }}
            initial="initial"
            transition={{ duration: 0.35, ease: "easeOut" }}
          />
     )}
   </motion.a>
);

interface DropdownMenuProps {
    children: ReactNode;
    isOpen: boolean;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children, isOpen }) => (
   <AnimatePresence>
     {isOpen && (
       <motion.div
         initial={{ opacity: 0, y: 12, scale: 0.96 }}
         animate={{ opacity: 1, y: 0, scale: 1 }}
         exit={{ opacity: 0, y: 8, scale: 0.96, transition: { duration: 0.15 } }}
         transition={{ duration: 0.25, ease: "easeOut" }}
         className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-60 origin-top z-40"
       >
           <div className="bg-[#12071B]/95 backdrop-blur-xl border border-[#C5A880]/20 rounded-lg shadow-2xl p-2.5">
               {children}
           </div>
       </motion.div>
     )}
   </AnimatePresence>
);

interface DropdownItemProps {
    href?: string;
    children: ReactNode;
    icon?: React.ReactElement<SVGProps<SVGSVGElement>>;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ href = "#", children, icon }) => (
  <a
    href={href}
    className="group flex items-center justify-between w-full px-3.5 py-2.5 text-sm text-purple-200/90 hover:bg-[#C5A880]/8 hover:text-[#C5A880] rounded-md transition-all duration-200 font-sans"
  >
    <span>{children}</span>
    {icon && React.cloneElement(icon, { className: "w-4 h-4 ml-1.5 opacity-70 group-hover:opacity-100 transition-opacity text-[#C5A880]" })}
  </a>
);

interface Dot {
    x: number;
    y: number;
    originX: number;
    originY: number;
    vx: number;
    vy: number;
    baseColor: string;
    targetOpacity: number;
    currentOpacity: number;
    opacitySpeed: number;
    baseRadius: number;
    currentRadius: number;
    type: 'gold' | 'lavender';
}

const InteractiveHero: React.FC = () => {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const animationFrameId = useRef<number | null>(null);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
   const [openDropdown, setOpenDropdown] = useState<string | null>(null);
   const [isScrolled, setIsScrolled] = useState<boolean>(false);
   const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

   const { scrollY } = useScroll();
   useMotionValueEvent(scrollY, "change", (latest) => {
       setIsScrolled(latest > 20);
   });

   // Photo 3D Tilt Spring Config
   const tiltCardRef = useRef<HTMLDivElement>(null);
   const tiltX = useMotionValue(0);
   const tiltY = useMotionValue(0);
   const rotateX = useSpring(useTransform(tiltY, [-0.5, 0.5], [8, -8]), { damping: 20, stiffness: 150 });
   const rotateY = useSpring(useTransform(tiltX, [-0.5, 0.5], [-8, 8]), { damping: 20, stiffness: 150 });

   const handleMouseMoveTilt = (e: React.MouseEvent<HTMLDivElement>) => {
     if (prefersReducedMotion || window.innerWidth < 1024) return;
     const card = tiltCardRef.current;
     if (!card) return;
     const rect = card.getBoundingClientRect();
     const width = rect.width;
     const height = rect.height;
     const mouseX = e.clientX - rect.left - width / 2;
     const mouseY = e.clientY - rect.top - height / 2;
     tiltX.set(mouseX / width);
     tiltY.set(mouseY / height);
   };

   const handleMouseLeaveTilt = () => {
     tiltX.set(0);
     tiltY.set(0);
   };

   const dotsRef = useRef<Dot[]>([]);
   const gridRef = useRef<Record<string, number[]>>({});
   const canvasSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
   const mousePositionRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

   const DOT_SPACING = 30;
   const BASE_OPACITY_MIN = 0.15;
   const BASE_OPACITY_MAX = 0.35;
   const BASE_RADIUS = 0.8;
   const INTERACTION_RADIUS = 160;
   const INTERACTION_RADIUS_SQ = INTERACTION_RADIUS * INTERACTION_RADIUS;
   const OPACITY_BOOST = 0.65;
   const RADIUS_BOOST = 1.6;
   const GRID_CELL_SIZE = Math.max(60, Math.floor(INTERACTION_RADIUS / 1.5));

   const handleMouseMove = useCallback((event: globalThis.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) {
            mousePositionRef.current = { x: null, y: null };
            return;
        }
        const rect = canvas.getBoundingClientRect();
        const canvasX = event.clientX - rect.left;
        const canvasY = event.clientY - rect.top;
        mousePositionRef.current = { x: canvasX, y: canvasY };
   }, []);

   const createDots = useCallback(() => {
       const { width, height } = canvasSizeRef.current;
       if (width === 0 || height === 0) return;

       const newDots: Dot[] = [];
       const newGrid: Record<string, number[]> = {};
       const cols = Math.ceil(width / DOT_SPACING);
       const rows = Math.ceil(height / DOT_SPACING);

       for (let i = 0; i < cols; i++) {
           for (let j = 0; j < rows; j++) {
               const x = i * DOT_SPACING + DOT_SPACING / 2;
               const y = j * DOT_SPACING + DOT_SPACING / 2;
               const cellX = Math.floor(x / GRID_CELL_SIZE);
               const cellY = Math.floor(y / GRID_CELL_SIZE);
               const cellKey = `${cellX}_${cellY}`;

               if (!newGrid[cellKey]) {
                   newGrid[cellKey] = [];
               }

               const dotIndex = newDots.length;
               newGrid[cellKey].push(dotIndex);

               const baseOpacity = Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) + BASE_OPACITY_MIN;
               const isGold = Math.random() > 0.45;
               const baseRadius = isGold ? BASE_RADIUS : BASE_RADIUS * 0.9;
               
               newDots.push({
                   x,
                   y,
                   originX: x,
                   originY: y,
                   vx: 0,
                   vy: 0,
                   baseColor: isGold ? `rgba(197, 168, 128, ${BASE_OPACITY_MAX})` : `rgba(202, 180, 224, ${BASE_OPACITY_MAX})`,
                   targetOpacity: baseOpacity,
                   currentOpacity: baseOpacity,
                   opacitySpeed: (Math.random() * 0.006) + 0.002,
                   baseRadius: baseRadius,
                   currentRadius: baseRadius,
                   type: isGold ? 'gold' : 'lavender'
               });
           }
       }
       dotsRef.current = newDots;
       gridRef.current = newGrid;
   }, [DOT_SPACING, GRID_CELL_SIZE, BASE_OPACITY_MIN, BASE_OPACITY_MAX, BASE_RADIUS]);

   const handleResize = useCallback(() => {
       const canvas = canvasRef.current;
       if (!canvas) return;
       const container = canvas.parentElement;
       const width = container ? container.clientWidth : window.innerWidth;
       const height = container ? container.clientHeight : window.innerHeight;

       if (canvas.width !== width || canvas.height !== height ||
           canvasSizeRef.current.width !== width || canvasSizeRef.current.height !== height)
       {
           canvas.width = width;
           canvas.height = height;
           canvasSizeRef.current = { width, height };
           createDots();
       }
   }, [createDots]);

   const animateDots = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const dots = dotsRef.current;
        const grid = gridRef.current;
        const { width, height } = canvasSizeRef.current;
        const { x: mouseX, y: mouseY } = mousePositionRef.current;

        if (!ctx || !dots || !grid || width === 0 || height === 0) {
            animationFrameId.current = requestAnimationFrame(animateDots);
            return;
        }

        ctx.clearRect(0, 0, width, height);

        const activeDotIndices = new Set<number>();
        if (mouseX !== null && mouseY !== null && !prefersReducedMotion) {
            const mouseCellX = Math.floor(mouseX / GRID_CELL_SIZE);
            const mouseCellY = Math.floor(mouseY / GRID_CELL_SIZE);
            const searchRadius = Math.ceil(INTERACTION_RADIUS / GRID_CELL_SIZE);
            for (let i = -searchRadius; i <= searchRadius; i++) {
                for (let j = -searchRadius; j <= searchRadius; j++) {
                    const checkCellX = mouseCellX + i;
                    const checkCellY = mouseCellY + j;
                    const cellKey = `${checkCellX}_${checkCellY}`;
                    if (grid[cellKey]) {
                        grid[cellKey].forEach(dotIndex => activeDotIndices.add(dotIndex));
                    }
                }
            }
        }

        const springK = 0.04;
        const friction = 0.82;

        dots.forEach((dot, index) => {
            dot.currentOpacity += dot.opacitySpeed;
            if (dot.currentOpacity >= dot.targetOpacity || dot.currentOpacity <= BASE_OPACITY_MIN) {
                dot.opacitySpeed = -dot.opacitySpeed;
                dot.currentOpacity = Math.max(BASE_OPACITY_MIN, Math.min(dot.currentOpacity, BASE_OPACITY_MAX));
                dot.targetOpacity = Math.random() * (BASE_OPACITY_MAX - BASE_OPACITY_MIN) + BASE_OPACITY_MIN;
            }

            let interactionFactor = 0;
            let ax = (dot.originX - dot.x) * springK;
            let ay = (dot.originY - dot.y) * springK;

            if (mouseX !== null && mouseY !== null && activeDotIndices.has(index)) {
                const dx = dot.x - mouseX;
                const dy = dot.y - mouseY;
                const distSq = dx * dx + dy * dy;

                if (distSq < INTERACTION_RADIUS_SQ) {
                    const distance = Math.sqrt(distSq);
                    interactionFactor = Math.max(0, 1 - distance / INTERACTION_RADIUS);
                    interactionFactor = interactionFactor * interactionFactor;

                    // Springy elastic gravitational repulsion - pushes away and bounces
                    const forceStrength = 1.8 * interactionFactor;
                    const angle = Math.atan2(dy, dx);
                    ax += Math.cos(angle) * forceStrength;
                    ay += Math.sin(angle) * forceStrength;
                }
            }

            // Apply simple drag-spring integration
            dot.vx = (dot.vx + ax) * friction;
            dot.vy = (dot.vy + ay) * friction;
            dot.x += dot.vx;
            dot.y += dot.vy;

            dot.currentRadius = dot.baseRadius + interactionFactor * RADIUS_BOOST;
            const finalOpacity = Math.min(1, dot.currentOpacity + interactionFactor * OPACITY_BOOST);

            const r = dot.type === 'gold' ? '197' : '202';
            const g = dot.type === 'gold' ? '168' : '180';
            const b = dot.type === 'gold' ? '128' : '224';

            ctx.beginPath();
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${finalOpacity.toFixed(3)})`;
            ctx.arc(dot.x, dot.y, dot.currentRadius, 0, Math.PI * 2);
            ctx.fill();
        });

        animationFrameId.current = requestAnimationFrame(animateDots);
   }, [GRID_CELL_SIZE, INTERACTION_RADIUS, INTERACTION_RADIUS_SQ, OPACITY_BOOST, RADIUS_BOOST, BASE_OPACITY_MIN, BASE_OPACITY_MAX, prefersReducedMotion]);

   useEffect(() => {
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(motionQuery.matches);
        const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        motionQuery.addEventListener('change', handleMotionChange);

        handleResize();
        const handleMouseLeave = () => {
             mousePositionRef.current = { x: null, y: null };
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('resize', handleResize);
        document.documentElement.addEventListener('mouseleave', handleMouseLeave);

        animationFrameId.current = requestAnimationFrame(animateDots);

        return () => {
            motionQuery.removeEventListener('change', handleMotionChange);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
   }, [handleResize, handleMouseMove, animateDots]);

   useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
   }, [isMobileMenuOpen]);

   const openWhatsApp = (message: string) => {
      const phoneCountry = "55";
      const phoneDDD = "12";
      const phoneNumber = "988432041"; // SJC Clinical Number
      const targetURL = `https://wa.me/${phoneCountry}${phoneDDD}${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(targetURL, "_blank", "noopener,noreferrer");
   };

   const headerVariants: Variants = {
        top: {
            backgroundColor: "rgba(18, 7, 27, 0.3)",
            borderBottomColor: "rgba(197, 168, 128, 0.08)",
            boxShadow: 'none',
        },
        scrolled: {
            backgroundColor: "rgba(18, 7, 27, 0.94)",
            borderBottomColor: "rgba(197, 168, 128, 0.22)",
            boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.6)',
        }
   };

   const mobileMenuVariants: Variants = {
        hidden: { opacity: 0, y: -24 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 250 } },
        exit: { opacity: 0, y: -24, transition: { duration: 0.18, ease: "easeIn" } }
   };

   const contentDelay = 0.15;
   const itemDelayIncrement = 0.08;

   const bannerVariants: Variants = {
       hidden: { opacity: 0, y: -12 },
       visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: contentDelay } }
   };
   const headlineVariants: Variants = {
       hidden: { opacity: 0, y: 20 },
       visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: contentDelay + itemDelayIncrement } }
   };
   const subHeadlineVariants: Variants = {
       hidden: { opacity: 0, y: 15 },
       visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: contentDelay + itemDelayIncrement * 2 } }
   };
   const ctaVariants: Variants = {
       hidden: { opacity: 0, y: 15 },
       visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: contentDelay + itemDelayIncrement * 3 } }
   };
   const statsVariants: Variants = {
       hidden: { opacity: 0, y: 15 },
       visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: contentDelay + itemDelayIncrement * 4 } }
   };
   const imageFrameVariants: Variants = {
       hidden: { opacity: 0, scale: 0.95, y: 30 },
       visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: contentDelay + itemDelayIncrement * 3 } }
   };

   return (
    <div className="relative bg-gradient-to-b from-[#13071D] via-[#0D0415] to-[#0A020D] text-gray-300 min-h-screen flex flex-col overflow-x-hidden">
        {/* Glow decorative blobs - Mauve & Gold Luxury Light Leaks */}
        <div className="absolute top-[8%] left-[5%] w-[420px] h-[420px] bg-[radial-gradient(circle,rgba(197,168,128,0.065)_0%,transparent_70%)] rounded-full blur-[90px] pointer-events-none z-0"></div>
        <div className="absolute top-[25%] right-[5%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(155,108,199,0.05)_0%,transparent_70%)] rounded-full blur-[110px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[5%] left-[25%] w-[380px] h-[380px] bg-[radial-gradient(circle,rgba(197,168,128,0.04)_0%,transparent_70%)] rounded-full blur-[80px] pointer-events-none z-0"></div>

        {/* Dynamic Interactive Dot Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-85" />
        <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_35%,#0A020D_98%)]" />

        {/* Global floating Header */}
        <motion.header
            variants={headerVariants}
            initial="top"
            animate={isScrolled ? "scrolled" : "top"}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="px-6 md:px-10 lg:px-16 w-full fixed top-0 z-50 backdrop-blur-md border-b"
        >
            <nav className="flex justify-between items-center max-w-screen-xl mx-auto h-[80px]">
                {/* Brand Logo in Gold */}
                <div className="flex items-center flex-shrink-0">
                    <a href="#hero" className="flex flex-col select-none group">
                      <span className="logo-text text-white font-serif text-2xl tracking-wide font-bold transition-all duration-300 group-hover:text-[#C5A880]">Suellen Mello</span>
                      <span className="logo-subtitle text-[#C5A880] text-3xs tracking-[0.25em] font-sans uppercase font-bold opacity-90 group-hover:tracking-[0.28em] transition-all duration-300">Podologia Avançada</span>
                    </a>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center justify-center flex-grow gap-6 lg:gap-8 px-6">
                    <NavLink href="#hero">Início</NavLink>
                    <NavLink href="#sobre">A Profissional</NavLink>

                    {/* Dropdown Menu Tratamentos */}
                    <div
                        className="relative"
                        onMouseEnter={() => setOpenDropdown('tratamentos')}
                        onMouseLeave={() => setOpenDropdown(null)}
                    >
                        <NavLink href="#servicos" hasDropdown>Tratamentos</NavLink>
                        <DropdownMenu isOpen={openDropdown === 'tratamentos'}>
                            <DropdownItem href="#servicos">Unhas Infeccionadas</DropdownItem>
                            <DropdownItem href="#servicos">Laserterapia Clínica</DropdownItem>
                            <DropdownItem href="#servicos">Unhas Encravadas</DropdownItem>
                            <DropdownItem href="#servicos">Calos & Calosidades</DropdownItem>
                            <DropdownItem href="#servicos">Fissuras & Rachaduras</DropdownItem>
                            <DropdownItem href="#servicos">Podologia Preventiva</DropdownItem>
                            <DropdownItem href="#servicos">Spa dos Pés Clínico</DropdownItem>
                        </DropdownMenu>
                    </div>

                    <NavLink href="#diferenciais">Diferenciais</NavLink>
                    <NavLink href="#depoimentos">Depoimentos</NavLink>

                    {/* Dropdown Menu Atendimento */}
                    <div
                        className="relative"
                        onMouseEnter={() => setOpenDropdown('atendimento')}
                        onMouseLeave={() => setOpenDropdown(null)}
                    >
                        <NavLink href="#footer" hasDropdown>Atendimento</NavLink>
                        <DropdownMenu isOpen={openDropdown === 'atendimento'}>
                            <DropdownItem href="#agendamento" icon={<ExternalLinkIcon />}>Marcar Avaliação</DropdownItem>
                            <DropdownItem href="#clinica">Ver Consultório</DropdownItem>
                            <DropdownItem href="#sobre">Falar Conosco</DropdownItem>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Navbar Action Button */}
                <div className="flex items-center flex-shrink-0 gap-4 lg:gap-6">
                    <motion.a
                        href="#hero"
                        onClick={(e) => {
                          e.preventDefault();
                          openWhatsApp("Olá Suellen! Visitei o seu site e gostaria de agendar uma consulta podológica.");
                        }}
                        className="hidden sm:flex bg-[#C5A880] text-[#13071D] px-6 py-2.5 rounded-full text-xs lg:text-sm font-semibold hover:bg-white hover:text-[#B89C72] transition-all duration-300 whitespace-nowrap shadow-[0_4px_20px_rgba(197,168,128,0.22)] font-sans items-center gap-2 cursor-pointer border border-[#C5A880]"
                        whileHover={{ scale: 1.04, y: -1 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 450, damping: 14 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
                          <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79 1.104h.003c4.368 0 7.927-3.558 7.929-7.93a7.9 7.9 0 0 0-2.326-5.647ZM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.69-4.98c-.2-.1-1.185-.584-1.37-.652-.185-.067-.32-.1-.454.1-.134.2-.52.652-.638.787-.118.134-.236.15-.436.05-.2-.1-.84-.31-1.597-.985-.59-.525-.985-1.175-1.103-1.372-.118-.198-.013-.304.087-.403.09-.089.2-.233.3-.35.1-.117.135-.198.2-.33.065-.133.032-.25-.015-.35-.047-.1-.453-1.096-.62-1.499-.163-.398-.343-.343-.454-.343-.117-.007-.25-.009-.383-.009-.134 0-.353.05-.537.25-.185.2-.707.692-.707 1.688s.723 1.954.823 2.088c.1.135 1.424 2.176 3.45 3.053.483.208.86.332 1.151.425.485.154.928.132 1.278.08.39-.058 1.185-.484 1.352-.929.167-.445.167-.826.118-.93-.05-.104-.185-.15-.385-.25"/>
                        </svg>
                        Agendar Consulta
                    </motion.a>

                    {/* Mobile Hamburger menu */}
                    <motion.button
                        className="md:hidden text-[#C5A880] hover:text-white z-50 p-1"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                        whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                    >
                        {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </motion.button>
                </div>
            </nav>

            {/* Mobile Drawer menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        key="mobile-menu"
                        variants={mobileMenuVariants} initial="hidden" animate="visible" exit="exit"
                        className="md:hidden absolute top-full left-0 right-0 bg-[#13071D]/98 backdrop-blur-md shadow-2xl py-6 border-t border-purple-950/40"
                    >
                        <div className="flex flex-col items-center gap-5 px-6">
                            <NavLink href="#hero" onClick={() => setIsMobileMenuOpen(false)}>Início</NavLink>
                            <NavLink href="#sobre" onClick={() => setIsMobileMenuOpen(false)}>A Profissional</NavLink>
                            <NavLink href="#servicos" onClick={() => setIsMobileMenuOpen(false)}>Tratamentos</NavLink>
                            <NavLink href="#diferenciais" onClick={() => setIsMobileMenuOpen(false)}>Diferenciais</NavLink>
                            <NavLink href="#depoimentos" onClick={() => setIsMobileMenuOpen(false)}>Depoimentos</NavLink>
                            <NavLink href="#agendamento" onClick={() => setIsMobileMenuOpen(false)}>Agendamento</NavLink>
                            
                            <motion.a
                                href="#hero"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setIsMobileMenuOpen(false);
                                  openWhatsApp("Olá Dra. Suellen! Gostaria de agendar uma avaliação podológica pelo WhatsApp.");
                                }}
                                className="w-full max-w-[240px] text-center bg-[#C5A880] text-[#13071D] py-3 rounded-full text-sm font-semibold hover:bg-white transition-all font-sans flex items-center justify-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-whatsapp animate-bounce" viewBox="0 0 16 16">
                                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79 1.104h.003c4.368 0 7.927-3.558 7.929-7.93a7.9 7.9 0 0 0-2.326-5.647ZM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.69-4.98c-.2-.1-1.185-.584-1.37-.652-.185-.067-.32-.1-.454.1-.134.2-.52.652-.638.787-.118.134-.236.15-.436.05-.2-.1-.84-.31-1.597-.985-.59-.525-.985-1.175-1.103-1.372-.118-.198-.013-.304.087-.403.09-.089.2-.233.3-.35.1-.117.135-.198.2-.33.065-.133.032-.25-.015-.35-.047-.1-.453-1.096-.62-1.499-.163-.398-.343-.343-.454-.343-.117-.007-.25-.009-.383-.009-.134 0-.353.05-.537.25-.185.2-.707.692-.707 1.688s.723 1.954.823 2.088c.1.135 1.424 2.176 3.45 3.053.483.208.86.332 1.151.425.485.154.928.132 1.278.08.39-.058 1.185-.484 1.352-.929.167-.445.167-.826.118-.93-.05-.104-.185-.15-.385-.25"/>
                                </svg>
                                Agendar Consulta
                            </motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>

        {/* Core Hero Grid Content */}
        <main className="flex-grow flex items-center justify-center w-full pt-[120px] pb-20 relative z-10 px-6 md:px-12 lg:px-16">
            <div className="max-w-screen-xl w-full mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
                
                {/* ── Left Column: Headline copy & CTA ── */}
                <div className="lg:col-span-7 flex flex-col text-left items-start">
                    
                    {/* Badge Experiência */}
                    <motion.div
                        variants={bannerVariants}
                        initial="hidden"
                        animate="visible"
                        className="mb-5 sm:mb-6"
                    >
                        <ShinyText text="✨ Podologia Avançada · São José dos Campos" className="bg-[#12071B]/90 border border-[#C5A880]/20 text-[#C5A880] px-4.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold tracking-wide" />
                    </motion.div>

                    {/* Headline h1 with spring RotatingText */}
                    <motion.h1
                        variants={headlineVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[62px] font-bold text-white leading-[1.12] mb-6 font-serif tracking-tight"
                    >
                        Seus pés merecem<br />{' '}
                        <span className="block min-h-[1.25em] overflow-hidden align-bottom">
                            <RotatingText
                                texts={['cuidado incomparável.', 'alívio definitivo.', 'passos sem dor.', 'laserterapia clínica.', 'saúde e bem-estar.']}
                                mainClassName="text-[#C5A880] font-serif italic font-normal"
                                staggerFrom={"last"}
                                initial={{ y: "-100%", opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: "110%", opacity: 0 }}
                                staggerDuration={0.012}
                                transition={{ type: "spring", damping: 20, stiffness: 220 }}
                                rotationInterval={2400}
                                splitBy="characters"
                                auto={true}
                                loop={true}
                            />
                        </span>
                    </motion.h1>

                    {/* Description Paragraph */}
                    <motion.p
                        variants={subHeadlineVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-base sm:text-lg text-purple-100/80 max-w-xl mb-10 font-sans font-light leading-relaxed"
                    >
                        A <strong className="text-white font-medium">Dra. Suellen Mello</strong> reabilita a saúde dos seus pés utilizando protocolos clínicos de alta performance, laserterapia e órteses corretivas. Devolvendo o conforto ao caminhar desde 2006.
                    </motion.p>

                    {/* Action Buttons Zone */}
                    <motion.div
                        variants={ctaVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12"
                    >
                        <motion.button
                            onClick={() => openWhatsApp("Olá Dra. Suellen! Gostaria de agendar uma avaliação clínica para os meus pés.")}
                            className="w-full sm:w-auto bg-gradient-to-r from-[#C5A880] to-[#E3CBB0] text-[#13071D] px-8 py-4 rounded-full text-base font-bold hover:shadow-[0_0_25px_rgba(197,168,128,0.4)] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer font-sans shadow-lg"
                            whileHover={{ scale: 1.04, y: -1 }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-whatsapp animate-pulse" viewBox="0 0 16 16">
                              <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79 1.104h.003c4.368 0 7.927-3.558 7.929-7.93a7.9 7.9 0 0 0-2.326-5.647ZM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.69-4.98c-.2-.1-1.185-.584-1.37-.652-.185-.067-.32-.1-.454.1-.134.2-.52.652-.638.787-.118.134-.236.15-.436.05-.2-.1-.84-.31-1.597-.985-.59-.525-.985-1.175-1.103-1.372-.118-.198-.013-.304.087-.403.09-.089.2-.233.3-.35.1-.117.135-.198.2-.33.065-.133.032-.25-.015-.35-.047-.1-.453-1.096-.62-1.499-.163-.398-.343-.343-.454-.343-.117-.007-.25-.009-.383-.009-.134 0-.353.05-.537.25-.185.2-.707.692-.707 1.688s.723 1.954.823 2.088c.1.135 1.424 2.176 3.45 3.053.483.208.86.332 1.151.425.485.154.928.132 1.278.08.39-.058 1.185-.484 1.352-.929.167-.445.167-.826.118-.93-.05-.104-.185-.15-.385-.25"/>
                            </svg>
                            Agendar Avaliação
                        </motion.button>
                        
                        <a
                            href="#servicos"
                            className="w-full sm:w-auto border-2 border-purple-500/20 hover:border-[#C5A880] text-purple-100 hover:text-white px-8 py-3.5 rounded-full text-base font-bold bg-[#13071D]/45 backdrop-blur-md transition-all duration-300 flex items-center justify-center font-sans gap-2"
                        >
                            Ver Tratamentos <ArrowRight className="w-4 h-4 ml-1" />
                        </a>
                    </motion.div>

                    {/* Stats Badges row */}
                    <motion.div
                        variants={statsVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-purple-950/50 pt-8 w-full max-w-xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-purple-950/50 border border-[#C5A880]/15 text-[#C5A880]">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-white font-serif font-bold text-lg leading-tight">+19 Anos</h4>
                                <p className="text-purple-200/60 text-xs font-sans">Experiência Clínica</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-purple-950/50 border border-[#C5A880]/15 text-[#C5A880]">
                                <Star className="w-5 h-5 fill-[#C5A880]" />
                            </div>
                            <div>
                                <h4 className="text-white font-serif font-bold text-lg leading-tight">5.0 ★</h4>
                                <p className="text-purple-200/60 text-xs font-sans">Google Avaliações</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-purple-950/50 border border-[#C5A880]/15 text-[#C5A880]">
                                <Award className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-white font-serif font-bold text-lg leading-tight">Laserterapia</h4>
                                <p className="text-purple-200/60 text-xs font-sans">Alta Tecnologia</p>
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* ── Right Column: Interactive 3D image & Float cards ── */}
                <div className="lg:col-span-5 flex justify-center relative select-none">
                    
                    <motion.div
                        ref={tiltCardRef}
                        variants={imageFrameVariants}
                        initial="hidden"
                        animate="visible"
                        onMouseMove={handleMouseMoveTilt}
                        onMouseLeave={handleMouseLeaveTilt}
                        style={{
                            rotateX: rotateX,
                            rotateY: rotateY,
                            transformStyle: "preserve-3d"
                        }}
                        className="relative group/tilt w-[290px] sm:w-[350px] aspect-[3/4] cursor-pointer"
                    >
                        {/* Elegant outer glow boarder matching photo */}
                        <div className="absolute inset-[-14px] border border-[#C5A880]/20 rounded-[2rem_5rem_2rem_5rem] pointer-events-none group-hover/tilt:border-[#C5A880]/40 transition-colors duration-300" style={{ transform: "translateZ(-10px)" }} />
                        <div className="absolute inset-[-6px] border-2 border-[#C5A880]/12 rounded-[2rem_5rem_2rem_5rem] pointer-events-none" style={{ transform: "translateZ(-5px)" }} />

                        {/* Interactive Main Portrait */}
                        <div className="w-full h-full rounded-[2rem_5rem_2rem_5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.65),0_0_40px_rgba(197,168,128,0.1)] bg-purple-950/20 relative" style={{ transform: "translateZ(10px)" }}>
                            <img
                                src="/assets/image/suellen1.jpeg"
                                alt="Dra. Suellen Mello — Podóloga Especialista"
                                className="w-full h-full object-cover object-top scale-102 group-hover/tilt:scale-105 transition-transform duration-500"
                            />
                            
                            {/* Overlay Gradient Vignette */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0A020D]/65 via-transparent to-transparent pointer-events-none" />
                        </div>

                        {/* Floating glassmorphic Card 1: Laserterapia */}
                        <motion.div
                            animate={prefersReducedMotion ? {} : { y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 4.2, ease: "easeInOut" }}
                            className="absolute -top-6 -left-10 bg-[#12071B]/80 backdrop-blur-xl border border-purple-500/15 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.45)] flex items-center gap-3 max-w-[200px]"
                            style={{ transform: "translateZ(35px)" }}
                        >
                            <div className="w-9 h-9 rounded-xl bg-purple-900/35 border border-[#C5A880]/20 flex items-center justify-center text-[#C5A880] flex-shrink-0 animate-pulse">
                                <Zap className="w-4.5 h-4.5" />
                            </div>
                            <div>
                                <h4 className="text-white font-sans font-bold text-xs">Laserterapia</h4>
                                <p className="text-purple-200/50 text-3xs font-light">Cicatrização rápida</p>
                            </div>
                        </motion.div>

                        {/* Floating glassmorphic Card 2: Atendimento SJC */}
                        <motion.div
                            animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 4.8, ease: "easeInOut", delay: 0.3 }}
                            className="absolute -bottom-4 -right-10 bg-[#12071B]/85 backdrop-blur-xl border border-[#C5A880]/15 rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.45)] flex items-center gap-3 max-w-[220px]"
                            style={{ transform: "translateZ(45px)" }}
                        >
                            <div className="w-9.5 h-9.5 rounded-xl bg-purple-900/40 border border-[#C5A880]/20 flex items-center justify-center text-[#C5A880] flex-shrink-0">
                                <CheckCircle className="w-4.5 h-4.5" />
                            </div>
                            <div>
                                <h4 className="text-white font-sans font-bold text-xs">Clínica Referência</h4>
                                <p className="text-purple-200/50 text-3xs font-light">Desde 2006 cuidando dos pés</p>
                            </div>
                        </motion.div>

                        {/* Small green live availability dot */}
                        <div
                            className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-md border border-[#C5A880]/30 rounded-full px-3.5 py-1.5 flex items-center gap-2 shadow-lg"
                            style={{ transform: "translateZ(25px)" }}
                        >
                            <span className="w-2 h-2 rounded-full bg-[#4caf7d] shadow-[0_0_10px_#4caf7d] animate-ping" />
                            <span className="w-2 h-2 rounded-full bg-[#4caf7d] absolute left-3.5" />
                            <span className="text-3xs font-bold text-[#13071D] font-sans">Consulta Disponível</span>
                        </div>

                    </motion.div>

                </div>

            </div>

            </div>
        </main>
        
        {/* Subtle Elegant Section Divider (Obsidian to Mauve Transition) */}
        <div className="h-24 bg-gradient-to-t from-[#FDFBFF] to-transparent w-full pointer-events-none relative z-10 opacity-[0.045]" />
    </div>
   );
};

export default InteractiveHero;
