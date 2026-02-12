import { getProducts } from '@/lib/db';
import { Package, DollarSign, TrendingUp } from 'lucide-react';

export default async function AdminDashboard() {
    const products = await getProducts();
    const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
    const totalValue = products.reduce((acc, p) => acc + ((p.price || 0) * (p.stock || 0)), 0);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Products</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{products.length}</p>
                        </div>
                        <div className="p-3 bg-teal-100 rounded-full text-teal-600">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Inventory Value</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">₹{totalValue.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full text-green-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Stock Items</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{totalStock}</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <p className="text-gray-500">No recent activity to show.</p>
            </div>
        </div>
    );
}
