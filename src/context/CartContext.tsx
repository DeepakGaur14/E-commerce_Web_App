import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  totalItems: number;
  totalValue: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(item: Omit<CartItem, 'quantity'>) {
    console.log('Adding to cart:', item);
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeFromCart(id: number) {
    console.log('Removing from cart:', id);
    setCartItems(prev => prev.filter(i => i.id !== id));
  }

  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalValue = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, totalItems, totalValue }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
