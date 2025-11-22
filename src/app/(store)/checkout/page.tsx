'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, Lock } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        clearCart();
        router.push('/checkout/success');
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-charcoal mb-4">Your cart is empty</h2>
                    <Link href="/products" className="text-neon-blue hover:underline">
                        Return to Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link href="/cart" className="text-gray-500 hover:text-charcoal flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Forms */}
                    <div className="space-y-8">
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                            {/* Shipping Information */}
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex items-center mb-6">
                                    <div className="w-10 h-10 rounded-full bg-neon-blue/10 flex items-center justify-center mr-4">
                                        <Truck className="w-5 h-5 text-neon-blue" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-charcoal">Shipping Details</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                        <input
                                            required
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none transition-all"
                                            placeholder="123 Main St, Apt 4B"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                        <input
                                            required
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none transition-all"
                                            placeholder="New York"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                        <input
                                            required
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none transition-all"
                                            placeholder="NY"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                                        <input
                                            required
                                            type="text"
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none transition-all"
                                            placeholder="10001"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex items-center mb-6">
                                    <div className="w-10 h-10 rounded-full bg-neon-lime/10 flex items-center justify-center mr-4">
                                        <CreditCard className="w-5 h-5 text-charcoal" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-charcoal">Payment Method</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                                        <div className="relative">
                                            <input
                                                required
                                                type="text"
                                                name="cardNumber"
                                                value={formData.cardNumber}
                                                onChange={handleInputChange}
                                                maxLength={19}
                                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none transition-all font-mono"
                                                placeholder="0000 0000 0000 0000"
                                            />
                                            <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                                            <input
                                                required
                                                type="text"
                                                name="expiry"
                                                value={formData.expiry}
                                                onChange={handleInputChange}
                                                maxLength={5}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none transition-all font-mono"
                                                placeholder="MM/YY"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                                            <input
                                                required
                                                type="text"
                                                name="cvc"
                                                value={formData.cvc}
                                                onChange={handleInputChange}
                                                maxLength={3}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20 outline-none transition-all font-mono"
                                                placeholder="123"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
                                    <ShieldCheck className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                    <p>Your payment information is encrypted and secure. This is a mock payment form for demonstration.</p>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <div className="bg-charcoal text-white p-8 rounded-3xl shadow-2xl shadow-charcoal/20">
                            <h2 className="text-2xl font-bold mb-8">Order Summary</h2>

                            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-sm truncate">{item.name}</h3>
                                            <p className="text-gray-400 text-xs">{item.category}</p>
                                            <div className="flex justify-between mt-1">
                                                <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                                                <span className="text-sm font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-6 space-y-3 text-gray-300 mb-8">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span className="text-white">₹{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-neon-lime">Free</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax (18%)</span>
                                    <span className="text-white">₹{(total * 0.18).toLocaleString()}</span>
                                </div>
                                <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold text-white">
                                    <span>Total</span>
                                    <span>₹{(total * 1.18).toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={isProcessing}
                                className="w-full bg-neon-blue text-charcoal py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors shadow-lg hover:shadow-neon-blue/50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-charcoal border-t-transparent rounded-full animate-spin mr-2" />
                                        Processing...
                                    </>
                                ) : (
                                    `Pay ₹${(total * 1.18).toLocaleString()}`
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
