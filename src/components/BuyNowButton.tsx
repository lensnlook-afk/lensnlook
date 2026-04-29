'use client';

import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/db';

export default function BuyNowButton({ product, prescription, coating }: { product: Product, prescription?: string, coating?: string }) {
    const router = useRouter();
    const { addToCart, items } = useCart();

    const handleBuyNow = () => {
        // If product is not already in cart with these exact options, add it
        const existingItem = items.find(item => 
            item.id === product.id && 
            item.prescription === prescription && 
            item.coating === coating
        );
        
        if (!existingItem) {
            addToCart(product, prescription, coating);
        }
        router.push('/checkout');
    };

    return (
        <button
            onClick={handleBuyNow}
            className="px-10 py-6 bg-foreground text-background rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center space-x-3 w-full sm:w-auto"
        >
            <span>Buy Now</span>
            <ChevronRight className="w-5 h-5" />
        </button>
    );
}
