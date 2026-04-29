'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/db';

export interface CartItem extends Product {
    quantity: number;
    prescription?: string;
    coating?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: Product, prescription?: string, coating?: string) => void;
    addToCart: (product: Product, prescription?: string, coating?: string) => void;
    removeItem: (productId: string, prescription?: string, coating?: string) => void;
    updateQuantity: (productId: string, quantity: number, prescription?: string, coating?: string) => void;
    clearCart: () => void;
    total: number;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setItems(parsed);
                }
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addItem = (product: Product, prescription?: string, coating?: string) => {
        setItems((prev) => {
            const existing = prev.find((item) => 
                item.id === product.id && 
                item.prescription === prescription && 
                item.coating === coating
            );
            if (existing) {
                return prev.map((item) =>
                    (item.id === product.id && item.prescription === prescription && item.coating === coating) 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1, prescription, coating }];
        });
    };

    const addToCart = addItem;

    const removeItem = (productId: string, prescription?: string, coating?: string) => {
        setItems((prev) => prev.filter((item) => 
            !(item.id === productId && item.prescription === prescription && item.coating === coating)
        ));
    };

    const updateQuantity = (productId: string, quantity: number, prescription?: string, coating?: string) => {
        if (quantity < 1) return;
        setItems((prev) =>
            prev.map((item) =>
                (item.id === productId && item.prescription === prescription && item.coating === coating) 
                    ? { ...item, quantity } 
                    : item
            )
        );
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{ items, addItem, addToCart, removeItem, updateQuantity, clearCart, total, totalItems }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
