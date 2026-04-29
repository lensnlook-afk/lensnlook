'use client';

import { Product } from '@/lib/db';
import { useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import Link from 'next/link';
import ProductsClient from './ProductsClient';
import BulkImport from '@/components/admin/BulkImport';

interface ProductsPageClientProps {
    initialProducts: Product[];
}

export default function ProductsPageClient({ initialProducts }: ProductsPageClientProps) {
    const [showBulkImport, setShowBulkImport] = useState(false);

    return (
        <>
            {showBulkImport && <BulkImport onClose={() => setShowBulkImport(false)} />}
            <div className="space-y-8 pb-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-5xl font-heading font-black tracking-tighter text-foreground mb-2">
                            Inventory Management<span className="text-primary">.</span>
                        </h1>
                        <p className="text-muted-foreground text-base font-medium">
                            Manage your product catalog with ease.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowBulkImport(true)}
                            className="flex items-center gap-2 px-5 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-bold text-sm transition-colors border border-border"
                        >
                            <Upload className="w-4 h-4" />
                            Bulk Import
                        </button>
                        <Link
                            href="/admin/products/new"
                            className="bg-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 font-bold text-sm"
                        >
                            <Plus className="w-5 h-5" />
                            Add Product
                        </Link>
                    </div>
                </div>
                <ProductsClient initialProducts={initialProducts} />
            </div>
        </>
    );
}
