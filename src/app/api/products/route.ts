import { NextResponse } from 'next/server';
import { getProducts, saveProduct, Product } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    const products = await getProducts();
    return NextResponse.json(products);
}

export async function POST(request: Request) {
    const body = await request.json();

    // Basic validation
    if (!body.name || !body.price) {
        return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }

    const newProduct: Product = {
        id: uuidv4(),
        name: body.name,
        price: body.price,
        category: body.category || 'Uncategorized',
        image: body.image || 'https://placehold.co/600x400',
        stock: body.stock || 0,
        description: body.description || '',
    };

    await saveProduct(newProduct);
    return NextResponse.json(newProduct, { status: 201 });
}
