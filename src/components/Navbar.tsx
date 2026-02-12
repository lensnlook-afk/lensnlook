'use client';

import Link from 'next/link';
import { ShoppingBag, Search, Menu, X, Sun, Moon, User, LayoutGrid } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
    const { totalItems } = useCart();
    const { theme, setTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

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
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: 'Eyeglasses', href: '/products?category=Eyeglasses' },
        { name: 'Sunglasses', href: '/products?category=Sunglasses' },
        { name: 'Computer Glasses', href: '/products?category=Computer Glasses' },
        { name: 'Contact Lenses', href: '/products?category=Contact Lenses' },
    ];

    if (!mounted) return <div className="h-20 w-full" />;

    return (
        <>
            <header
                className={cn(
                    "fixed left-0 right-0 z-50 transition-all duration-700 ease-in-out",
                    isScrolled
                        ? "top-4 px-4 sm:px-6 lg:px-8"
                        : "top-2 px-4 sm:px-6"
                )}
            >
                <div
                    className={cn(
                        "max-w-[95%] mx-auto transition-all duration-700 ease-in-out",
                        isScrolled
                            ? "bg-white/80 dark:bg-black/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 dark:border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] px-6 py-3"
                            : "bg-white/40 dark:bg-black/20 backdrop-blur-xl rounded-[2.5rem] border border-white/20 dark:border-white/5 px-8 py-4"
                    )}
                >
                    <div className="flex items-center">
                        {/* Logo Section */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="group flex items-center space-x-3 z-50">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center transform group-hover:rotate-[15deg] transition-all duration-500 shadow-lg shadow-primary/30">
                                        <span className="text-white font-black text-xl italic tracking-tighter">L</span>
                                    </div>
                                    <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-2xl font-heading font-black tracking-tighter text-foreground">
                                    Lens<span className="text-primary">N</span>Look
                                </span>
                            </Link>
                        </div>

                        {/* Spacer to push elements to the right */}
                        <div className="flex-grow" />

                        {/* Right Group: Navigation + Actions */}
                        <div className="flex items-center space-x-6 lg:space-x-10">
                            {/* Desktop Navigation - Minimalist Floating Pill inside Navbar */}
                            <nav className="hidden md:flex items-center space-x-1 p-1 bg-secondary/5 dark:bg-white/5 rounded-2xl border border-secondary/5">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={cn(
                                            "px-4 lg:px-6 py-2.5 text-[11px] lg:text-[13px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 relative overflow-hidden group/link",
                                            pathname === link.href
                                                ? "text-white bg-primary shadow-lg shadow-primary/20"
                                                : "text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <span className="relative z-10">{link.name}</span>
                                        {pathname !== link.href && (
                                            <span className="absolute inset-0 bg-primary/10 scale-0 group-hover/link:scale-100 transition-transform duration-500 rounded-xl"></span>
                                        )}
                                    </Link>
                                ))}
                            </nav>

                            {/* Action Icons Section */}
                            <div className="flex items-center space-x-1 sm:space-x-2 z-50">
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="p-3 text-foreground hover:bg-secondary/5 dark:hover:bg-white/10 rounded-2xl transition-all hover:scale-110 active:scale-90"
                                    aria-label="Open search"
                                >
                                    <Search className="w-5 h-5 stroke-[2.5px]" />
                                </button>

                                <button
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="p-3 text-foreground hover:bg-secondary/5 dark:hover:bg-white/10 rounded-2xl transition-all hover:scale-110 active:scale-90"
                                    aria-label="Toggle theme"
                                >
                                    {theme === 'dark' ? <Sun className="w-5 h-5 stroke-[2.5px]" /> : <Moon className="w-5 h-5 stroke-[2.5px]" />}
                                </button>

                                <div className="h-6 w-px bg-border/50 mx-2 hidden sm:block" />

                                <Link href="/admin/products" className="p-3 text-foreground hover:bg-secondary/5 dark:hover:bg-white/10 rounded-2xl transition-all hover:scale-110 active:scale-90 hidden md:flex items-center space-x-2">
                                    <User className="w-5 h-5 stroke-[2.5px]" />
                                </Link>

                                <Link href="/cart" className="relative p-3 text-foreground hover:bg-secondary/5 dark:hover:bg-white/10 rounded-2xl transition-all group/cart hover:scale-110 active:scale-90">
                                    <ShoppingBag className="w-5 h-5 stroke-[2.5px] group-hover/cart:text-primary transition-colors" />
                                    {totalItems > 0 && (
                                        <span className="absolute top-2 right-2 bg-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-primary/30 ring-2 ring-white dark:ring-black">
                                            {totalItems}
                                        </span>
                                    )}
                                </Link>

                                <button
                                    className="md:hidden p-3 text-foreground hover:bg-secondary/5 dark:hover:bg-white/10 rounded-2xl transition-all"
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                >
                                    <LayoutGrid className="w-6 h-6 stroke-[2.5px]" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Premium Search Overlay */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-secondary/80 backdrop-blur-md animate-in fade-in duration-500"
                        onClick={() => setIsSearchOpen(false)}
                    />
                    <div className="w-full max-w-3xl bg-background rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-top-20 duration-500 border border-border/50">
                        <form onSubmit={handleSearch} className="flex items-center p-10 space-x-6">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <Search className="w-8 h-8 text-primary stroke-[3px]" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search our premium collection..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                className="flex-grow bg-transparent border-none focus:ring-0 text-3xl font-heading font-black text-foreground placeholder-muted-foreground/30"
                            />
                            <button
                                type="button"
                                onClick={() => setIsSearchOpen(false)}
                                className="p-4 hover:bg-secondary/5 dark:hover:bg-white/10 rounded-3xl transition-all rotate-0 hover:rotate-90"
                            >
                                <X className="w-8 h-8 text-muted-foreground" />
                            </button>
                        </form>
                        <div className="px-10 pb-10">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Trending Searches</p>
                            <div className="flex flex-wrap gap-3">
                                {['Titanium Frames', 'Blue Light Filter', 'Aviators', 'Luxury Collection'].map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setSearchQuery(tag)}
                                        className="px-6 py-3 bg-secondary/5 dark:bg-white/5 rounded-2xl text-sm font-bold hover:bg-primary hover:text-white transition-all"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Luxurious Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] lg:hidden">
                    <div
                        className="absolute inset-0 bg-secondary/90 backdrop-blur-xl animate-in fade-in duration-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-0 bottom-0 w-full md:w-[480px] bg-background shadow-2xl p-10 animate-in slide-in-from-right duration-700 flex flex-col">
                        <div className="flex justify-between items-center mb-16">
                            <span className="text-3xl font-heading font-black tracking-tighter italic">L<span className="text-primary italic">N</span>L</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-4 bg-secondary/5 rounded-3xl"
                            >
                                <X className="w-8 h-8 text-foreground" />
                            </button>
                        </div>

                        <nav className="flex flex-col space-y-8">
                            {navLinks.map((link, idx) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-4xl font-heading font-black text-foreground hover:text-primary transition-all flex items-center justify-between group animate-in slide-in-from-right duration-700"
                                    style={{ transitionDelay: `${idx * 100}ms` }}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span>{link.name}</span>
                                    <ArrowRight className="w-8 h-8 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-primary" />
                                </Link>
                            ))}
                        </nav>

                        <div className="mt-auto pt-10 border-t border-border">
                            <Link
                                href="/admin"
                                className="flex items-center space-x-4 text-xl font-bold text-muted-foreground hover:text-primary mb-12 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <LayoutGrid className="w-6 h-6 text-primary" />
                                </div>
                                <span>Management Portal</span>
                            </Link>

                            <div className="p-8 bg-primary/10 rounded-[2.5rem] border border-primary/20 relative overflow-hidden">
                                <div className="relative z-10">
                                    <h4 className="text-2xl font-black mb-3">Join the Club</h4>
                                    <p className="text-sm text-primary font-medium mb-6">Get 20% off your first frame.</p>
                                    <button className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20">
                                        Subscribe Now
                                    </button>
                                </div>
                                <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function ArrowRight(props: any) {
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
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}
