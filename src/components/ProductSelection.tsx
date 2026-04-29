'use client';

import { useState } from 'react';
import { Product } from '@/lib/db';
import { Eye, Zap, Sparkles, Shield, Layers, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import AddToCartButton from './AddToCartButton';
import BuyNowButton from './BuyNowButton';

export default function ProductSelection({ product }: { product: Product }) {
    const [selectedPrescription, setSelectedPrescription] = useState('Zero Power');
    const [selectedCoating, setSelectedCoating] = useState('Standard Clear Lens');

    const prescriptions = ['Zero Power', 'Single Vision', 'Bifocal', 'Progressive'];
    
    const coatings = [
        { icon: Zap, label: 'Standard Clear Lens', detail: 'Basic vision correction with scratch resistance', price: 'Included' },
        { icon: Sparkles, label: 'Blue Block Lens', detail: 'Digital protection for screen users', price: '+ ₹499' },
        { icon: Shield, label: 'Blue Premium (No Glare)', detail: 'Advanced protection with HD clarity', price: '+ ₹999' },
        { icon: Layers, label: 'Photochromic (Transit)', detail: 'Lenses that darken in sunlight', price: '+ ₹1,499' },
        { icon: Star, label: 'Branded Luxury Lenses', detail: 'ESSILOR, ZEISS, FIRSTLOOK, KODAK', price: 'Enquire for Price' },
    ];

    return (
        <div className="space-y-12">
            {/* Power Selection - Conditional */}
            {product.hasPower && (
                <div className="space-y-6 bg-card/50 p-8 rounded-[2.5rem] border border-border animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Eye className="w-5 h-5 text-primary" />
                            <h3 className="font-black uppercase tracking-widest text-sm">Vision Prescription</h3>
                        </div>
                        <button className="text-[10px] font-black text-primary underline uppercase tracking-widest">Measure Guide</button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {prescriptions.map((type) => (
                            <button 
                                key={type} 
                                onClick={() => setSelectedPrescription(type)}
                                className={cn(
                                    "px-4 py-3 border rounded-xl text-[11px] font-black uppercase tracking-wider transition-all text-center",
                                    selectedPrescription === type 
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                                        : "bg-muted/50 border-border hover:border-primary hover:bg-primary/5"
                                )}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Lens Selection */}
            <div className="space-y-6">
                <div className="flex items-center justify-between pl-1">
                    <h3 className="font-black uppercase tracking-widest text-xs text-muted-foreground">Lens Coatings & Technology</h3>
                    <div className="px-3 py-1 bg-primary/5 rounded-lg border border-primary/10">
                        <span className="text-[9px] font-black text-primary uppercase tracking-tighter">Premium Selection</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {coatings.map((item, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setSelectedCoating(item.label)}
                            className={cn(
                                "flex items-center justify-between p-5 bg-card border rounded-2xl group transition-all text-left",
                                selectedCoating === item.label 
                                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" 
                                    : "border-border hover:border-primary/30"
                            )}
                        >
                            <div className="flex items-center space-x-4">
                                <div className={cn(
                                    "p-3 rounded-xl transition-colors",
                                    selectedCoating === item.label ? "bg-primary/20" : "bg-primary/5 group-hover:bg-primary/10"
                                )}>
                                    <item.icon className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase text-foreground">{item.label}</p>
                                    <p className="text-[10px] text-muted-foreground font-bold">{item.detail}</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-black text-primary uppercase">{item.price}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Purchase Action */}
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <div className="flex-grow">
                    <AddToCartButton 
                        product={product} 
                        prescription={product.hasPower ? selectedPrescription : 'N/A'} 
                        coating={selectedCoating}
                    />
                </div>
                <BuyNowButton 
                    product={product} 
                    prescription={product.hasPower ? selectedPrescription : 'N/A'} 
                    coating={selectedCoating}
                />
            </div>
        </div>
    );
}
