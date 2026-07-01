import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bird, Package, Truck, ShieldCheck, Award, Clock, MapPin, CheckCircle, Leaf } from "lucide-react";
import { EggIcon } from "../components/EggIcon";
import { EggLoader } from "../components/EggLoader";
import { OrderSection } from "../components/OrderSection";


const ChickenIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19,8.5C18.6,8.5 18.2,8.6 17.8,8.8C18,8.2 18,7.6 17.8,7C17.3,5.5 15.9,4.4 14.2,4.1C13.2,4 12.3,4.2 11.5,4.8L11.3,4.1C11.1,3.4 10.4,3 9.7,3H9V4H9.7L10.3,6.2L10,6.5C9,7.5 8.4,8.8 8.1,10.2C7.3,10.1 6.5,10.2 5.8,10.6L5.3,9.7L4.4,10.2L4.9,11C4.4,11.5 4,12.2 4,13C4,14.6 5.3,16 7,16V17H5V19H7V21H9V19H11V21H13V19H15V17H13V16C13.6,16 14.1,15.8 14.6,15.6C16.4,15 17.6,13.4 17.9,11.5C18.6,11.3 19.1,10.9 19.5,10.3C19.8,9.8 20,9.2 20,8.5C20,8 19.6,8.5 19,8.5M15.5,7C15.8,7 16,7.2 16,7.5C16,7.8 15.8,8 15.5,8C15.2,8 15,7.8 15,7.5C15,7.2 15.2,7 15.5,7Z" />
  </svg>
);

const logo = { url: "/Logo.png" };

const SCENES = [
  {
    src: "/hero1.mp4",
    loop: true,
    num: "01", eyebrow: "Bab Al Baraka",
    title: "A Gateway to Blessings",
    body: "Step through the door — where heritage greets hospitality and every detail is poured with intention.",
    align: "right" as const, pos: "bottom" as const,
  },
  {
    src: "/hero23.mp4",
    loop: false,
    num: "02", eyebrow: "Our Craft",
    title: "Rooted in Tradition",
    body: "Recipes passed down through generations, prepared with patience and the finest ingredients.",
    align: "right" as const, pos: "bottom" as const,
  },
  {
    src: "/hero4.mp4",
    loop: false,
    num: "03", eyebrow: "Signature Moments",
    title: "Crafted to Delight",
    body: "Dishes that honour their origin and surprise the senses, presented with quiet artistry.",
    align: "right" as const, pos: "top" as const,
  },
  {
    src: "/hero5.mp4",
    loop: false,
    num: "04", eyebrow: "Hospitality",
    title: "Where Guests Become Family",
    body: "Generosity is our oldest tradition. Every table tells a story of welcome and care.",
    align: "right" as const, pos: "bottom" as const,
  },
  {
    src: "/hero6.mp4",
    loop: false,
    num: "05", eyebrow: "Visit Us",
    title: "Open the Door",
    body: "Reserve a seat at our table and let the journey begin.",
    align: "center" as const, pos: "bottom" as const,
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
function TextOverlay({ scene }: { scene: typeof SCENES[0] }) {
  const posClass = scene.pos === "top" ? "top-28" : "bottom-20";
  const alignClass =
    scene.align === "right"
      ? "right-0 items-end text-right px-8 md:px-14 max-w-lg"
      : scene.align === "left"
        ? "left-0 items-start text-left px-8 md:px-14 max-w-lg"
        : "inset-x-0 mx-auto items-center text-center px-8 max-w-xl";

  return (
    <div
      className={`absolute z-10 flex flex-col ${posClass} ${alignClass}`}
      style={{ animation: "fadeSlideUp 0.7s cubic-bezier(.22,1,.36,1) forwards" }}
    >
      <div className="text-[11px] tracking-[0.4em] uppercase text-white/60 mb-3">
        {scene.num} — {scene.eyebrow}
      </div>
      <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl leading-[1.05] mb-4 text-white">
        {scene.title}
      </h2>
      <p className="text-sm md:text-base text-white/80 leading-relaxed">
        {scene.body}
      </p>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [active, setActive] = useState(0);
  const videoRefs    = useRef<(HTMLVideoElement | null)[]>([]);
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Switch video when active changes
  useEffect(() => {
    videoRefs.current.forEach((vid, i) => {
      if (!vid) return;
      if (i === active) {
        if (vid.preload === "none") { vid.preload = "auto"; vid.load(); }
        vid.currentTime = 0;
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, [active]);

  // Sentinel observers — each section is 100vh, threshold 0.5 fires dead-center
  useEffect(() => {
    const ios = sentinelRefs.current.map((el, i) => {
      if (!el) return null;
      const io = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(i); },
        { root: scrollContainerRef.current, threshold: 0.5 }
      );
      io.observe(el);
      return io;
    });
    return () => ios.forEach(io => io?.disconnect());
  }, []);

  return (
    <div ref={scrollContainerRef} className="h-[100dvh] w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory relative">
      {isLoading && <EggLoader onComplete={() => setIsLoading(false)} />}
      
      {/* Inject keyframe once */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Fixed full-screen canvas */}
      <div className="fixed inset-0 z-0 bg-[#2a0003] h-[100dvh] w-full">
        {SCENES.map((scene, i) => (
          <video
            key={i}
            ref={el => { videoRefs.current[i] = el; }}
            src={scene.src}
            muted
            playsInline
            loop={scene.loop}
            preload={i === 0 ? "auto" : "none"}
            autoPlay={i === 0}
            className="absolute inset-0 h-full w-full object-contain scale-[1.35] md:scale-100 md:object-cover transition-transform duration-700"
            style={{
              opacity: i === active ? 1 : 0,
              transition: "opacity 0.7s ease",
            }}
          />
        ))}

        {/* Massive top and bottom gradients to aggressively hide the video's top and bottom separation lines */}
        <div className="md:hidden absolute top-0 inset-x-0 h-[45dvh] z-10 bg-gradient-to-b from-[#2a0003] from-40% via-[#2a0003]/90 to-transparent pointer-events-none" />
        <div className="md:hidden absolute bottom-0 inset-x-0 h-[50dvh] z-10 bg-gradient-to-t from-[#2a0003] from-40% via-[#2a0003]/90 to-transparent pointer-events-none" />

        {/* Text — key=active forces remount & replays animation */}
        <TextOverlay key={active} scene={SCENES[active]} />
      </div>

      {/* Scrollable sentinels — one per scene, each 100vh */}
      <div className="relative z-10" style={{ height: `${SCENES.length * 100}dvh` }}>
        {SCENES.map((_, i) => (
          <div
            key={i}
            ref={el => { sentinelRefs.current[i] = el; }}
            className="h-[100dvh] w-full snap-center"
          />
        ))}
      </div>

      {/* ── Farm Fresh Section ───────────────────────────────────────────── */}
      <div className="relative z-10 bg-[#faf6f0] overflow-hidden snap-start">
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
        <div className="bg-[#240a0e] py-24 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-radial from-[#5c1322]/40 to-transparent blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          {/* Why Choose heading */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center mb-16">
             <h4 className="font-sans text-[#b3a3a5] text-xs font-bold tracking-[0.3em] uppercase mb-4">The Difference</h4>
             <h2 className="font-serif text-4xl md:text-5xl text-white mb-2 tracking-wide">
                Why Choose <span className="italic font-light text-[#f5e6d3] relative whitespace-nowrap">Bab Al Baraka<span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[120%] h-[1px] bg-gradient-to-r from-transparent via-[#f5e6d3]/40 to-transparent"></span></span>
             </h2>
          </div>

          {/* Three feature cards */}
          <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                icon: <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
                title: "Farm Fresh Quality",
                points: ["Collected fresh daily", "Premium grade", "Quality checked"],
              },
              {
                icon: <ShieldCheck className="w-5 h-5 text-white/70" strokeWidth={1.5} />,
                title: "Hygienic Packaging",
                points: ["Food-grade trays", "Same-day packing", "Minimal handling"],
              },
              {
                icon: <Truck className="w-5 h-5 text-white/70" strokeWidth={1.5} />,
                title: "Fresh Delivery",
                points: ["Packed today", "Delivered tomorrow", "Maintains freshness"],
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-[#2d1419] rounded-3xl p-8 border border-white/5 hover:bg-[#361a20] transition-colors duration-300 flex flex-col"
              >
                <div className="w-12 h-12 rounded-[14px] bg-[#422226] border border-white/5 flex items-center justify-center mb-6 shadow-inner">
                  {card.icon}
                </div>
                <h3 className="font-serif text-white text-2xl tracking-wide mb-6">
                  {card.title}
                </h3>
                <ul className="space-y-4">
                  {card.points.map((pt, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-[15px] text-[#b3a3a5] font-light">
                      <svg className="w-4 h-4 text-white/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {pt}
                    </li>
                  ))}
                </ul>
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

        {/* Order Section */}
        <OrderSection />

        {/* Footer */}
        <footer className="bg-[#1a1a1a] py-12 px-6 md:px-12 text-center text-white/50 text-sm border-t border-white/10">
          <img src={logo.url} alt="Bab Al Baraka" className="h-16 w-16 mx-auto mb-4 rounded-full ring-1 ring-white/20" />
          <p className="font-serif text-xl text-white mb-2">Bab Al Baraka</p>
          <p>© {new Date().getFullYear()} — A gateway to blessings.</p>
        </footer>
      </div>


      {/* Fixed header */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-md bg-black/20">
        <div className="flex items-center gap-3">
          <img src={logo.url} alt="Bab Al Baraka" className="h-12 w-12 rounded-full ring-1 ring-white/20" />
          <div className="hidden sm:block leading-tight">
            <div className="font-serif text-xl text-white">Bab Al Baraka</div>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide text-white/80">
          <a href="#" onClick={() => setActive(0)} className="hover:text-white transition cursor-pointer">Story</a>
          <a href="#" onClick={() => setActive(1)} className="hover:text-white transition cursor-pointer">Craft</a>
          <a href="#" onClick={() => setActive(4)} className="hover:text-white transition cursor-pointer">Visit</a>
        </nav>
        <button
          onClick={() => setActive(4)}
          className="text-xs tracking-[0.2em] uppercase border border-white/40 px-4 py-2 rounded-full hover:bg-white hover:text-black transition text-white"
        >
          Reserve
        </button>
      </header>

      {/* Scroll progress dots */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {SCENES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setActive(i);
              const topPos = sentinelRefs.current[i]?.offsetTop || (i * window.innerHeight);
              scrollContainerRef.current?.scrollTo({ top: topPos, behavior: "smooth" });
            }}
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
