'use client';

import { ShoppingBag, Search, Filter, Eye, MoreVertical, Package, Clock, Truck, CheckCircle2, XCircle, RefreshCw, Download } from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import OrderDetailsModal from '@/components/admin/OrderDetailsModal';
import { getOrders } from '@/lib/db'; 
import { downloadCSV, convertToCSV } from '@/lib/csv';

export default function AdminOrdersClient({ initialOrders }: { initialOrders: any[] }) {
    const [orders, setOrders] = useState(initialOrders);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleExportCSV = () => {
        const csv = convertToCSV(orders.map(o => ({
            id: o.id,
            customerName: o.customerName,
            customerEmail: o.customerEmail,
            customerPhone: o.customerPhone,
            total: o.total,
            status: o.status,
            createdAt: o.createdAt,
            itemsCount: o.items.length
        })));
        downloadCSV(csv, `lensnlook-orders-${new Date().toISOString().split('T')[0]}.csv`);
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = 
                order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.id.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchQuery, statusFilter]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            case 'processing': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'shipped': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
            case 'delivered': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-600 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock className="w-3 h-3" />;
            case 'processing': return <Package className="w-3 h-3" />;
            case 'shipped': return <Truck className="w-3 h-3" />;
            case 'delivered': return <CheckCircle2 className="w-3 h-3" />;
            case 'cancelled': return <XCircle className="w-3 h-3" />;
            default: return null;
        }
    };

    const handleRefresh = async () => {
        setIsLoading(true);
        try {
            // In a real app, we'd call an API. Since we're in Next.js, 
            // we might want to use a Server Action to get fresh data.
            window.location.reload(); 
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="flex items-center space-x-2 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                        <ShoppingBag className="w-3 h-3" />
                        <span>Commerce Control</span>
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter text-foreground">Manage Orders<span className="text-primary">.</span></h1>
                    <p className="text-muted-foreground text-lg font-medium opacity-80 mt-2">Track and update customer acquisitions.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleExportCSV}
                        className="flex items-center space-x-3 px-8 py-4 bg-muted/50 hover:bg-muted rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-border"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                    <button 
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="flex items-center space-x-3 px-8 py-4 bg-muted/50 hover:bg-muted rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-border"
                    >
                        <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                        <span>Sync Database</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'bg-primary' },
                    { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: 'bg-amber-500' },
                    { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, icon: Package, color: 'bg-blue-500' },
                    { label: 'Completed', value: orders.filter(o => o.status === 'delivered').length, icon: CheckCircle2, color: 'bg-emerald-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-card p-6 rounded-[2rem] border border-border shadow-sm flex items-center space-x-4">
                        <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center shadow-lg shadow-black/10`}>
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                            <h3 className="text-2xl font-black text-foreground tracking-tighter">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Orders Table Container */}
            <div className="bg-card rounded-[3rem] border border-border shadow-2xl shadow-black/[0.02] overflow-hidden">
                <div className="p-8 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-6 bg-muted/20">
                    <div className="relative group flex-grow max-w-md">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name, email or order ID..."
                            className="w-full bg-background border border-border rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-background border border-border rounded-xl px-6 py-4 font-bold text-xs uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-primary/10"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/10 border-b border-border">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Order Details</th>
                                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Customer</th>
                                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Total Amount</th>
                                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Date</th>
                                <th className="px-8 py-6 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-primary/[0.01] transition-colors group cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col">
                                            <span className="font-black text-sm text-foreground tracking-tight">#{order.id.slice(0, 8).toUpperCase()}</span>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{order.items.length} Pieces Purchased</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-foreground">{order.customerName}</span>
                                            <span className="text-xs text-muted-foreground font-medium">{order.customerEmail}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            <span>{order.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <span className="font-black text-base text-foreground tracking-tighter">₹{order.total.toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-8 text-sm font-medium text-muted-foreground">
                                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                className="p-3 bg-muted hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedOrder(order);
                                                }}
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-32 text-center">
                                        <div className="max-w-xs mx-auto space-y-4">
                                            <div className="w-20 h-20 bg-muted rounded-[2rem] flex items-center justify-center mx-auto opacity-50">
                                                <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                            <p className="text-muted-foreground font-black uppercase text-xs tracking-widest italic">No matching acquisitions found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {selectedOrder && (
                <OrderDetailsModal 
                    order={selectedOrder} 
                    onClose={() => setSelectedOrder(null)} 
                    onUpdate={() => {
                        // In a real app, refresh data
                        window.location.reload();
                    }}
                />
            )}
        </div>
    );
}
