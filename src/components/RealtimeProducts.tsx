"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/db';
import ProductCard from './ProductCard';

interface RealtimeProductsProps {
    initialProducts: Product[];
}

export default function RealtimeProducts({ initialProducts }: RealtimeProductsProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts);

    useEffect(() => {
        // Update state if initialProducts changes (e.g. navigation, search)
        setProducts(initialProducts);
    }, [initialProducts]);

    useEffect(() => {
        if (!supabase) return;

        const channel = supabase
            .channel('public:products')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'products' },
                (payload) => {
                    console.log('Realtime product update:', payload);
                    
                    if (payload.eventType === 'INSERT') {
                        setProducts((prev) => {
                            // Check if product already exists to avoid duplicates
                            if (prev.some((p) => p.id === payload.new.id)) return prev;
                            return [payload.new as Product, ...prev];
                        });
                    }
                    
                    if (payload.eventType === 'UPDATE') {
                        setProducts((prev) => 
                            prev.map((p) => p.id === payload.new.id ? (payload.new as Product) : p)
                        );
                    }
                    
                    if (payload.eventType === 'DELETE') {
                        setProducts((prev) => 
                            prev.filter((p) => p.id !== payload.old.id)
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
                <div key={product.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 50}ms` }}>
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
}
