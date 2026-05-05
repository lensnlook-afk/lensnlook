'use client';

import { Product } from '@/lib/db';
import {
    deleteProductAction,
    quickStockUpdateAction,
    toggleVisibilityAction,
    duplicateProductAction,
    bulkDeleteProductsAction,
    bulkToggleVisibilityAction,
} from '../actions';
import Link from 'next/link';
import {
    Search, Eye, EyeOff, Copy,
    AlertTriangle, Package, TrendingDown, X, Check,
    Loader2, CheckSquare, Square, Pencil, Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface ProductsClientProps {
    initialProducts: Product[];
}

export default function ProductsClient({ initialProducts }: ProductsClientProps) {
    const router = useRouter();
    const [products, setProducts] = useState(initialProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [quickStockId, setQuickStockId] = useState<string | null>(null);
    const [quickStockValue, setQuickStockValue] = useState('');
    const [isPending, startTransition] = useTransition();
    const [actionInProgress, setActionInProgress] = useState<string | null>(null);

    const categories = useMemo(() => {
        const cats = new Set(products.map(p => p.category));
        return Array.from(cats).sort();
    }, [products]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch =
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
            const matchesStock =
                stockFilter === 'all' ||
                (stockFilter === 'low' && p.stock > 0 && p.stock < 10) ||
                (stockFilter === 'out' && p.stock === 0) ||
                (stockFilter === 'in' && p.stock >= 10);
            return matchesSearch && matchesCategory && matchesStock;
        });
    }, [products, searchQuery, categoryFilter, stockFilter]);

    const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 10).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredProducts.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredProducts.map(p => p.id)));
        }
    };

    const handleQuickStockUpdate = async (id: string) => {
        const val = parseInt(quickStockValue);
        if (isNaN(val) || val < 0) return;
        setActionInProgress(id);
        startTransition(async () => {
            const res = await quickStockUpdateAction(id, val);
            if (res.success) {
                setProducts(prev => prev.map(p => (p.id === id ? { ...p, stock: val } : p)));
                setQuickStockId(null);
                setQuickStockValue('');
            }
            setActionInProgress(null);
            router.refresh();
        });
    };

    const handleToggleVisibility = async (id: string, isActive: boolean) => {
        setActionInProgress(id);
        startTransition(async () => {
            const res = await toggleVisibilityAction(id, !isActive);
            if (res.success) {
                setProducts(prev => prev.map(p => (p.id === id ? { ...p, isActive: !isActive } : p)));
            }
            setActionInProgress(null);
            router.refresh();
        });
    };

    const handleDuplicate = async (id: string) => {
        setActionInProgress(id);
        startTransition(async () => {
            const res = await duplicateProductAction(id);
            if (res.success) {
                router.refresh();
            }
            setActionInProgress(null);
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this product? This cannot be undone.')) return;
        setActionInProgress(id);
        startTransition(async () => {
            try {
                const res = await deleteProductAction(id);
                if (res.success) {
                    setProducts(prev => prev.filter(p => p.id !== id));
                    // Success feedback would be nice here too
                } else {
                    alert(res.error || 'Failed to delete product. Please check your database connection.');
                }
            } catch (err) {
                alert('An unexpected error occurred during deletion.');
            } finally {
                setActionInProgress(null);
                router.refresh();
            }
        });
    };

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`Delete ${selectedIds.size} products? This cannot be undone.`)) return;
        setActionInProgress('bulk');
        startTransition(async () => {
            try {
                const res = await bulkDeleteProductsAction(Array.from(selectedIds));
                if (res.success) {
                    setProducts(prev => prev.filter(p => !selectedIds.has(p.id)));
                    setSelectedIds(new Set());
                } else {
                    alert(res.error || 'Failed to delete products.');
                }
            } catch (err) {
                alert('An unexpected error occurred during bulk deletion.');
            } finally {
                setActionInProgress(null);
                router.refresh();
            }
        });
    };

    const handleBulkToggleVisibility = async (isActive: boolean) => {
        if (selectedIds.size === 0) return;
        setActionInProgress('bulk');
        startTransition(async () => {
            const res = await bulkToggleVisibilityAction(Array.from(selectedIds), isActive);
            if (res.success) {
                setProducts(prev =>
                    prev.map(p => (selectedIds.has(p.id) ? { ...p, isActive } : p))
                );
                setSelectedIds(new Set());
            }
            setActionInProgress(null);
            router.refresh();
        });
    };

    return (
        <div className="space-y-6">
            {/* Alerts */}
            {(lowStockCount > 0 || outOfStockCount > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {lowStockCount > 0 && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-3">
                            <div className="bg-amber-500 p-2 rounded-xl">
                                <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-amber-600 text-xs font-black uppercase tracking-widest">Low Stock Alert</p>
                                <p className="text-amber-700/80 text-sm font-bold">{lowStockCount} products below 10 units</p>
                            </div>
                        </div>
                    )}
                    {outOfStockCount > 0 && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3">
                            <div className="bg-red-500 p-2 rounded-xl">
                                <TrendingDown className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-red-600 text-xs font-black uppercase tracking-widest">Out of Stock</p>
                                <p className="text-red-700/80 text-sm font-bold">{outOfStockCount} products unavailable</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Filters & Bulk Actions */}
            <div className="bg-card rounded-2xl shadow-xl border border-border p-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search by name, SKU, or ID…"
                            className="w-full pl-10 pr-4 py-2.5 bg-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                        />
                    </div>
                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="px-4 py-2.5 bg-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm font-medium"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    {/* Stock Filter */}
                    <select
                        value={stockFilter}
                        onChange={e => setStockFilter(e.target.value)}
                        className="px-4 py-2.5 bg-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm font-medium"
                    >
                        <option value="all">All Stock Levels</option>
                        <option value="in">In Stock (≥10)</option>
                        <option value="low">Low Stock (&lt;10)</option>
                        <option value="out">Out of Stock</option>
                    </select>
                </div>

                {/* Bulk Actions */}
                {selectedIds.size > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/20">
                        <p className="text-sm font-bold text-primary">{selectedIds.size} selected</p>
                        <div className="flex-1" />
                        <button
                            onClick={() => handleBulkToggleVisibility(true)}
                            disabled={actionInProgress === 'bulk'}
                            className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                        >
                            <Eye className="w-3.5 h-3.5 inline mr-1" />
                            Show
                        </button>
                        <button
                            onClick={() => handleBulkToggleVisibility(false)}
                            disabled={actionInProgress === 'bulk'}
                            className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                        >
                            <EyeOff className="w-3.5 h-3.5 inline mr-1" />
                            Hide
                        </button>
                        <button
                            onClick={handleBulkDelete}
                            disabled={actionInProgress === 'bulk'}
                            className="px-3 py-1.5 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                        >
                            <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                            Delete
                        </button>
                        <button
                            onClick={() => setSelectedIds(new Set())}
                            className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg text-xs font-bold transition-colors"
                        >
                            <X className="w-3.5 h-3.5 inline mr-1" />
                            Clear
                        </button>
                    </div>
                )}
            </div>

            {/* Products Table */}
            <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/10 border-b border-border">
                                <th className="px-4 py-3 w-12">
                                    <button
                                        onClick={toggleSelectAll}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {selectedIds.size === filteredProducts.length && filteredProducts.length > 0 ? (
                                            <CheckSquare className="w-4 h-4" />
                                        ) : (
                                            <Square className="w-4 h-4" />
                                        )}
                                    </button>
                                </th>
                                <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">Product</th>
                                <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">Category</th>
                                <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">Price</th>
                                <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">Stock</th>
                                <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                                <th className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                                        <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p className="font-medium">No products found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map(product => (
                                    <tr key={product.id} className="group hover:bg-primary/[0.02] transition-colors">
                                        <td className="px-4 py-4">
                                            <button
                                                onClick={() => toggleSelect(product.id)}
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {selectedIds.has(product.id) ? (
                                                    <CheckSquare className="w-4 h-4 text-primary" />
                                                ) : (
                                                    <Square className="w-4 h-4" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-muted rounded-xl overflow-hidden flex items-center justify-center border border-border/50">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-contain p-1"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-sm text-foreground truncate">{product.name}</p>
                                                    {product.sku && (
                                                        <p className="text-xs text-muted-foreground font-mono">{product.sku}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-bold text-foreground">₹{product.price.toLocaleString()}</p>
                                                {product.discountPrice && (
                                                    <p className="text-xs text-emerald-600 font-semibold">
                                                        Sale: ₹{product.discountPrice.toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            {quickStockId === product.id ? (
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={quickStockValue}
                                                        onChange={e => setQuickStockValue(e.target.value)}
                                                        className="w-16 px-2 py-1 text-xs border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                                                        autoFocus
                                                        onKeyDown={e => {
                                                            if (e.key === 'Enter') handleQuickStockUpdate(product.id);
                                                            if (e.key === 'Escape') setQuickStockId(null);
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() => handleQuickStockUpdate(product.id)}
                                                        disabled={actionInProgress === product.id}
                                                        className="p-1 text-emerald-600 hover:bg-emerald-500/10 rounded transition-colors disabled:opacity-50"
                                                    >
                                                        {actionInProgress === product.id ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <Check className="w-3.5 h-3.5" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => setQuickStockId(null)}
                                                        className="p-1 text-muted-foreground hover:bg-muted rounded transition-colors"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setQuickStockId(product.id);
                                                        setQuickStockValue(product.stock.toString());
                                                    }}
                                                    className={cn(
                                                        'text-sm font-bold px-2 py-1 rounded-lg hover:bg-muted transition-colors',
                                                        product.stock === 0
                                                            ? 'text-red-600'
                                                            : product.stock < 10
                                                            ? 'text-amber-600'
                                                            : 'text-emerald-600'
                                                    )}
                                                >
                                                    {product.stock}
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <button
                                                onClick={() => handleToggleVisibility(product.id, product.isActive ?? true)}
                                                disabled={actionInProgress === product.id}
                                                className={cn(
                                                    'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all border disabled:opacity-50',
                                                    product.isActive
                                                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20'
                                                        : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                                                )}
                                            >
                                                {actionInProgress === product.id ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : product.isActive ? (
                                                    <Eye className="w-3 h-3" />
                                                ) : (
                                                    <EyeOff className="w-3 h-3" />
                                                )}
                                                {product.isActive ? 'Visible' : 'Hidden'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDuplicate(product.id)}
                                                    disabled={actionInProgress === product.id}
                                                    className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {actionInProgress === product.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    disabled={actionInProgress === product.id}
                                                    className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Results count */}
            <p className="text-center text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
            </p>
        </div>
    );
}
