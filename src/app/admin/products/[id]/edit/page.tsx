import ProductForm from '@/components/admin/ProductForm';
import { getProductById } from '@/lib/db';
import { notFound } from 'next/navigation';

interface EditProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    return <ProductForm product={product} />;
}
