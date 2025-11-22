import { getProducts } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    {search ? `Search results for "${search}"` : (category ? `${category}` : 'All Products')}
                </h1>
                <div className="mt-4 md:mt-0 flex space-x-2 overflow-x-auto pb-2 md:pb-0">
                    <a
                        href="/products"
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!category
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All
                    </a>
                    {categories.map((cat) => (
                        <a
                            key={cat}
                            href={`/products?category=${cat}`}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${category === cat
                                ? 'bg-teal-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {cat}
                        </a>
                    ))}
                </div>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">No products found in this category.</p>
                    <a href="/products" className="text-teal-600 font-medium mt-2 inline-block">
                        View all products
                    </a>
                </div>
            )}
        </div>
    );
}
