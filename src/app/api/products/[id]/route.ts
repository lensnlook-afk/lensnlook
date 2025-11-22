import { NextResponse } from 'next/server';
import { getProductById, saveProduct, deleteProduct, Product } from '@/lib/db';

interface Params {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(request: Request, { params }: Params) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: Params) {
    const { id } = await params;
    const body = await request.json();
    const existingProduct = await getProductById(id);

    if (!existingProduct) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updatedProduct: Product = {
        ...existingProduct,
        ...body,
        id: id, // Ensure ID doesn't change
    };

    await saveProduct(updatedProduct);
    return NextResponse.json(updatedProduct);
}

export async function DELETE(request: Request, { params }: Params) {
    const { id } = await params;
    const existingProduct = await getProductById(id);

    if (!existingProduct) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await deleteProduct(id);
    return NextResponse.json({ success: true });
}
