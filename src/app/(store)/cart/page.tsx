'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Trash2, ArrowRight, ArrowLeft, ShoppingBag, Minus, Plus } from 'lucide-react';

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added any eyewear yet.</p>
                <Link
                    href="/products"
                    className="bg-charcoal text-white px-8 py-4 rounded-full font-bold hover:bg-neon-blue hover:text-charcoal transition-all shadow-lg hover:shadow-neon-blue/30 flex items-center"
                >
                    Start Shopping <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center mb-12">
                    <Link href="/products" className="text-gray-500 hover:text-charcoal transition-colors mr-4">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-4xl font-heading font-bold text-charcoal">Shopping Cart</h1>
                    <span className="ml-4 text-gray-400 text-lg font-medium">({items.length} items)</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {items.map((item) => (
                            <div key={item.id} className="group flex gap-6 p-6 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
                                <div className="w-32 h-32 bg-white rounded-xl overflow-hidden flex-shrink-0">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-contain p-2 mix-blend-multiply"
                                    />
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs font-bold text-neon-blue uppercase tracking-wider mb-1">{item.category}</p>
                                            <Link href={`/products/${item.id}`}>
                                                <h3 className="text-xl font-bold text-charcoal hover:text-neon-blue transition-colors">{item.name}</h3>
                                            </Link>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center space-x-3 bg-white rounded-full px-3 py-1 border border-gray-200">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-charcoal font-bold disabled:opacity-50"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-charcoal font-bold w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-charcoal font-bold"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="text-xl font-bold text-charcoal">
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-charcoal text-white p-8 rounded-3xl sticky top-24 shadow-2xl shadow-charcoal/20">
                            <h2 className="text-2xl font-bold mb-8">Order Summary</h2>

                            <div className="space-y-4 mb-8 text-gray-300">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-white font-medium">₹{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-neon-lime font-medium">Free</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax (18%)</span>
                                    <span className="text-white font-medium">₹{(total * 0.18).toLocaleString()}</span>
                                </div>
                                <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold text-white">
                                    <span>Total</span>
                                    <span>₹{(total * 1.18).toLocaleString()}</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="block w-full bg-neon-blue text-charcoal py-4 rounded-xl font-bold text-lg text-center hover:bg-white transition-colors shadow-lg hover:shadow-neon-blue/50"
                            >
                                Proceed to Checkout
                            </Link>

                            <p className="text-center text-xs text-gray-500 mt-4">
                                Secure Checkout powered by Stripe
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
