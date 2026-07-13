import { useEffect, useState } from "react";
import { ShoppingBasket } from "lucide-react";
import { useCart } from "../lib/cart-context";

export function FloatingCartBar() {
  const { cartCount, subtotal } = useCart();
  const [hidden, setHidden] = useState(false);

  // Hide once the basket/payment section scrolls into view — it's redundant there
  // and on mobile it overlaps the payment form otherwise.
  useEffect(() => {
    const target = document.getElementById("order-section");
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { threshold: 0.15 });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  if (cartCount === 0 || hidden) return null;

  return (
    <div className="fixed bottom-5 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <button
        onClick={() => document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" })}
        className="pointer-events-auto flex items-center gap-2 sm:gap-4 bg-[#1a1a1a] text-white pl-4 sm:pl-5 pr-2 py-2 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.35)] hover:bg-[#2a2a2a] transition-all animate-[cartBarIn_0.4s_cubic-bezier(.22,1,.36,1)] max-w-full"
      >
        <div className="relative shrink-0">
          <ShoppingBasket className="w-5 h-5" />
          <span className="absolute -top-2 -right-2 bg-[#8b1a1a] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        </div>
        <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
          {cartCount} item{cartCount > 1 ? "s" : ""} · {subtotal} AED
        </span>
        <span className="bg-[#8b1a1a] hover:bg-[#a02222] text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-full transition-colors whitespace-nowrap shrink-0">
          Checkout
        </span>
      </button>
      <style>{`
        @keyframes cartBarIn {
          from { opacity: 0; transform: translateY(16px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
