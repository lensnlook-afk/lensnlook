'use server';

import { saveOrder, Order, OrderItem } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function placeOrder(orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    items: OrderItem[];
    total: number;
    paymentMethod: string;
    paymentStatus: 'pending' | 'paid' | 'failed';
}) {
    try {
        const newOrder: Order = {
            id: uuidv4(),
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        await saveOrder(newOrder);
        
        // Send email notifications asynchronously
        sendOrderConfirmationEmail(newOrder).catch(err => console.error('Email failed:', err));

        return { success: true, orderId: newOrder.id };
    } catch (error) {
        console.error('Failed to place order:', error);
        return { success: false, error: 'Failed to place order' };
    }
}
