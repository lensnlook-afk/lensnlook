'use server';

import { saveOrder, Order, OrderItem } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function placeOrder(orderData: {
    customerName: string;
    customerEmail: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    items: OrderItem[];
    total: number;
}) {
    try {
        const newOrder: Order = {
            id: uuidv4(),
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        await saveOrder(newOrder);
        return { success: true, orderId: newOrder.id };
    } catch (error) {
        console.error('Failed to place order:', error);
        return { success: false, error: 'Failed to place order' };
    }
}
