import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase, type Product } from "./supabase";

type CartLine = { product: Product; quantity: number };

type CartContextValue = {
  products: Product[];
  productsLoading: boolean;
  cart: Record<string, number>;
  cartLines: CartLine[];
  cartCount: number;
  subtotal: number;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [cart, setCart] = useState<Record<string, number>>({});

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        setProducts((data as Product[]) ?? []);
        setProductsLoading(false);
      });
  }, []);

  const addToCart = (productId: string) => {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] ?? 0) + 1 }));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const setQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: quantity };
    });
  };

  const clearCart = () => setCart({});

  const cartLines = useMemo<CartLine[]>(
    () =>
      Object.entries(cart)
        .map(([productId, quantity]) => {
          const product = products.find((p) => p.id === productId);
          return product ? { product, quantity } : null;
        })
        .filter((line): line is CartLine => line !== null),
    [cart, products],
  );

  const cartCount = cartLines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = cartLines.reduce((sum, l) => sum + l.quantity * l.product.unit_price_b2c, 0);

  return (
    <CartContext.Provider
      value={{ products, productsLoading, cart, cartLines, cartCount, subtotal, addToCart, removeFromCart, setQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
