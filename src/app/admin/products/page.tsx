import { getProducts } from '@/lib/db';
import { deleteProductAction } from '../actions';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DeleteProductButton } from './DeleteProductButton';

export default async function ProductList() {
    const products = await getProducts();

    return (
        <div className="space-y-12 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <h1 className="text-6xl font-heading font-black tracking-tighter text-foreground mb-4">Inventory Management.</h1>
                    <p className="text-muted-foreground text-lg font-medium">Coordinate your global warehouse and product listings.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="bg-primary text-white px-8 py-5 rounded-2xl flex items-center space-x-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 font-bold group"
                >
                    <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                    <span>Catalog New Piece</span>
                </Link>
            </div>

            {/* Content Card */}
            <div className="bg-card rounded-[3rem] shadow-2xl shadow-black/[0.02] border border-border/50 overflow-hidden">
                <div className="p-8 border-b border-border bg-muted/20 flex justify-between items-center">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Filter by piece name or ID..."
                            className="w-full pl-12 pr-6 py-4 bg-background rounded-2xl border-border focus:ring-primary focus:border-primary text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/10">
                                <th className="px-8 py-6 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border">Visual Identity</th>
                                <th className="px-8 py-6 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border">Details</th>
                                <th className="px-8 py-6 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border">Valuation</th>
                                <th className="px-8 py-6 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border">Availablity</th>
                                <th className="px-8 py-6 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border text-right">Edit Options</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {products.map((product) => (
                                <tr key={product.id} className="group hover:bg-primary/[0.02] transition-colors">
                                    <td className="px-8 py-8">
                                        <div className="w-20 h-20 bg-muted rounded-3xl overflow-hidden flex items-center justify-center p-3 border border-border/50 group-hover:border-primary/20 transition-all shadow-sm">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-1">{product.category}</p>
                                        <h3 className="font-bold text-foreground text-lg leading-tight">{product.name}</h3>
                                        <p className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">ID: {product.id.slice(0, 8)}...</p>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="text-xl font-black text-foreground tracking-tighter">
                                            ₹{(product.price || 0).toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col gap-2">
                                            <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-1000",
                                                        (product.stock || 0) > 10 ? "bg-primary" : "bg-accent"
                                                    )}
                                                    style={{ width: `${Math.min((product.stock || 0) * 2, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-muted-foreground">
                                                {(product.stock || 0)} Units in Reserve
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex items-center justify-end space-x-3">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="p-4 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-2xl transition-all shadow-sm active:scale-95"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </Link>
                                            <DeleteProductButton id={product.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {products.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-32 text-center px-10">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                                <Package className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">No items found</h2>
                            <p className="text-muted-foreground max-w-sm mb-10">Your inventory is currently empty. Start by cataloging a new piece of eyewear.</p>
                            <Link href="/admin/products/new" className="bg-primary text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/20">
                                Catalog First Piece
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Package(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m7.5 4.27 9 5.15" />
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
        </svg>
    );
}
