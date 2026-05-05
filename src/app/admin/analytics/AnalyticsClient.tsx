'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, ShoppingBag, Package, AlertTriangle, ArrowUpRight, DollarSign, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/cms/analytics')
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!data) return <div>Failed to load analytics.</div>;

    const maxRevenue = Math.max(...data.dailyRevenue.map((d: any) => d.amount), 1);

    return (
        <div className="space-y-12 pb-20">
            <div>
                <h1 className="text-6xl font-black tracking-tighter text-foreground mb-2">Empire Analytics.</h1>
                <p className="text-muted-foreground text-lg font-medium opacity-80">Strategic insights for your luxury eyewear brand.</p>
            </div>

            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                    { label: 'Revenue (7d)', value: `₹${data.metrics.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-emerald-600' },
                    { label: 'Total Orders', value: data.metrics.totalOrders, icon: ShoppingBag, color: 'bg-primary' },
                    { label: 'Active Catalog', value: data.metrics.totalProducts, icon: Package, color: 'bg-indigo-500' },
                    { label: 'Inventory Risk', value: data.metrics.lowStockCount, icon: AlertTriangle, color: 'bg-amber-500' },
                ].map((stat, i) => (
                    <div key={i} className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm">
                        <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-black/10 text-white`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-foreground tracking-tighter">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-card rounded-[3rem] border border-border p-10 shadow-sm">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-6 h-6 text-primary" />
                            <h2 className="text-2xl font-black tracking-tighter">Performance Curve.</h2>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/30 px-4 py-2 rounded-full">
                            <Calendar className="w-3 h-3" />
                            <span>Last 7 Days</span>
                        </div>
                    </div>

                    <div className="h-64 flex items-end gap-4">
                        {data.dailyRevenue.map((d: any, i: number) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                <div className="w-full relative flex flex-col justify-end h-full">
                                    <div 
                                        className="w-full bg-primary/20 rounded-t-xl group-hover:bg-primary/40 transition-all relative"
                                        style={{ height: `${(d.amount / maxRevenue) * 100}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[10px] font-black px-2 py-1 rounded">
                                            ₹{d.amount}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest rotate-45 lg:rotate-0">
                                    {new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stock Summary */}
                <div className="bg-card rounded-[3rem] border border-border p-10 shadow-sm">
                    <h2 className="text-2xl font-black tracking-tighter mb-8">Stock Health.</h2>
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3">
                                <span>Optimal</span>
                                <span className="text-emerald-500">{data.metrics.totalProducts - data.metrics.lowStockCount - data.metrics.outOfStockCount} items</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-emerald-500" 
                                    style={{ width: `${((data.metrics.totalProducts - data.metrics.lowStockCount) / data.metrics.totalProducts) * 100}%` }} 
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3">
                                <span>Low Status</span>
                                <span className="text-amber-500">{data.metrics.lowStockCount} items</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-amber-500" 
                                    style={{ width: `${(data.metrics.lowStockCount / data.metrics.totalProducts) * 100}%` }} 
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-3">
                                <span>Exhausted</span>
                                <span className="text-red-500">{data.metrics.outOfStockCount} items</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-red-500" 
                                    style={{ width: `${(data.metrics.outOfStockCount / data.metrics.totalProducts) * 100}%` }} 
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-12 p-6 bg-muted/20 rounded-2xl border border-border/50">
                        <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                            <span className="text-foreground font-black uppercase tracking-widest block mb-2 text-[10px]">Strategic Advice:</span>
                            Maintain stock levels above 10 units for high-traffic categories to ensure continuous acquisition flow.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
