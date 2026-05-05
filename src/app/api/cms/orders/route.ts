import { NextResponse } from 'next/server';
import { getOrders, saveOrder, getOrder, Order } from '@/lib/db';
import { cookies } from 'next/headers';

async function checkAdmin() {
    const cookieStore = await cookies();
    return cookieStore.get('isAdmin')?.value === 'true';
}

export async function GET() {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const orders = await getOrders();
    return NextResponse.json(orders);
}

export async function PATCH(request: Request) {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const { id, status } = await request.json();
        const order = await getOrder(id);
        if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        
        const updatedOrder: Order = { ...order, status };
        await saveOrder(updatedOrder);
        return NextResponse.json(updatedOrder);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
