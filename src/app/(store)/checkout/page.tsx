'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Truck, ShieldCheck, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment

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
        if (step === 1) {
            setStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsProcessing(true);
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        clearCart();
        router.push('/checkout/success');
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-mesh">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
                    <ArrowLeft className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-4xl font-black tracking-tighter mb-4 text-foreground">Your cart is empty.</h2>
                <Link href="/products" className="text-primary font-bold hover:underline mb-10">
                    Discover our collection
                </Link>
            </div>
        );
    }

    const taxAmount = total * 0.18;
    const grandTotal = total + taxAmount;

    return (
        <div className="min-h-screen bg-background pt-28 pb-20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-4 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                            <Sparkles className="w-3 h-3" />
                            <span>Secure Transaction</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter">
                            Finalize Order<span className="text-primary italic">.</span>
                        </h1>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center space-x-4 bg-muted/30 p-2 rounded-2xl border border-border/50">
                        <div className={cn("px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all", step === 1 ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground")}>
                            1. Shipping
                        </div>
                        <div className={cn("px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all", step === 2 ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground")}>
                            2. Payment
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-7">
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
                            {step === 1 ? (
                                <div className="bg-card p-10 rounded-[3rem] border border-border shadow-2xl shadow-black/[0.02] animate-in slide-in-from-left-8 duration-500">
                                    <div className="flex items-center space-x-4 pb-8 border-b border-border/50 mb-10">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                            <Truck className="w-6 h-6 text-primary" />
                                        </div>
                                        <h2 className="text-2xl font-black tracking-tighter uppercase">Delivery Location</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Full Name</label>
                                            <input
                                                required
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full bg-muted/30 px-6 py-4 rounded-2xl border border-border focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                                                placeholder="Recipient Name"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Email for Confirmation</label>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full bg-muted/30 px-6 py-4 rounded-2xl border border-border focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                                                placeholder="recipient@premium.com"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Street Address</label>
                                            <input
                                                required
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className="w-full bg-muted/30 px-6 py-4 rounded-2xl border border-border focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                                                placeholder="Avenue Road, House No. 12"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">City</label>
                                            <input
                                                required
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full bg-muted/30 px-6 py-4 rounded-2xl border border-border focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                                                placeholder="Bangalore"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">State</label>
                                                <input
                                                    required
                                                    type="text"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-muted/30 px-6 py-4 rounded-2xl border border-border focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                                                    placeholder="KA"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Zip</label>
                                                <input
                                                    required
                                                    type="text"
                                                    name="zip"
                                                    value={formData.zip}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-muted/30 px-6 py-4 rounded-2xl border border-border focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                                                    placeholder="560001"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full mt-12 bg-primary text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/25"
                                    >
                                        <span>Proceed to Payment</span>
                                        <CheckCircle2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-card p-10 rounded-[3rem] border border-border shadow-2xl shadow-black/[0.02] animate-in slide-in-from-right-8 duration-500">
                                    <div className="flex items-center justify-between pb-8 border-b border-border/50 mb-10">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
                                                <CreditCard className="w-6 h-6 text-accent" />
                                            </div>
                                            <h2 className="text-2xl font-black tracking-tighter uppercase">Vault Payment</h2>
                                        </div>
                                        <button type="button" onClick={() => setStep(1)} className="text-primary font-bold text-xs uppercase hover:underline">Edit Shipping</button>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Card Number</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground opacity-50" />
                                                <input
                                                    required
                                                    type="text"
                                                    name="cardNumber"
                                                    value={formData.cardNumber}
                                                    onChange={handleInputChange}
                                                    maxLength={19}
                                                    className="w-full bg-muted/30 pl-14 pr-6 py-4 rounded-2xl border border-border focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-mono tracking-[0.2em]"
                                                    placeholder="0000 0000 0000 0000"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Expiry Date</label>
                                                <input
                                                    required
                                                    type="text"
                                                    name="expiry"
                                                    value={formData.expiry}
                                                    onChange={handleInputChange}
                                                    maxLength={5}
                                                    className="w-full bg-muted/30 px-6 py-4 rounded-2xl border border-border focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-mono"
                                                    placeholder="MM/YY"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">CVC</label>
                                                <input
                                                    required
                                                    type="text"
                                                    name="cvc"
                                                    value={formData.cvc}
                                                    onChange={handleInputChange}
                                                    maxLength={3}
                                                    className="w-full bg-muted/30 px-6 py-4 rounded-2xl border border-border focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-mono"
                                                    placeholder="123"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full mt-12 bg-primary text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 disabled:opacity-50"
                                    >
                                        {isProcessing ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Finalize & Pay ₹{grandTotal.toLocaleString()}</span>
                                                <CheckCircle2 className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>

                                    <div className="mt-8 flex items-center justify-center space-x-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                        <span>Encrypted by Master Protocol</span>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Right Column: Mini Bag Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-card p-10 rounded-[3rem] border border-border shadow-2xl shadow-black/[0.02] sticky top-28">
                            <h2 className="text-xl font-black tracking-tighter uppercase pb-6 border-b border-border/50 mb-8">Selected Pieces</h2>

                            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-4 mb-10 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-6 group">
                                        <div className="w-20 h-20 bg-muted/50 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center p-3 transition-colors group-hover:bg-primary/5">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                        </div>
                                        <div className="flex-grow min-w-0 flex flex-col justify-center">
                                            <h3 className="text-sm font-black text-foreground truncate uppercase tracking-tight">{item.name}</h3>
                                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest opacity-60">{item.category}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-[10px] font-black text-muted-foreground opacity-40">QTY: {item.quantity}</span>
                                                <span className="text-sm font-black text-foreground">₹{(item.price * item.quantity).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-8 border-t border-border/50">
                                <div className="flex justify-between text-sm font-medium text-muted-foreground">
                                    <span>Basket Subtotal</span>
                                    <span className="text-foreground">₹{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-muted-foreground">
                                    <span>Premium Tax (18%)</span>
                                    <span className="text-foreground">₹{taxAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-muted-foreground">
                                    <span>Express Logistics</span>
                                    <span className="text-primary font-black animate-pulse">FREE</span>
                                </div>
                                <div className="pt-6 mt-2 border-t border-border flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Total Payable</span>
                                        <span className="text-4xl font-black text-foreground tracking-tighter italic">₹{grandTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
