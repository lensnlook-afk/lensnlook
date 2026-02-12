'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Trash2, ArrowRight, ArrowLeft, ShoppingBag, Minus, Plus, ShieldCheck, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CartPage() {
    const { items, removeItem, updateQuantity, total } = useCart();
    const TAX_RATE = 0.18;
    const taxAmount = total * TAX_RATE;
    const grandTotal = total + taxAmount;

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-mesh">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-8 animate-float">
                    <ShoppingBag className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-4xl font-heading font-extrabold text-foreground mb-4 text-center">Your cart is empty</h2>
                <p className="text-muted-foreground mb-10 text-lg max-w-sm text-center">Elevate your vision today. Explore our latest designer frames.</p>
                <Link
                    href="/products"
                    className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 flex items-center group"
                >
                    Start Shopping
                    <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <Link href="/products" className="p-3 bg-secondary/5 rounded-2xl hover:bg-secondary/10 transition-colors group">
                                <ArrowLeft className="w-6 h-6 text-foreground group-hover:-translate-x-1 transition-transform" />
                            </Link>
                            <span className="text-primary font-bold uppercase tracking-widest text-sm">Shopping Bag</span>
                        </div>
                        <h1 className="text-5xl font-heading font-extrabold text-foreground">Checkout.</h1>
                    </div>
                    <div className="flex items-center space-x-2 bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10">
                        <span className="font-bold text-primary text-xl">{items.length}</span>
                        <span className="text-muted-foreground font-medium">Distinct pieces selected</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-8">
                        {items.map((item) => (
                            <div key={item.id} className="group relative flex flex-col sm:flex-row gap-8 p-8 bg-card rounded-[2.5rem] border border-border/50 hover:border-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/5">
                                <Link href={`/products/${item.id}`} className="w-full sm:w-48 aspect-square bg-secondary/5 rounded-3xl overflow-hidden flex-shrink-0 flex items-center justify-center p-6 group-hover:bg-primary/5 transition-colors">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                </Link>

                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">{item.category}</p>
                                            <Link href={`/products/${item.id}`}>
                                                <h3 className="text-2xl font-bold text-foreground hover:text-primary transition-colors leading-tight">{item.name}</h3>
                                            </Link>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-all p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl"
                                        >
                                            <Trash2 className="w-6 h-6" />
                                        </button>
                                    </div>

                                    <div className="mt-auto flex flex-wrap items-end justify-between gap-6">
                                        <div className="flex items-center bg-background border border-border rounded-2xl p-1.5 shadow-inner">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-primary/10 text-primary disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-5 h-5" />
                                            </button>
                                            <span className="text-foreground font-extrabold w-10 text-center text-lg">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-primary/10 text-primary transition-colors"
                                            >
                                                <Plus className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground font-medium mb-1">Total Price</p>
                                            <span className="text-3xl font-extrabold text-foreground tracking-tighter">
                                                ₹{(item.price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Additional Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                            <div className="p-6 bg-primary/5 border border-primary/10 rounded-3xl flex items-center gap-6">
                                <div className="w-14 h-14 bg-white dark:bg-black/20 rounded-2xl flex items-center justify-center shadow-lg">
                                    <ShieldCheck className="w-7 h-7 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Secure Purchase</h4>
                                    <p className="text-sm text-muted-foreground">Encrypted payments & quality guarantee.</p>
                                </div>
                            </div>
                            <div className="p-6 bg-accent/5 border border-accent/10 rounded-3xl flex items-center gap-6">
                                <div className="w-14 h-14 bg-white dark:bg-black/20 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Truck className="w-7 h-7 text-accent" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Express Fit</h4>
                                    <p className="text-sm text-muted-foreground">Free shipping on this order.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="bg-secondary p-10 rounded-[3rem] sticky top-28 shadow-2xl shadow-secondary/20 text-white">
                            <h2 className="text-3xl font-bold mb-10">Order Summary</h2>

                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between items-center pb-6 border-b border-white/5">
                                    <span className="text-gray-400 font-medium text-lg">Subtotal</span>
                                    <span className="text-white font-bold text-xl">₹{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 font-medium">Estimated Tax (18%)</span>
                                    <span className="text-white font-medium">₹{taxAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 font-medium">Shipping Fee</span>
                                    <span className="text-accent font-bold uppercase tracking-widest text-xs">Complimentary</span>
                                </div>
                                <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                                    <div className="space-y-1">
                                        <span className="text-gray-400 font-medium uppercase tracking-widest text-xs">Total Amount</span>
                                        <p className="text-base text-gray-500 line-through opacity-50">₹{(grandTotal + 500).toLocaleString()}</p>
                                    </div>
                                    <span className="text-4xl font-extrabold text-white tracking-tighter">
                                        ₹{grandTotal.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="group w-full bg-primary text-white py-6 rounded-2xl font-bold text-xl text-center hover:bg-white hover:text-primary transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                            >
                                Fast Checkout
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </Link>

                            <div className="mt-8 flex items-center justify-center gap-4 opacity-30 grayscale">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="Paypal" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
