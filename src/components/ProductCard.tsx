'use client';

import { Product } from '@/lib/db';
import Link from 'next/link';
import AddToCartButton from './AddToCartButton';
import { Star } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-transparent hover:border-gray-100">
            {/* Image Container */}
            <Link href={`/products/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-50">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110 mix-blend-multiply"
                />

                {/* Quick Action Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-white/90 to-transparent pt-10">
                    <div className="flex justify-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-charcoal bg-neon-lime px-3 py-1 rounded-full">
                            Quick View
                        </span>
                    </div>
                </div>

                {/* Badges */}
                {product.stock < 5 && product.stock > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                        Low Stock
                    </span>
                )}
            </Link>

            {/* Content */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <p className="text-xs text-black uppercase tracking-wider font-medium mb-1">{product.category}</p>
                        <Link href={`/products/${product.id}`}>
                            <h3 className="text-lg font-bold text-black group-hover:text-neon-blue transition-colors line-clamp-1">
                                {product.name}
                            </h3>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-1 bg-gray-50 px-1.5 py-0.5 rounded text-xs font-medium text-black">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>4.8</span>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-black">
                        ₹{product.price.toLocaleString()}
                    </span>
                    <AddToCartButton product={product} />
                </div>
            </div>
        </div>
    );
}
