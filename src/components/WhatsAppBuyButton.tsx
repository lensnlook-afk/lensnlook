'use client';

import { MessageSquare } from 'lucide-react';
import { generateWhatsAppUrl } from '@/lib/utils';
import { Product } from '@/lib/db';

export default function WhatsAppBuyButton({ product }: { product: Product }) {
    const handleWhatsAppBuy = () => {
        const whatsappUrl = generateWhatsAppUrl({
            customerName: '[Customer Name]',
            customerPhone: '[Phone]',
            address: '[Address]',
            items: [{ ...product, quantity: 1 }],
            total: product.price,
            paymentMethod: 'WhatsApp (Direct Buy)'
        });
        
        window.open(whatsappUrl, '_blank');
    };

    return (
        <button
            onClick={handleWhatsAppBuy}
            className="w-full px-10 py-6 bg-green-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-green-700 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-green-500/20 flex items-center justify-center space-x-3"
        >
            <MessageSquare className="w-5 h-5" />
            <span>Buy via WhatsApp</span>
        </button>
    );
}
