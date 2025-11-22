import Link from 'next/link';
import { LayoutDashboard, Package, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-teal-600">Lens&Look</h1>
                </div>
                <nav className="p-4 space-y-2">
                    <Link
                        href="/admin"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        href="/admin/products"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors"
                    >
                        <Package className="w-5 h-5" />
                        <span>Products</span>
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 rounded-lg transition-colors"
                    >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                    </Link>
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t">
                    <Link
                        href="/"
                        className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Back to Store</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
