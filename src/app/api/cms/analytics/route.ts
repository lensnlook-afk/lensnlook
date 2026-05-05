import { NextResponse } from 'next/server';
import { getProducts, getOrders } from '@/lib/db';
import { cookies } from 'next/headers';

async function checkAdmin() {
    const cookieStore = await cookies();
    return cookieStore.get('isAdmin')?.value === 'true';
}

export async function GET() {
    if (!(await checkAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = await getProducts();
    const orders = await getOrders();

    const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.stock < 10).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;

    // Revenue by category
    const revenueByCategory: Record<string, number> = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            // We'd need to link item to category, but for now we'll just use the item's info if available
            // In a real app, you'd fetch the product to get its category
        });
    });

    // Simple daily revenue for the last 7 days
    const dailyRevenue: Record<string, number> = {};
    const now = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dailyRevenue[dateStr] = 0;
    }

    orders.forEach(order => {
        const dateStr = new Date(order.createdAt).toISOString().split('T')[0];
        if (dailyRevenue[dateStr] !== undefined) {
            dailyRevenue[dateStr] += order.total;
        }
    });

    return NextResponse.json({
        metrics: {
            totalRevenue,
            totalOrders,
            totalProducts,
            lowStockCount,
            outOfStockCount
        },
        dailyRevenue: Object.entries(dailyRevenue).map(([date, amount]) => ({ date, amount })).reverse()
    });
}
