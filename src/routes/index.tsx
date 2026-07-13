import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Lenis from "lenis";
import { Bird, Package, Truck, ShieldCheck, Award, Clock, MapPin, CheckCircle, Leaf } from "lucide-react";
import { EggIcon } from "../components/EggIcon";
import { EggLoader } from "../components/EggLoader";
import { OrderSection } from "../components/OrderSection";
import { ProductsSection } from "../components/ProductsSection";
import { FloatingCartBar } from "../components/FloatingCartBar";
import { CartProvider } from "../lib/cart-context";


const ChickenIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19,8.5C18.6,8.5 18.2,8.6 17.8,8.8C18,8.2 18,7.6 17.8,7C17.3,5.5 15.9,4.4 14.2,4.1C13.2,4 12.3,4.2 11.5,4.8L11.3,4.1C11.1,3.4 10.4,3 9.7,3H9V4H9.7L10.3,6.2L10,6.5C9,7.5 8.4,8.8 8.1,10.2C7.3,10.1 6.5,10.2 5.8,10.6L5.3,9.7L4.4,10.2L4.9,11C4.4,11.5 4,12.2 4,13C4,14.6 5.3,16 7,16V17H5V19H7V21H9V19H11V21H13V19H15V17H13V16C13.6,16 14.1,15.8 14.6,15.6C16.4,15 17.6,13.4 17.9,11.5C18.6,11.3 19.1,10.9 19.5,10.3C19.8,9.8 20,9.2 20,8.5C20,8 19.6,8.5 19,8.5M15.5,7C15.8,7 16,7.2 16,7.5C16,7.8 15.8,8 15.5,8C15.2,8 15,7.8 15,7.5C15,7.2 15.2,7 15.5,7Z" />
  </svg>
);

const logo = { url: "/Logo.png" };

type Scene = {
  src: string;
  desktopSrc?: string;
  loop: boolean;
  num: string;
  eyebrow: string;
  title: string;
  body: string;
  align: "right" | "left" | "center";
  pos: "top" | "bottom" | "middle";
  revealLastSecs?: number;
};

const SCENES: Scene[] = [
  {
    src: "/scene1-mobile.mp4",
    desktopSrc: "/scene1-desktop.mp4",
    loop: true,
    num: "01", eyebrow: "Bab Al Baraka",
    title: "A Gateway to Blessings",
    body: "Premium farm fresh eggs — where quality meets care in every single egg we deliver.",
    align: "right" as const, pos: "middle" as const,
  },
  {
    src: "/scene2-mobile.mp4",
    desktopSrc: "/scene2-desktop.mp4",
    loop: false,
    num: "02", eyebrow: "From Our Farms",
    title: "Nature Knows Best",
    body: "Healthy, well-cared-for hens laying fresh eggs daily — pure, natural, and full of goodness.",
    align: "right" as const, pos: "middle" as const,
  },
  {
    src: "/scene3-mobile.mp4",
    desktopSrc: "/scene3-desktop.mp4",
    loop: false,
    num: "03", eyebrow: "Daily Harvest",
    title: "Collected Fresh, Every Day",
    body: "Each egg is gathered daily and quality-checked, so freshness is never left to chance.",
    align: "right" as const, pos: "top" as const,
  },
  {
    src: "/scene4-mobile.mp4",
    desktopSrc: "/scene4-desktop.mp4",
    loop: false,
    num: "04", eyebrow: "Hygienic Packing",
    title: "Packed with Care",
    body: "Sorted, inspected, and sealed in food-grade trays the same day — minimal handling, maximum freshness.",
    align: "right" as const, pos: "middle" as const,
    revealLastSecs: 2,
  },
  {
    src: "/scene5-mobile.mp4",
    desktopSrc: "/scene5-desktop.mp4",
    loop: false,
    num: "05", eyebrow: "Order Today",
    title: "From Our Farm to Your Kitchen",
    body: "Order online or find us in stores across the UAE — delivered fresh to your doorstep by tomorrow.",
    align: "left" as const, pos: "middle" as const,
    revealLastSecs: 2,
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bab Al Baraka — A Gateway to Blessings" },
      { name: "description", content: "Bab Al Baraka brings together heritage, hospitality, and craft." },
      { property: "og:title", content: "Bab Al Baraka" },
    ],
  }),
  component: Index,
});

// ── Text overlay — key prop forces remount = replays animation ───────────────
function TextOverlay({ scene, visible }: { scene: typeof SCENES[0]; visible: boolean }) {
  // Mobile: always top, centered. Desktop (md+): per-scene pos/align.
  const posClass =
    scene.pos === "top" ? "top-28 md:top-32"
    : scene.pos === "middle" ? "top-28 md:top-1/2 md:-translate-y-1/2"
    : "top-28 md:top-auto md:bottom-20";
  const alignClass =
    scene.align === "right"
      ? "inset-x-0 mx-auto items-center text-center md:right-0 md:inset-x-auto md:mx-0 md:items-end md:text-right px-6 md:px-14 max-w-sm md:max-w-lg"
      : scene.align === "left"
        ? "inset-x-0 mx-auto items-center text-center md:left-0 md:inset-x-auto md:mx-0 md:items-start md:text-left px-6 md:px-14 max-w-sm md:max-w-lg"
        : "inset-x-0 mx-auto items-center text-center px-6 md:px-8 max-w-sm md:max-w-xl";

  const gated = !!scene.revealLastSecs;
  const lineStyle = (delayMs: number): CSSProperties =>
    gated
      ? {
          opacity: visible ? 1 : 0,
          filter: visible ? "blur(0px)" : "blur(10px)",
          transform: visible ? "translateY(0)" : "translateY(14px)",
          transition: `opacity 0.7s cubic-bezier(.22,1,.36,1) ${delayMs}ms, filter 0.7s cubic-bezier(.22,1,.36,1) ${delayMs}ms, transform 0.7s cubic-bezier(.22,1,.36,1) ${delayMs}ms`,
        }
      : {
          animation: `textRiseIn 0.8s cubic-bezier(.22,1,.36,1) ${delayMs}ms both`,
        };

  return (
    <div className={`absolute z-10 flex flex-col ${posClass} ${alignClass}`}>
      <div className="text-[11px] tracking-[0.4em] uppercase text-white/60 mb-3" style={lineStyle(0)}>
        {scene.num} — {scene.eyebrow}
      </div>
      <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl leading-[1.05] mb-4 text-white" style={lineStyle(120)}>
        {scene.title}
      </h2>
      <p className="text-sm md:text-base text-white/80 leading-relaxed" style={lineStyle(240)}>
        {scene.body}
      </p>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [textVisible, setTextVisible] = useState(true);
  const videoRefs    = useRef<(HTMLVideoElement | null)[]>([]);
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Switch video when active changes
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === active) {
        if (vid.preload === "none") { vid.preload = "auto"; vid.load(); }
        vid.currentTime = 0;
        const tryPlay = () => vid.play().catch(() => {});
        if (vid.readyState >= 3) tryPlay();
        else vid.addEventListener("canplay", tryPlay, { once: true });
      } else {
        vid.pause();
      }
    });
  }, [active, isDesktop]);

  // Eagerly buffer every scene shortly after first paint so scene switches never stall
  useEffect(() => {
    const t = setTimeout(() => {
      videoRefs.current.forEach((vid) => {
        if (vid && vid.preload === "none") { vid.preload = "auto"; vid.load(); }
      });
    }, 1500);
    return () => clearTimeout(t);
  }, [isDesktop]);

  // Late-reveal text: for scenes with revealLastSecs, only show text during the final N seconds
  useEffect(() => {
    const revealSecs = SCENES[active].revealLastSecs;
    if (!revealSecs) { setTextVisible(true); return; }
    setTextVisible(false);
    const vid = videoRefs.current[active];
    if (!vid) return;
    const handleTimeUpdate = () => {
      if (vid.duration && vid.duration - vid.currentTime <= revealSecs) setTextVisible(true);
    };
    vid.addEventListener("timeupdate", handleTimeUpdate);
    return () => vid.removeEventListener("timeupdate", handleTimeUpdate);
  }, [active, isDesktop]);

  // Lenis smooth scrolling — interpolates all wheel/touch input for a buttery, seamless feel
  const lenisRef = useRef<Lenis | null>(null);
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenisRef.current = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const sceneLock = useRef(false);
  const scrollToScene = (i: number) => {
    setActive(i);
    const topPos = sentinelRefs.current[i]?.offsetTop ?? (i * window.innerHeight);
    sceneLock.current = true;
    lenisRef.current?.scrollTo(topPos, {
      duration: 1.2,
      lock: true,
      onComplete: () => {
        // Small cooldown so trailing wheel momentum can't skip a scene
        setTimeout(() => { sceneLock.current = false; }, 250);
      },
    });
  };

  // One wheel gesture = one scene while inside the hero story.
  // Captured before Lenis so momentum can never skip scenes; past the last
  // scene the wheel falls through to normal (Lenis-smoothed) scrolling.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const vh = window.innerHeight;
      const heroEnd = (SCENES.length - 1) * vh;
      const y = window.scrollY;
      const inHero = y < heroEnd - 1;
      const atHeroEnd = y <= heroEnd + 1;
      const cur = Math.min(SCENES.length - 1, Math.max(0, Math.round(y / vh)));

      if (e.deltaY > 0) {
        if (!inHero) return; // at/after last scene — normal scroll continues to products
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!sceneLock.current) scrollToScene(Math.min(SCENES.length - 1, cur + 1));
      } else if (e.deltaY < 0) {
        if (!atHeroEnd || cur === 0) return; // above scene 0 or below hero — normal scroll
        e.preventDefault();
        e.stopImmediatePropagation();
        if (!sceneLock.current) scrollToScene(Math.max(0, cur - 1));
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    return () => window.removeEventListener("wheel", onWheel, { capture: true });
  }, []);

  // Scroll-driven scene switching (touch/drag/scrollbar paths) — midpoint of each 100vh band
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const i = Math.min(
          SCENES.length - 1,
          Math.max(0, Math.round(window.scrollY / window.innerHeight)),
        );
        setActive((prev) => (prev === i ? prev : i));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={scrollContainerRef} className="w-full relative">
      {isLoading && <EggLoader onComplete={() => setIsLoading(false)} />}
      
      {/* Inject keyframe once */}
      <style>{`
        @keyframes textRiseIn {
          from { opacity: 0; filter: blur(10px); transform: translateY(14px); }
          to   { opacity: 1; filter: blur(0px); transform: translateY(0); }
        }
        /* Hide the browser scrollbar — page still scrolls normally */
        html { scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Fixed full-screen canvas */}
      <div className="fixed inset-0 z-0 bg-[#2a0003] h-[100dvh] w-full">
        {SCENES.map((scene, i) => (
          <video
            key={i}
            ref={el => { videoRefs.current[i] = el; }}
            src={isDesktop && scene.desktopSrc ? scene.desktopSrc : scene.src}
            muted
            playsInline
            loop={scene.loop}
            preload={i === 0 ? "auto" : "none"}
            autoPlay={i === 0}
            className="absolute inset-0 h-full w-full object-contain md:object-cover"
            style={{
              opacity: i === active ? 1 : 0,
              transition: "opacity 0.7s ease",
              willChange: "opacity",
              transform: "translateZ(0)",
            }}
          />
        ))}

        {/* Text — key=active forces remount & replays animation */}
        <TextOverlay key={active} scene={SCENES[active]} visible={textVisible} />
      </div>

      {/* Scrollable sentinels — one per scene, each 100vh */}
      <div className="relative z-10" style={{ height: `${SCENES.length * 100}dvh` }}>
        {SCENES.map((_, i) => (
          <div
            key={i}
            ref={el => { sentinelRefs.current[i] = el; }}
            className="h-[100dvh] w-full"
          />
        ))}
      </div>

      {/* ── Farm Fresh Section ───────────────────────────────────────────── */}
      <div className="relative z-10 bg-[#faf6f0] overflow-hidden">
        {/* Scattered decorative eggs as watermark */}
        <div className="absolute top-10 left-0 -translate-x-1/4 opacity-40 pointer-events-none rotate-[15deg]">
           <EggIcon className="w-96 h-96 text-[#d4c3b3]" />
        </div>
        <div className="absolute top-64 right-0 translate-x-1/4 opacity-40 pointer-events-none -rotate-[25deg]">
           <EggIcon className="w-80 h-80 text-[#d4c3b3]" />
        </div>
        <div className="absolute top-[40%] left-10 opacity-30 pointer-events-none rotate-[45deg]">
           <EggIcon className="w-64 h-64 text-[#d4c3b3]" />
        </div>
        <div className="absolute top-[60%] right-10 opacity-30 pointer-events-none -rotate-[10deg]">
           <EggIcon className="w-72 h-72 text-[#d4c3b3]" />
        </div>
        <div className="absolute bottom-10 left-[20%] opacity-40 pointer-events-none rotate-[30deg]">
           <EggIcon className="w-56 h-56 text-[#d4c3b3]" />
        </div>

        {/* Hero headline */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-20 text-center">
          <p className="inline-block border border-[#8b1a1a]/20 rounded-full px-4 py-1.5 text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#8b1a1a] mb-8 bg-[#8b1a1a]/5">
             Bab Al Baraka Eggs
          </p>
          <h2 className="font-serif text-5xl md:text-7xl text-[#1a1a1a] leading-[1.1] mb-8">
            Fresh From Farm.<br />
            <span className="text-[#8b1a1a] italic">Delivered Tomorrow.</span>
          </h2>
          <p className="text-lg md:text-xl text-[#555] max-w-2xl mx-auto leading-relaxed font-light">
            Premium farm fresh eggs carefully selected, quality inspected, packed hygienically and delivered across the UAE.
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 max-w-5xl mx-auto px-6 md:px-12 mb-12">
          <div className="flex-1 h-px bg-[#8b1a1a]/20" />
          <div className="w-2 h-2 rounded-full bg-[#8b1a1a]/40" />
          <div className="flex-1 h-px bg-[#8b1a1a]/20" />
        </div>

        {/* Why Choose Section Background */}
        <div className="bg-[#faf6f0] py-24 relative overflow-hidden">
          {/* Decorative Eggs/Leaves Background */}
          <div className="absolute top-10 left-10 opacity-20 pointer-events-none rotate-[15deg]">
             <Leaf className="w-24 h-24 text-green-700" />
          </div>
          <div className="absolute top-40 right-20 opacity-20 pointer-events-none -rotate-[30deg]">
             <EggIcon className="w-32 h-32 text-[#d4c3b3]" />
          </div>
          <div className="absolute bottom-20 left-20 opacity-20 pointer-events-none rotate-[45deg]">
             <EggIcon className="w-40 h-40 text-[#d4c3b3]" />
          </div>
          <div className="absolute bottom-40 right-10 opacity-20 pointer-events-none -rotate-[15deg]">
             <Leaf className="w-32 h-32 text-green-700" />
          </div>

          {/* Why Choose heading */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center mb-20">
             <div className="flex justify-center items-center gap-4 mb-4">
                <Leaf className="w-6 h-6 text-green-700" />
                <h4 className="font-serif italic text-xl md:text-2xl text-[#8b1a1a]">Dear Valuable Customer,</h4>
                <Leaf className="w-6 h-6 text-green-700 scale-x-[-1]" />
             </div>
             <h2 className="font-serif text-4xl md:text-6xl text-[#1a1a1a] mb-2 tracking-wide font-bold">
                Why Choose <br/>
                <span className="text-[#8b1a1a]">BAB AL BARAKA EGGS?</span>
             </h2>
          </div>

          {/* Three feature cards - Stacked and Stylized */}
          <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 flex flex-col gap-12 mb-8">
            {[
              {
                icon: <ChickenIcon className="w-12 h-12 text-white" />,
                title: "FARM FRESH QUALITY",
                points: [
                  <>Eggs are collected fresh from trusted farms.</>,
                  <>Carefully selected for quality and freshness.</>
                ],
              },
              {
                icon: <Package className="w-10 h-10 text-white" />,
                title: "HYGIENIC PACKAGING PROCESS",
                points: [
                  <>Eggs are inspected before packing.</>,
                  <>Packed in clean, food-grade trays and cartons.</>,
                  <>Packaging is completed within <strong className="font-bold text-[#8b1a1a]">1 day</strong> to preserve freshness.</>
                ],
              },
              {
                icon: <Truck className="w-10 h-10 text-white" />,
                title: "FRESH DELIVERY",
                points: [
                  <>If the hen lays eggs today, we are packing the <strong className="font-bold text-[#8b1a1a]">same day</strong> and delivered <strong className="font-bold text-[#8b1a1a]">tomorrow</strong> fresh to your home.</>,
                  <>Fast delivery with minimal handling to maintain quality.</>
                ],
              },
            ].map((card) => (
              <div
                key={card.title}
                className="relative bg-white rounded-3xl p-6 md:p-8 md:pl-32 border border-[#8b1a1a]/10 shadow-[0_8px_30px_rgba(139,26,26,0.06)] hover:shadow-[0_8px_30px_rgba(139,26,26,0.12)] transition-shadow duration-300 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 md:gap-0"
              >
                {/* Huge overlapping icon circle */}
                <div className="md:absolute md:-left-8 md:top-1/2 md:-translate-y-1/2 w-28 h-28 rounded-full bg-gradient-to-br from-[#8b1a1a] to-[#4a0909] border-[6px] border-[#d4af37] flex items-center justify-center shadow-xl shrink-0 z-10">
                  {card.icon}
                  {/* Decorative small leaves on the icon circle */}
                  <Leaf className="absolute -bottom-2 -right-2 w-8 h-8 text-green-700 bg-white rounded-full p-1 shadow-sm" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-serif text-[#8b1a1a] text-2xl md:text-3xl font-bold tracking-wide mb-6 flex items-center justify-center md:justify-start gap-3">
                    {card.title}
                    <Leaf className="w-6 h-6 text-green-700 hidden md:block" />
                  </h3>
                  <ul className="space-y-4 text-left w-full">
                    {card.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-[16px] text-[#444] font-medium leading-relaxed">
                        <CheckCircle className="w-6 h-6 mt-0.5 text-[#8b1a1a] shrink-0 fill-[#8b1a1a] stroke-white" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commitment grid */}
        <div className="bg-[radial-gradient(circle_at_center,_#6a1322_0%,_#350810_50%,_#150205_100%)] py-20 px-6 md:px-12 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
             <ShieldCheck className="w-96 h-96 text-white" />
          </div>

          <div className="max-w-5xl mx-auto relative z-10">
            <h3 className="font-serif text-3xl md:text-5xl text-white text-center mb-16 leading-tight">
              Trust the brand, Trust the Quality,<br />
              <span className="opacity-90 italic">Trust the freshness.</span>
            </h3>
            
            <div className="flex justify-center mb-16">
               <div className="inline-block bg-white/10 px-8 py-3 rounded-full border border-white/20 backdrop-blur-sm">
                  <p className="text-white text-center text-sm md:text-base tracking-wide uppercase">
                     <span className="font-bold">Our Commitment</span>
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { icon: <ShieldCheck className="w-8 h-8 text-[#8b1a1a]" />, label: "Brand Integrity" },
                { icon: <Award className="w-8 h-8 text-[#8b1a1a]" />, label: "Uncompromising Quality" },
                { icon: <Clock className="w-8 h-8 text-[#8b1a1a]" />, label: "Daily Freshness" },
                { icon: <MapPin className="w-8 h-8 text-[#8b1a1a]" />, label: "Community Focus" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center text-center gap-5 group cursor-default">
                  {/* Egg-shaped icon container */}
                  <div 
                    className="w-20 h-24 bg-[#faf6f0] flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.2)] group-hover:-translate-y-2 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] transition-all duration-300 relative border-[3px] border-[#d4af37]/30"
                    style={{ borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }}
                  >
                    <div className="transform -translate-y-0.5 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                  </div>
                  <span className="text-white/95 text-base font-medium tracking-wide">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Closing trust line */}
        <div className="bg-[#faf6f0] py-20 px-6 text-center">
          <p className="font-serif text-3xl md:text-4xl text-[#1a1a1a] mb-4">
            Experience the difference.
          </p>
          <p className="text-lg md:text-xl text-[#555] max-w-xl mx-auto leading-relaxed mb-8">
            Discover the true standard of freshness with BAB AL BARAKA.
          </p>
          <div className="inline-block border-y-2 border-[#8b1a1a] py-4 px-8">
             <p className="font-bold text-[#8b1a1a] text-xl md:text-2xl tracking-widest uppercase">
                A BARAKA in every egg.
             </p>
          </div>
        </div>

        {/* Products + Order Section */}
        <CartProvider>
          <ProductsSection />
          <OrderSection />
          <FloatingCartBar />
        </CartProvider>

        {/* Footer */}
        <footer className="bg-[#1a1a1a] py-12 px-6 md:px-12 text-center text-white/50 text-sm border-t border-white/10">
          <img src={logo.url} alt="Bab Al Baraka" className="h-16 w-16 mx-auto mb-4 rounded-full ring-1 ring-white/20" />
          <p className="font-serif text-xl text-white mb-2">Bab Al Baraka</p>
          <p>© {new Date().getFullYear()} — A gateway to blessings.</p>
        </footer>
      </div>


      {/* Fixed header */}
      <header className="fixed top-4 inset-x-3 md:inset-x-12 z-50 flex items-center justify-between px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full backdrop-blur-md bg-black/40 border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)] gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img src={logo.url} alt="Bab Al Baraka" className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full ring-1 ring-[#d4af37]/60 shrink-0" />
          <div className="leading-tight min-w-0">
            <div className="font-serif text-sm sm:text-lg md:text-xl text-white whitespace-nowrap">Bab Al Baraka</div>
            <div className="hidden sm:block text-[10px] tracking-[0.3em] uppercase text-white/50">Farm Fresh Eggs</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide text-white/80">
          <button onClick={() => scrollToScene(0)} className="hover:text-white transition cursor-pointer">Story</button>
          <button onClick={() => scrollToScene(1)} className="hover:text-white transition cursor-pointer">Craft</button>
          <button onClick={() => scrollToScene(4)} className="hover:text-white transition cursor-pointer">Visit</button>
        </nav>
        <button
          onClick={() => document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" })}
          className="text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase bg-[#8b1a1a] hover:bg-[#a02222] px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition text-white font-medium shadow-[0_4px_14px_rgba(139,26,26,0.5)] whitespace-nowrap shrink-0"
        >
          Order Now
        </button>
      </header>

      {/* Scroll progress dots */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {SCENES.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToScene(i)}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: i === active ? "white" : "rgba(255,255,255,0.3)",
              transform: i === active ? "scale(1.5)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
