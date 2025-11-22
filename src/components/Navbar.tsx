'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, Sun, Moon } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const { totalItems } = useCart();
    const { theme, setTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav
            className={cn(
                "sticky top-0 left-0 right-0 z-50 transition-all duration-300 shadow-sm bg-white dark:bg-charcoal pt-0"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {isSearchOpen ? (
                    <div className="absolute inset-0 z-50 flex items-center bg-white dark:bg-charcoal px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-top-2 duration-200">
                        <form onSubmit={handleSearch} className="w-full flex items-center">
                            <Search className="w-5 h-5 text-gray-400 mr-3" />
                            <input
                                type="text"
                                placeholder="Search for eyeglasses, sunglasses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                className="flex-grow bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white text-lg placeholder-gray-400"
                            />
                            <button
                                type="button"
                                onClick={() => setIsSearchOpen(false)}
                                className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="text-2xl font-heading font-bold tracking-tight text-black dark:text-white">
                                Lens<span className="text-neon-blue">&</span>Look
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            {['Eyeglasses', 'Sunglasses', 'Computer Glasses', 'Contact Lenses'].map((item) => (
                                <Link
                                    key={item}
                                    href={`/products?category=${item}`}
                                    className="text-sm font-medium text-black hover:text-neon-blue dark:text-gray-300 dark:hover:text-white transition-colors relative group"
                                >
                                    {item}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue transition-all group-hover:w-full"></span>
                                </Link>
                            ))}
                            <Link
                                href="/admin/products"
                                className="text-sm font-medium text-black hover:text-neon-blue dark:hover:text-white transition-colors relative group"
                            >
                                Admin
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all group-hover:w-full"></span>
                            </Link>
                        </div>

                        {/* Icons */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                            >
                                {mounted && theme === 'dark' ? (
                                    <Sun className="w-5 h-5" />
                                ) : (
                                    <Moon className="w-5 h-5" />
                                )}
                            </button>

                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            <Link href="/cart" className="relative text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors group">
                                <ShoppingBag className="w-5 h-5" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-neon-blue text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                            <button
                                className="md:hidden text-gray-600 dark:text-gray-300"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                )}
            </div>


            {/* Mobile Menu */}
            {
                isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-charcoal border-b border-gray-100 dark:border-white/10 shadow-lg py-4 px-4 flex flex-col space-y-4 animate-in slide-in-from-top-5">
                        {['Eyeglasses', 'Sunglasses', 'Computer Glasses', 'Contact Lenses'].map((item) => (
                            <Link
                                key={item}
                                href={`/products?category=${item}`}
                                className="text-base font-medium text-gray-800 dark:text-gray-200 py-2 border-b border-gray-50 dark:border-white/5 last:border-0"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item}
                            </Link>
                        ))}
                        <Link
                            href="/admin/products"
                            className="text-base font-medium text-neon-blue py-2 border-b border-gray-50 last:border-0"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Admin Panel
                        </Link>
                    </div>
                )
            }
        </nav >
    );
}
