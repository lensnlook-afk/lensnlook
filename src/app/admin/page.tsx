import { getProducts } from '@/lib/db';
import { Package, DollarSign, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
    const products = await getProducts();
    const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const totalValue = products.reduce((acc, p) => acc + ((p.price || 0) * (p.stock || 0)), 0);
    const lowStockProducts = products.filter(p => (p.stock || 0) < 10);
    const outOfStock = products.filter(p => (p.stock || 0) === 0);

    return (
        <div className="space-y-12 pb-20">
            {/* Header Section */}
            <div>
                <h1 className="text-6xl font-heading font-black tracking-tighter text-foreground mb-4">Command Center.</h1>
                <p className="text-muted-foreground text-lg font-medium opacity-80">Holistic overview of your luxury eyewear empire.</p>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    {
                        label: 'Gross Valuation',
                        value: `₹${totalValue.toLocaleString()}`,
                        icon: DollarSign,
                        color: 'bg-primary',
                        trend: '+12.5%',
                        trendUp: true
                    },
                    {
                        label: 'Total Inventory',
                        value: products.length,
                        icon: Package,
                        color: 'bg-indigo-500',
                        trend: '+3 new',
                        trendUp: true
                    },
                    {
                        label: 'Total Stock',
                        value: totalStock,
                        icon: TrendingUp,
                        color: 'bg-emerald-500',
                        trend: 'Optimal',
                        trendUp: true
                    },
                    {
                        label: 'Low Stock Alerts',
                        value: lowStockProducts.length,
                        icon: AlertTriangle,
                        color: 'bg-amber-500',
                        trend: lowStockProducts.length > 0 ? 'Action Reqd' : 'Healthy',
                        trendUp: lowStockProducts.length === 0
                    },
                ].map((stat, i) => (
                    <div key={i} className="group relative bg-card p-8 rounded-[2.5rem] border border-border shadow-2xl shadow-black/[0.03] transition-all hover:-translate-y-2">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 ${stat.color} rounded-2xl shadow-lg shadow-black/10`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${stat.trendUp ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                <span>{stat.trend}</span>
                            </div>
                        </div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                        <h3 className="text-4xl font-black text-foreground tracking-tighter">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Critical Inventory Monitoring */}
                <div className="lg:col-span-2 bg-card rounded-[3rem] border border-border overflow-hidden shadow-2xl shadow-black/[0.03]">
                    <div className="p-8 border-b border-border flex items-center justify-between bg-muted/20">
                        <div className="flex items-center space-x-3">
                            <Activity className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-black tracking-tighter">Inventory Health.</h2>
                        </div>
                        <Link href="/admin/products" className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">Full Audit</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-muted/10">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Piece</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Current Stock</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {lowStockProducts.concat(outOfStock).slice(0, 5).map((product) => (
                                    <tr key={product.id} className="hover:bg-primary/[0.01] transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-muted rounded-xl p-2">
                                                    <img src={product.image} alt="" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                                </div>
                                                <span className="font-bold text-sm text-foreground">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-sm font-black ${product.stock === 0 ? 'text-red-500' : 'text-amber-500'}`}>
                                                {product.stock} Units
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${product.stock === 0 ? 'bg-red-500 text-white' : 'bg-amber-500/10 text-amber-600'}`}>
                                                {product.stock === 0 ? 'Exhausted' : 'Low Status'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {lowStockProducts.length === 0 && outOfStock.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-20 text-center">
                                            <p className="text-muted-foreground font-medium">All systems green. Inventory levels are optimal.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions & Tips */}
                <div className="space-y-8">
                    <div className="bg-primary p-8 rounded-[3rem] text-white shadow-2xl shadow-primary/20 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black tracking-tighter mb-2">Grow Presence.</h3>
                            <p className="text-white/70 text-sm font-medium mb-8">Catalog new luxury pieces to expand your reach this quarter.</p>
                            <Link
                                href="/admin/products/new"
                                className="inline-flex items-center px-6 py-4 bg-white text-primary rounded-2xl font-bold text-sm hover:scale-105 transition-transform"
                            >
                                Catalog Now
                            </Link>
                        </div>
                        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                    </div>

                    <div className="bg-card p-10 rounded-[3rem] border border-border shadow-2xl shadow-black/[0.02]">
                        <h4 className="text-lg font-black tracking-tighter mb-4">Optimization Tip.</h4>
                        <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                            Pieces with less than 10 units in stock are currently highlighted. Consider restocking these to avoid disruption in sales performance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
