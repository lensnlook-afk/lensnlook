import { getProducts } from '@/lib/db';
import ProductsPageClient from './ProductsPageClient';

export default async function ProductList() {
    const products = await getProducts();
    return <ProductsPageClient initialProducts={products} />;
}
