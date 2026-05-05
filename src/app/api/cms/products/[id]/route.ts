import { NextResponse } from 'next/server';
import { deleteProduct, getProduct } from '@/lib/db';
import { cookies } from 'next/headers';

async function checkAdmin() {
    const cookieStore = await cookies();
    return cookieStore.get('isAdmin')?.value === 'true';
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const product = await getProduct(id);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    return NextResponse.json(product);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { id } = await params;
        await deleteProduct(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
