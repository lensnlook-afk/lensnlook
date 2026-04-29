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

        return { success: true, orderId: newOrder.id, error: undefined };
    } catch (error: any) {
        console.error('Failed to save order to DB:', error);
        
        // CRITICAL: If database save fails, we STILL return success: true 
        // because the primary goal is the WhatsApp redirection.
        // We include a 'dbError' flag just in case we want to handle it.
        return { 
            success: true, 
            orderId: uuidv4(), // Fallback ID if save failed
            warning: 'Order saved to WhatsApp only (DB sync skipped)',
            error: error.message || 'Database sync failed'
        };
    }
}
