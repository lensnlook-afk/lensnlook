import { Resend } from 'resend';

import { Order } from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.ADMIN_EMAIL || 'admin@lensnlook.com';

export async function sendOrderConfirmationEmail(order: Order) {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_api_key') {
        console.log('Skipping email: Resend API Key not configured.');
        return;
    }

    try {
        // Email to Customer
        await resend.emails.send({
            from: 'Lens&Look <orders@lensnlook.com>',
            to: order.customerEmail,
            subject: `Order Confirmed: #${order.id.slice(0, 8).toUpperCase()}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #000;">Thank you for your order, ${order.customerName}!</h2>
                    <p>We've received your order and we're getting it ready.</p>
                    <hr />
                    <h3>Order Summary</h3>
                    <p><strong>Order ID:</strong> #${order.id.toUpperCase()}</p>
                    <p><strong>Total Amount:</strong> ₹${order.total.toLocaleString()}</p>
                    <p><strong>Shipping Address:</strong> ${order.address}, ${order.city}, ${order.state} ${order.zip}</p>
                    <hr />
                    <h3>Items</h3>
                    ${order.items.map((item) => `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span>${item.name} (x${item.quantity})</span>
                            <span>₹${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                    `).join('')}
                    <hr />
                    <p style="font-size: 12px; color: #666;">If you have any questions, please contact our support team.</p>
                </div>
            `,
        });

        // Notification to Admin
        await resend.emails.send({
            from: 'Lens&Look System <system@lensnlook.com>',
            to: adminEmail,
            subject: `New Acquisition Alert: #${order.id.slice(0, 8).toUpperCase()}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
                    <h2 style="color: #000;">New Order Received!</h2>
                    <p><strong>Customer:</strong> ${order.customerName} (${order.customerEmail})</p>
                    <p><strong>Value:</strong> ₹${order.total.toLocaleString()}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://lensnlook.vercel.app'}/admin/orders" 
                       style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                        View in Command Center
                    </a>
                </div>
            `,
        });

        console.log('Notifications sent successfully.');
    } catch (error) {
        console.error('Error sending emails:', error);
    }
}

export async function sendStatusUpdateEmail(order: Order) {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_api_key') return;

    try {
        await resend.emails.send({
            from: 'Lens&Look <orders@lensnlook.com>',
            to: order.customerEmail,
            subject: `Order Update: #${order.id.slice(0, 8).toUpperCase()}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #000;">Good news, ${order.customerName}!</h2>
                    <p>Your order status has been updated to: <strong>${order.status.toUpperCase()}</strong></p>
                    <hr />
                    <p>Order ID: #${order.id.toUpperCase()}</p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://lensnlook.vercel.app'}/orders/${order.id}" 
                       style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                        Track Order
                    </a>
                </div>
            `,
        });
    } catch (error) {
        console.error('Error sending status update email:', error);
    }
}
