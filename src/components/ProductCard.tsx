'use client';

import { Product } from '@/lib/db';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';
import { Star, Eye, Zap } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const isLowStock = product.stock < 10 && product.stock > 0;

    return (
        <div className="group relative bg-card rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,186,198,0.15)] border border-border/50 hover:border-primary/20 animate-scale-in">
            {/* Image Container */}
            <Link href={`/products/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-50/50 dark:bg-white/5">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-110 mix-blend-multiply dark:mix-blend-normal"
                />

                {/* Glass Quick Action Overlay */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-white/90 dark:bg-black/80 p-3 rounded-full shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <Eye className="w-5 h-5 text-primary" />
                    </div>
                </div>

                {/* Premium Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {isLowStock && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg shadow-red-500/20 flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-white" />
                            Low Stock
                        </span>
                    )}
                    <span className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg shadow-primary/20">
                        New Arrival
                    </span>
                </div>
            </Link>

            {/* Content Section */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                        <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em]">{product.category}</p>
                        <Link href={`/products/${product.id}`}>
                            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-tight">
                                {product.name}
                            </h3>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-1 bg-primary/5 dark:bg-primary/20 px-2 py-1 rounded-lg text-[10px] font-bold text-primary border border-primary/10">
                        <Star className="w-3 h-3 fill-primary text-primary" />
                        <span>4.8</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-400 line-through opacity-50 font-medium">₹{(product.price * 1.5).toLocaleString()}</span>
                        <span className="text-xl font-extrabold text-foreground tracking-tight">
                            ₹{product.price.toLocaleString()}
                        </span>
                    </div>
                    <AddToCartButton product={product} />
                </div>
            </div>
        </div>
    );
}
