import { useState } from "react";
import { CheckCircle, Truck, Package, CreditCard, Loader2, ShieldCheck, Minus, Plus, X, ShoppingBasket } from "lucide-react";
import { useCart } from "../lib/cart-context";
import { supabase } from "../lib/supabase";

export function OrderSection() {
  const { cartLines, cartCount, subtotal, setQuantity, removeFromCart, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError("");
    setIsProcessing(true);
    try {
      const { error } = await supabase.rpc("submit_website_order", {
        p_first_name: firstName,
        p_last_name: lastName,
        p_phone: phone,
        p_address: address,
        p_items: cartLines.map(({ product, quantity }) => ({ product_id: product.id, quantity })),
      });
      if (error) throw error;
      clearCart();
      setOrderSuccess(true);
    } catch (err) {
      setOrderError(err instanceof Error ? err.message : "Something went wrong placing your order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="bg-white py-24 px-6 text-center border-t border-[#e8ddd0]">
        <div className="max-w-2xl mx-auto bg-[#faf6f0] p-12 rounded-3xl border border-[#e8ddd0] shadow-lg">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-[#1a1a1a] mb-4">Order Confirmed</h2>
          <p className="text-[#555] text-lg mb-8">
            Thank you for choosing Bab Al Baraka! Your freshly packed eggs are being prepared and will be delivered tomorrow.
          </p>
          <button
            onClick={() => setOrderSuccess(false)}
            className="bg-[#8b1a1a] text-white px-8 py-3 rounded-full hover:bg-[#6e1515] transition-colors"
          >
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="order-section" className="bg-white py-24 px-6 md:px-12 border-t border-[#e8ddd0]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-6xl text-[#1a1a1a] mb-4">Your Basket</h2>
          <p className="text-lg text-[#555] max-w-2xl mx-auto">
            Review your basket and get it delivered fresh to your doorstep anywhere in the UAE.
          </p>
        </div>

        {cartLines.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 px-8 bg-[#faf6f0] rounded-3xl border border-[#e8ddd0]">
            <ShoppingBasket className="w-10 h-10 text-[#c9b8a8] mx-auto mb-4" />
            <p className="text-[#777] mb-6">Your basket is empty. Add products above to get started.</p>
            <button
              type="button"
              onClick={() => document.querySelector("[data-products-section]")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-[#8b1a1a] hover:bg-[#a02222] text-white text-sm font-medium px-6 py-3 rounded-full transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <form onSubmit={handleOrder} className="grid lg:grid-cols-2 gap-12 lg:gap-24">
            {/* Left Column: Order Details */}
            <div className="space-y-8">
              {/* Cart Lines */}
              <div className="bg-[#faf6f0] p-8 rounded-3xl border border-[#e8ddd0]">
                <h3 className="font-bold text-xl text-[#8b1a1a] mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5" /> Basket ({cartCount})
                </h3>

                <div className="space-y-4">
                  {cartLines.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 bg-white rounded-2xl border border-[#e8ddd0] p-4"
                    >
                      <div className="w-16 h-16 rounded-xl bg-[#f5efe6] overflow-hidden shrink-0">
                        {product.image_url && (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#1a1a1a] text-sm truncate">{product.name}</h4>
                        <p className="text-sm text-[#8b1a1a] font-semibold">{product.unit_price_b2c} AED</p>
                      </div>
                      <div className="flex items-center gap-2 bg-[#faf6f0] border border-[#e8ddd0] rounded-full p-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setQuantity(product.id, quantity - 1)}
                          className="w-7 h-7 rounded-full bg-white hover:bg-[#e8ddd0] flex items-center justify-center text-[#1a1a1a]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center text-sm font-bold text-[#1a1a1a]">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(product.id, quantity + 1)}
                          className="w-7 h-7 rounded-full bg-white hover:bg-[#e8ddd0] flex items-center justify-center text-[#1a1a1a]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-[#bbb] hover:text-[#8b1a1a] transition shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white p-8 rounded-3xl border border-[#e8ddd0] shadow-sm">
                <h3 className="font-bold text-xl text-[#1a1a1a] mb-6 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#8b1a1a]" /> Delivery Information
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#444] mb-1">First Name</label>
                      <input required type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border border-[#e8ddd0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8b1a1a]/20" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#444] mb-1">Last Name</label>
                      <input required type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border border-[#e8ddd0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8b1a1a]/20" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#444] mb-1">Phone Number (UAE)</label>
                    <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-[#e8ddd0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8b1a1a]/20" placeholder="+971 50 123 4567" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#444] mb-1">Delivery Address</label>
                    <textarea required rows={3} value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-[#e8ddd0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8b1a1a]/20 resize-none" placeholder="Villa/Apartment, Building, Street, City" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Payment Gateway */}
            <div className="space-y-8">
              <div className="bg-[#1a1a1a] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <h3 className="font-bold text-xl mb-6 flex items-center gap-2 relative z-10">
                  <CreditCard className="w-5 h-5 text-white/80" /> Secure Payment
                </h3>

                <div className="space-y-6 relative z-10">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Card Number</label>
                    <div className="relative">
                      <input required type="text" maxLength={19} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30 transition-shadow" placeholder="0000 0000 0000 0000" />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                        <div className="w-8 h-5 bg-white/20 rounded-sm" />
                        <div className="w-8 h-5 bg-white/20 rounded-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">Expiry Date</label>
                      <input required type="text" maxLength={5} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/60 mb-2">CVC</label>
                      <input required type="text" maxLength={3} className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="123" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">Name on Card</label>
                    <input required type="text" className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/30" placeholder="John Doe" />
                  </div>
                </div>

                {/* Order Summary Total */}
                <div className="mt-10 pt-6 border-t border-white/10 relative z-10">
                  <div className="space-y-1.5 mb-4">
                    {cartLines.map(({ product, quantity }) => (
                      <div key={product.id} className="flex justify-between items-center text-sm text-white/50">
                        <span className="truncate pr-2">{product.name} × {quantity}</span>
                        <span className="shrink-0">{product.unit_price_b2c * quantity} AED</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mb-2 text-white/70 pt-3 border-t border-white/10">
                    <span>Subtotal</span>
                    <span>{subtotal} AED</span>
                  </div>
                  <div className="flex justify-between items-center mb-6 text-white/70">
                    <span>Delivery (Next Day)</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="font-medium text-lg">Total</span>
                    <span className="font-bold text-3xl text-white">{subtotal} AED</span>
                  </div>
                </div>

                {orderError && (
                  <p className="text-center text-sm text-red-300 bg-red-950/40 border border-red-500/30 rounded-xl px-4 py-2.5 mt-6 relative z-10">
                    {orderError}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-8 bg-gradient-to-b from-[#ffffff] via-[#e2e2e2] to-[#c4c4c4] border border-[#a0a0a0] text-[#1a1a1a] font-bold text-lg py-4 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,1),0_5px_15px_rgba(255,255,255,0.1)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,1),0_0_25px_rgba(255,255,255,0.3)] hover:brightness-110 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed relative z-10"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" /> Processing Payment...
                    </>
                  ) : (
                    `Pay ${subtotal} AED & Order Now`
                  )}
                </button>
                <p className="text-center text-xs text-white/40 mt-4 flex items-center justify-center gap-1 relative z-10">
                  <ShieldCheck className="w-3 h-3" /> Payments are secure and encrypted
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
