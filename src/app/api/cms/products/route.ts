import { NextResponse } from 'next/server';
import { getProducts, saveProduct, deleteProduct, Product } from '@/lib/db';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

// Helper to check admin status
async function checkAdmin() {
    const cookieStore = await cookies();
    return cookieStore.get('isAdmin')?.value === 'true';
}

export async function GET() {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const products = await getProducts();
    return NextResponse.json(products);
}

export async function POST(request: Request) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const data = await request.json();
        const product: Product = {
            ...data,
            id: data.id || uuidv4(),
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        await saveProduct(product);
        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
