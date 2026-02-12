import { getProduct } from '@/lib/db';
import AddToCartButton from '@/components/AddToCartButton';
import { notFound } from 'next/navigation';
import { Star, Shield, Truck, Info } from 'lucide-react';
import Link from 'next/link';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="bg-white min-h-screen pt-20">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
                    {/* Left: Image Section */}
                    <div className="relative bg-gray-50 flex items-center justify-center p-10 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-gray-50 to-gray-100" />
                        <img
                            src={product.image}
                            alt={product.name}
                            className="relative w-full max-w-lg object-contain drop-shadow-2xl animate-in fade-in zoom-in duration-700"
                        />
                        {/* Floating Badge */}
                        <div className="absolute top-8 left-8">
                            <span className="bg-charcoal text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                                {product.category}
                            </span>
                        </div>
                    </div>

                    {/* Right: Details Section */}
                    <div className="p-8 lg:p-16 flex flex-col justify-center">
                        <div className="mb-8">
                            <h1 className="text-4xl lg:text-5xl font-heading font-bold text-charcoal mb-4 leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="flex items-center text-yellow-400">
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current text-gray-300" />
                                </div>
                                <span className="text-gray-500 text-sm font-medium">4.8 (120 Reviews)</span>
                            </div>
                            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                {product.description}
                            </p>
                            <div className="text-3xl font-bold text-charcoal mb-8">
                                ₹{product.price.toLocaleString()}
                            </div>
                        </div>

                        {/* Lens Selector (Mock) */}
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-charcoal">Select Lens Type</h3>
                                <button className="text-neon-blue text-sm font-medium flex items-center hover:underline">
                                    <Info className="w-4 h-4 mr-1" /> Lens Guide
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <button className="border-2 border-neon-blue bg-neon-blue/5 p-4 rounded-xl text-left transition-all">
                                    <span className="block font-bold text-charcoal text-sm mb-1">Anti-Glare</span>
                                    <span className="block text-xs text-gray-500">Included</span>
                                </button>
                                <button className="border border-gray-200 hover:border-gray-300 p-4 rounded-xl text-left transition-all">
                                    <span className="block font-bold text-charcoal text-sm mb-1">Blue Light</span>
                                    <span className="block text-xs text-gray-500">+ ₹500</span>
                                </button>
                                <button className="border border-gray-200 hover:border-gray-300 p-4 rounded-xl text-left transition-all">
                                    <span className="block font-bold text-charcoal text-sm mb-1">Photochromic</span>
                                    <span className="block text-xs text-gray-500">+ ₹1000</span>
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 mb-12">
                            <div className="flex-1">
                                <AddToCartButton product={product} />
                            </div>
                            <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-6 border-t border-gray-100 pt-8">
                            <div className="flex items-center space-x-3">
                                <Shield className="w-5 h-5 text-neon-blue" />
                                <span className="text-sm font-medium text-gray-600">1 Year Warranty</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Truck className="w-5 h-5 text-neon-blue" />
                                <span className="text-sm font-medium text-gray-600">Free Shipping</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
