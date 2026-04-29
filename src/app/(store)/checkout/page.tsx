'use client';

import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, ShieldCheck, Sparkles, CheckCircle2, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cn, generateWhatsAppUrl } from '@/lib/utils';
import { placeOrder } from '@/app/actions';

export const revalidate = 0;

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        notes: '',
        paymentMethod: 'whatsapp'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        
        try {
            const orderItems = items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
                prescription: item.prescription,
                coating: item.coating
            }));

            const result = await placeOrder({
                customerName: formData.name,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
                city: formData.city,
                state: formData.state,
                zip: formData.zip,
                items: orderItems,
                total: grandTotal,
                paymentMethod: 'WhatsApp Order (COD/UPI on Delivery)',
                paymentStatus: 'pending'
            });

            if (result.success) {
                const whatsappUrl = generateWhatsAppUrl({
                    customerName: formData.name,
                    customerPhone: formData.phone,
                    address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
                    items: orderItems,
                    total: grandTotal,
                    paymentMethod: 'Cash on Delivery / UPI on Delivery',
                    notes: formData.notes
                });
                
                clearCart();
                window.location.href = whatsappUrl;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
                    <ArrowLeft className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-4xl font-black tracking-tighter mb-4 text-foreground">Your cart is empty.</h2>
                <Link href="/products" className="text-primary font-bold hover:underline">
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
                <div className="mb-12">
                    <div className="flex items-center gap-4 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                        <Sparkles className="w-3 h-3" />
                        <span>Direct WhatsApp Ordering</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter">
                        Complete Order<span className="text-primary italic">.</span>
                    </h1>
                    <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest mt-4 opacity-70">
                        No online payment required. Pay on delivery.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Left Column: Form */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="bg-card p-10 rounded-[3rem] border border-border shadow-2xl shadow-black/[0.02] animate-in slide-in-from-left-8 duration-500">
                                <div className="flex items-center space-x-4 pb-8 border-b border-border/50 mb-10">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                        <Truck className="w-6 h-6 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tighter uppercase">Shipping Details</h2>
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
                                    <div className="md:col-span-1 space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Phone Number</label>
                                        <input
                                            required
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full bg-muted/30 px-6 py-4 rounded-2xl border border-border focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                    <div className="md:col-span-1 space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Email</label>
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
                                    <div className="md:col-span-2 space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Order Notes (Optional)</label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            className="w-full bg-muted/30 px-6 py-4 rounded-2xl border border-border focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium min-h-[100px] resize-none"
                                            placeholder="Any special instructions for delivery..."
                                        />
                                    </div>
                                </div>

                                <div className="mt-12 p-8 bg-green-500/5 rounded-3xl border border-green-500/20">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-green-500/10 rounded-xl">
                                            <MessageSquare className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-black uppercase tracking-tight text-green-900">Payment on Delivery</h3>
                                            <p className="text-[11px] font-bold text-green-700/80 leading-relaxed uppercase tracking-widest">
                                                Confirm your order on WhatsApp. Pay via *Cash or UPI* when your package arrives at your doorstep.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full mt-10 bg-green-600 text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-green-700 transition-all shadow-xl shadow-green-500/25 disabled:opacity-50"
                                >
                                    {isProcessing ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Place Order on WhatsApp</span>
                                            <CheckCircle2 className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                <div className="mt-8 flex items-center justify-center space-x-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    <span>Verified WhatsApp Merchant</span>
                                </div>
                            </div>
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
