import Link from 'next/link';
import { LayoutDashboard, Package, Settings, LogOut, ArrowLeft, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminLogout } from './actions';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-background dark:bg-[#020617] transition-colors duration-500">
            {/* Sidebar */}
            <aside className="w-80 bg-card border-r border-border flex flex-col relative z-20 shadow-2xl shadow-black/5">
                <div className="p-10">
                    <Link href="/" className="group flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-primary/20">
                            <span className="text-white font-black text-xl italic tracking-tighter">L</span>
                        </div>
                        <span className="text-2xl font-heading font-black tracking-tighter text-foreground">
                            Admin<span className="text-primary italic">.</span>
                        </span>
                    </Link>
                </div>

                <nav className="flex-grow px-6 space-y-2">
                    <p className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Main Menu</p>
                    {[
                        { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
                        { name: 'Inventory', icon: Package, href: '/admin/products' },
                        { name: 'Accessories', icon: Box, href: '/admin/products?category=Accessories' },
                        { name: 'Settings', icon: Settings, href: '/admin/settings' },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center space-x-4 px-6 py-4 text-muted-foreground hover:bg-primary/5 hover:text-primary rounded-[1.5rem] transition-all group font-bold text-sm"
                        >
                            <item.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-8 border-t border-border mt-auto space-y-4">
                    <form action={adminLogout}>
                        <button
                            type="submit"
                            className="w-full flex items-center space-x-4 px-6 py-4 text-muted-foreground hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 rounded-2xl transition-all font-bold text-sm"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </form>
                    <Link
                        href="/"
                        className="flex items-center space-x-4 px-6 py-4 text-primary hover:bg-primary/5 rounded-2xl transition-all font-bold text-sm"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Return to Store</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto px-12 py-10 bg-mesh relative">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -z-10" />
                <div className="relative z-10 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
