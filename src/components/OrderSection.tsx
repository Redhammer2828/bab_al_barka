import { useState } from "react";
import { CheckCircle, Truck, Package, CreditCard, Loader2, ShieldCheck } from "lucide-react";

export function OrderSection() {
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate network request
    setTimeout(() => {
      setIsProcessing(false);
      setOrderSuccess(true);
    }, 2000);
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
          <h2 className="font-serif text-4xl md:text-6xl text-[#1a1a1a] mb-4">Place Your Order</h2>
          <p className="text-lg text-[#555] max-w-2xl mx-auto">
            Get premium farm fresh eggs delivered directly to your doorstep anywhere in the UAE.
          </p>
        </div>

        <form onSubmit={handleOrder} className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left Column: Order Details */}
          <div className="space-y-8">
            {/* Product Selection */}
            <div className="bg-[#faf6f0] p-8 rounded-3xl border border-[#e8ddd0]">
              <h3 className="font-bold text-xl text-[#8b1a1a] mb-6 flex items-center gap-2">
                <Package className="w-5 h-5" /> Product Details
              </h3>
              
              <div className="flex items-center justify-between border-b border-[#e8ddd0] pb-6 mb-6">
                <div>
                  <h4 className="font-bold text-[#1a1a1a] text-lg">Premium Eggs Tray</h4>
                  <p className="text-sm text-[#555]">30 pieces / tray</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-2xl text-[#1a1a1a]">25 AED</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-[#444]">Quantity</span>
                <div className="flex items-center gap-4 bg-white border border-[#e8ddd0] rounded-full p-1">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full bg-[#faf6f0] hover:bg-[#e8ddd0] flex items-center justify-center text-[#1a1a1a] font-bold">-</button>
                  <span className="w-6 text-center font-bold text-[#1a1a1a]">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-full bg-[#faf6f0] hover:bg-[#e8ddd0] flex items-center justify-center text-[#1a1a1a] font-bold">+</button>
                </div>
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
                    <input required type="text" className="w-full border border-[#e8ddd0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8b1a1a]/20" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#444] mb-1">Last Name</label>
                    <input required type="text" className="w-full border border-[#e8ddd0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8b1a1a]/20" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#444] mb-1">Phone Number (UAE)</label>
                  <input required type="tel" className="w-full border border-[#e8ddd0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8b1a1a]/20" placeholder="+971 50 123 4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#444] mb-1">Delivery Address</label>
                  <textarea required rows={3} className="w-full border border-[#e8ddd0] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#8b1a1a]/20 resize-none" placeholder="Villa/Apartment, Building, Street, City" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Gateway */}
          <div className="space-y-8">
            <div className="bg-[#1a1a1a] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              {/* Decorative background element */}
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
                <div className="flex justify-between items-center mb-2 text-white/70">
                  <span>Subtotal</span>
                  <span>{quantity * 25} AED</span>
                </div>
                <div className="flex justify-between items-center mb-6 text-white/70">
                  <span>Delivery (Next Day)</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="font-medium text-lg">Total</span>
                  <span className="font-bold text-3xl text-white">{quantity * 25} AED</span>
                </div>
              </div>

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
                  `Pay ${quantity * 25} AED & Order Now`
                )}
              </button>
              <p className="text-center text-xs text-white/40 mt-4 flex items-center justify-center gap-1 relative z-10">
                <ShieldCheck className="w-3 h-3" /> Payments are secure and encrypted
              </p>
            </div>
          </div>
          
        </form>
      </div>
    </div>
  );
}
