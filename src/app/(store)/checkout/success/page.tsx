'use client';

import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function SuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-12 rounded-3xl shadow-xl max-w-lg w-full text-center animate-fade-in-up">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                </div>

                <h1 className="text-4xl font-heading font-bold text-charcoal mb-4">Order Confirmed!</h1>
                <p className="text-gray-500 text-lg mb-8">
                    Thank you for your purchase. We've received your order and will send you an email confirmation shortly.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/"
                        className="block w-full bg-charcoal text-white py-4 rounded-xl font-bold text-lg hover:bg-neon-blue hover:text-charcoal transition-all shadow-lg hover:shadow-neon-blue/30"
                    >
                        Continue Shopping
                    </Link>
                    <Link
                        href="/products"
                        className="block w-full py-4 rounded-xl font-bold text-charcoal hover:bg-gray-50 transition-colors"
                    >
                        View More Products <ArrowRight className="inline-block w-4 h-4 ml-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
