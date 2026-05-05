'use client';

import { updateOrderStatusAction } from '@/app/admin/actions';
import { Order } from '@/lib/db';
import { X, Package, Truck, CheckCircle2, Clock, XCircle, User, Mail, Phone, MapPin, CreditCard, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OrderDetailsModalProps {
    order: any; // Using any for now to match the Order type which we'll import correctly
    onClose: () => void;
    onUpdate?: () => void;
}

export default function OrderDetailsModal({ order, onClose, onUpdate }: OrderDetailsModalProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusUpdate = async (newStatus: any) => {
        setIsUpdating(true);
        try {
            await updateOrderStatusAction(order.id, newStatus);
            if (onUpdate) onUpdate();
        } catch (error) {
            alert('Failed to update status');
        } finally {
            setIsUpdating(false);
        }
    };

    const statusOptions = [
        { label: 'Pending', value: 'pending', icon: Clock, color: 'text-amber-500' },
        { label: 'Processing', value: 'processing', icon: Package, color: 'text-blue-500' },
        { label: 'Ready', value: 'ready', icon: CheckCircle2, color: 'text-indigo-500' },
        { label: 'Shipped', value: 'shipped', icon: Truck, color: 'text-indigo-500' },
        { label: 'Delivered', value: 'delivered', icon: CheckCircle2, color: 'text-emerald-500' },
        { label: 'Cancelled', value: 'cancelled', icon: XCircle, color: 'text-red-500' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border border-border shadow-2xl shadow-black/50 relative animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-md px-10 py-8 border-b border-border flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-3 mb-1">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Order Snapshot</span>
                            <div className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border", 
                                order.status === 'delivered' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : 
                                order.status === 'cancelled' ? "bg-red-500/10 text-red-600 border-red-500/20" : 
                                "bg-amber-500/10 text-amber-600 border-amber-500/20")}>
                                {order.status}
                            </div>
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter">#{order.id.slice(0, 12).toUpperCase()}</h2>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-muted rounded-2xl transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left: Customer & Logistics */}
                    <div className="space-y-10">
                        <section>
                            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                Customer Profile
                            </h3>
                            <div className="bg-muted/30 p-6 rounded-3xl border border-border/50 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                        <User className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-tight">{order.customerName}</p>
                                        <p className="text-xs text-muted-foreground font-medium">{order.customerEmail}</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-border/50 space-y-3">
                                    <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                                        <Mail className="w-4 h-4 opacity-50" />
                                        <span>{order.customerEmail}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                                        <Phone className="w-4 h-4 opacity-50" />
                                        <span>{order.customerPhone || 'Not provided'}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                Logistics Detail
                            </h3>
                            <div className="bg-muted/30 p-6 rounded-3xl border border-border/50">
                                <p className="text-sm font-bold text-foreground leading-relaxed">
                                    {order.address}<br />
                                    {order.city}, {order.state} {order.zip}<br />
                                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2 inline-block">India</span>
                                </p>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-primary" />
                                Payment & Status
                            </h3>
                            <div className="bg-muted/30 p-6 rounded-3xl border border-border/50 space-y-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Method</span>
                                    <span className="text-sm font-black uppercase tracking-tight">{order.paymentMethod || 'Credit Card'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</span>
                                    <span className={cn("px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest", 
                                        order.paymentStatus === 'paid' ? "bg-emerald-500 text-white" : "bg-amber-500 text-white")}>
                                        {order.paymentStatus || 'Paid'}
                                    </span>
                                </div>
                                
                                <div className="pt-6 border-t border-border/50">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Advance Order Status</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {statusOptions.map((status) => (
                                            <button
                                                key={status.value}
                                                disabled={isUpdating || order.status === status.value}
                                                onClick={() => handleStatusUpdate(status.value)}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-left",
                                                    order.status === status.value 
                                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                                                        : "bg-background border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                <status.icon className={cn("w-4 h-4", order.status === status.value ? "text-white" : status.color)} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{status.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="bg-muted/10 p-10 rounded-[3rem] border border-border/50 flex flex-col">
                        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-8 flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-primary" />
                            Acquisition Summary
                        </h3>
                        
                        <div className="flex-grow space-y-6 overflow-y-auto max-h-[400px] pr-4 custom-scrollbar">
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-6 group">
                                    <div className="w-20 h-20 bg-card rounded-2xl border border-border flex items-center justify-center p-3">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                    </div>
                                    <div className="flex-grow flex flex-col justify-center">
                                        <h4 className="text-sm font-black text-foreground uppercase tracking-tight">{item.name}</h4>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">₹{item.price.toLocaleString()} × {item.quantity}</span>
                                            <span className="text-sm font-black text-foreground">₹{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 pt-10 border-t border-border/50 space-y-4">
                            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span>₹{(order.total / 1.18).toFixed(0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                <span>Tax (18%)</span>
                                <span>₹{(order.total - (order.total / 1.18)).toFixed(0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end pt-4 border-t border-border">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Grand Total</span>
                                <span className="text-4xl font-black text-foreground tracking-tighter italic">₹{order.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="bg-muted/20 px-10 py-6 border-t border-border flex justify-between items-center">
                    <span className="text-[10px] font-bold text-muted-foreground italic">Placed on {new Date(order.createdAt).toLocaleString()}</span>
                    <button 
                        onClick={() => window.print()}
                        className="px-6 py-3 bg-foreground text-background rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                        Export Invoice
                    </button>
                </div>
            </div>
        </div>
    );
}
