import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function generateWhatsAppUrl(orderData: {
  customerName: string;
  customerPhone: string;
  address: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    prescription?: string;
    coating?: string;
  }[];
  total: number;
  paymentMethod: string;
  notes?: string;
}) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '917899200661';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lensnlook.vercel.app';
  
  const itemsText = orderData.items.map(item => 
    `✨ *${item.name.toUpperCase()}*\n` +
    `   🔹 *Quantity:* ${item.quantity}\n` +
    `   🔹 *Value:* ${formatPrice(item.price * item.quantity)}\n` +
    `${item.prescription ? `   🔹 *Prescription:* ${item.prescription}\n` : ''}` +
    `${item.coating ? `   🔹 *Lens:* ${item.coating}\n` : ''}` +
    `   🔹 *Reference:* ${baseUrl}/products/${item.id}\n` +
    `   🔹 *Preview:* ${item.image}`
  ).join('\n\n');

  const message = 
    `💎 *LENS & LOOK | LUXURY ELITE ORDER* 💎\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `⚜️ *CLIENT INFORMATION*\n` +
    `━━━━━━━━━━━━━━\n` +
    `👤 *Name:* ${orderData.customerName}\n` +
    `📞 *Contact:* ${orderData.customerPhone}\n\n` +
    `📍 *DELIVERY DESTINATION*\n` +
    `━━━━━━━━━━━━━━\n` +
    `🏠 *Address:* ${orderData.address}\n\n` +
    `📦 *SELECTED ACQUISITIONS*\n` +
    `━━━━━━━━━━━━━━\n` +
    `${itemsText}\n\n` +
    `💳 *PAYMENT SUMMARY*\n` +
    `━━━━━━━━━━━━━━\n` +
    `💰 *Grand Total:* ${formatPrice(orderData.total)}\n` +
    `🚚 *Logistics:* Express Insured Shipping\n` +
    `🏦 *Method:* ${orderData.paymentMethod}\n` +
    `${orderData.notes ? `\n📝 *SPECIAL INSTRUCTIONS*\n━━━━━━━━━━━━━━\n💭 ${orderData.notes}\n` : ''}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `✨ _Excellence in Every Vision_ ✨\n` +
    `_Generated via Lens&Look Elite Portal_`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
