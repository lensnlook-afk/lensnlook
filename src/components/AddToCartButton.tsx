'use client';

import { Product } from '@/lib/db';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function AddToCartButton({ product, className }: { product: Product, className?: string }) {
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    if (product.stock === 0) {
        return (
            <button disabled className={cn("w-full py-4 bg-gray-100 text-gray-400 rounded-full font-bold cursor-not-allowed", className)}>
                Sold Out
            </button>
        );
    }

    return (
        <button
            onClick={handleAddToCart}
            className={cn(
                "w-full py-4 rounded-full font-bold text-lg flex items-center justify-center space-x-2 transition-all duration-300",
                isAdded
                    ? "bg-green-500 text-white shadow-green-200"
                    : "bg-charcoal text-white hover:bg-neon-blue hover:text-charcoal hover:shadow-xl hover:shadow-neon-blue/20",
                className
            )}
        >
            {isAdded ? <Check className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
            <span>{isAdded ? 'Added to Cart' : 'Add to Cart'}</span>
        </button>
    );
}
