import { getProducts } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Search, ShoppingBag, SlidersHorizontal, ArrowLeft } from 'lucide-react';

interface ProductsPageProps {
    searchParams: Promise<{
        category?: string;
        search?: string;
    }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const allProducts = await getProducts();
    const { category, search } = await searchParams;

    let products = allProducts;

    if (category) {
        products = products.filter((p) => p.category === category);
    }

    if (search) {
        const query = search.toLowerCase();
        products = products.filter((p) =>
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
    }

    const categories = Array.from(new Set(allProducts.map((p) => p.category)));

    return (
        <div className="bg-background min-h-screen pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="space-y-8 mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center gap-4 text-primary text-sm font-bold uppercase tracking-[0.2em]">
                        <Link href="/" className="p-2 hover:bg-primary/10 rounded-xl transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <span>Catalog Explorer</span>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-foreground tracking-tighter">
                                {search ? `Search: ${search}` : (category ? `${category}` : 'The Collection.')}
                            </h1>
                            <p className="text-muted-foreground mt-4 text-lg font-medium">Discover {products.length} artisan crafted pieces designed for clarity.</p>
                        </div>

                        <div className="flex items-center space-x-2 bg-secondary/5 dark:bg-white/5 p-2 rounded-2xl border border-border">
                            <Link
                                href="/products"
                                className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${!category
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                All Pieces
                            </Link>
                            {categories.map((cat) => (
                                <Link
                                    key={cat}
                                    href={`/products?category=${cat}`}
                                    className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${category === cat
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                        : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product, idx) => (
                            <div key={product.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${idx * 50}ms` }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 bg-card rounded-[3rem] border border-border/50 text-center px-6">
                        <div className="w-20 h-20 bg-secondary/5 rounded-full flex items-center justify-center mb-8">
                            <Search className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">No matches found</h2>
                        <p className="text-muted-foreground max-w-sm mb-10 font-medium">We couldn't find what you're looking for. Try a different search term or explore our full collection.</p>
                        <Link
                            href="/products"
                            className="bg-primary text-white px-10 py-5 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            Explore Global Collection
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
