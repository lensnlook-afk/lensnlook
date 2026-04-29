import { supabase } from './supabase';
import fs from 'fs/promises';
import path from 'path';

export interface ProductVariant {
    name: string;   // e.g. "Size", "Color"
    options: string[]; // e.g. ["S", "M", "L"] or ["Black", "Gold"]
}

export interface Product {
    id: string;
    name: string;
    price: number;
    discountPrice?: number;
    category: string;
    image: string;
    images?: string[];
    stock: number;
    sku?: string;
    description: string;
    hasPower?: boolean;
    isAccessory?: boolean;
    isActive?: boolean;
    variants?: ProductVariant[];
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    prescription?: string;
    coating?: string;
    variant?: string;
}

export interface Order {
    id: string;
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
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: string;
}

const dataFilePath = path.join(process.cwd(), 'data', 'products.json');
const ordersFilePath = path.join(process.cwd(), 'data', 'orders.json');

// Helper to use local file system if Supabase is not connected
async function getLocalProducts(): Promise<Product[]> {
    try {
        const data = await fs.readFile(dataFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveLocalProduct(product: Product): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Local file storage is not supported in production. Please configure Supabase.');
    }
    
    const products = await getLocalProducts();
    const index = products.findIndex((p) => p.id === product.id);

    if (index >= 0) {
        products[index] = product;
    } else {
        products.push(product);
    }

    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
}

async function deleteLocalProduct(id: string): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Local file storage is not supported in production. Please configure Supabase.');
    }

    const products = await getLocalProducts();
    const filtered = products.filter((p) => p.id !== id);
    await fs.writeFile(dataFilePath, JSON.stringify(filtered, null, 2));
}

export async function getProducts(): Promise<Product[]> {
    if (!supabase) {
        return getLocalProducts();
    }

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching products:', error);
        return getLocalProducts();
    }

    return data as Product[];
}

export async function getProduct(id: string): Promise<Product | undefined> {
    if (!supabase) {
        const products = await getLocalProducts();
        return products.find(p => p.id === id);
    }

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching product:', error);
        return undefined;
    }

    return data as Product;
}

export async function getProductById(id: string): Promise<Product | undefined> {
    return getProduct(id);
}

export async function saveProduct(product: Product): Promise<void> {
    if (!supabase) {
        return saveLocalProduct(product);
    }

    const { error } = await supabase
        .from('products')
        .upsert({
            id: product.id,
            name: product.name,
            price: product.price,
            discount_price: product.discountPrice ?? null,
            category: product.category,
            image: product.image,
            images: product.images ?? [],
            stock: product.stock,
            sku: product.sku ?? null,
            description: product.description,
            hasPower: product.hasPower,
            isAccessory: product.isAccessory,
            is_active: product.isActive ?? true,
            variants: product.variants ?? [],
            tags: product.tags ?? [],
            updated_at: new Date().toISOString(),
        });

    if (error) {
        console.error('Error saving product:', error);
        throw new Error('Failed to save product');
    }
}

export async function quickUpdateStock(id: string, stock: number): Promise<void> {
    if (!supabase) {
        const products = await getLocalProducts();
        const product = products.find(p => p.id === id);
        if (product) {
            product.stock = stock;
            product.updatedAt = new Date().toISOString();
            await saveLocalProduct(product);
        }
        return;
    }
    const { error } = await supabase
        .from('products')
        .update({ stock, updated_at: new Date().toISOString() })
        .eq('id', id);
    if (error) throw new Error('Failed to update stock');
}

export async function toggleProductVisibility(id: string, isActive: boolean): Promise<void> {
    if (!supabase) {
        const products = await getLocalProducts();
        const product = products.find(p => p.id === id);
        if (product) {
            product.isActive = isActive;
            product.updatedAt = new Date().toISOString();
            await saveLocalProduct(product);
        }
        return;
    }
    const { error } = await supabase
        .from('products')
        .update({ is_active: isActive, updated_at: new Date().toISOString() })
        .eq('id', id);
    if (error) throw new Error('Failed to toggle visibility');
}

export async function decrementStock(productId: string, quantity: number): Promise<void> {
    const product = await getProduct(productId);
    if (!product) return;
    const newStock = Math.max(0, product.stock - quantity);
    await quickUpdateStock(productId, newStock);
}

export async function deleteProduct(id: string): Promise<void> {
    if (!supabase) {
        return deleteLocalProduct(id);
    }

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting product:', error);
        throw new Error('Failed to delete product');
    }
}

// --- Order Helpers ---

async function getLocalOrders(): Promise<Order[]> {
    try {
        const data = await fs.readFile(ordersFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function saveLocalOrder(order: Order): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Local file storage is not supported in production. Please configure Supabase.');
    }
    const orders = await getLocalOrders();
    const index = orders.findIndex((o) => o.id === order.id);

    if (index >= 0) {
        orders[index] = order;
    } else {
        orders.push(order);
    }

    await fs.writeFile(ordersFilePath, JSON.stringify(orders, null, 2));
}

export async function getOrders(): Promise<Order[]> {
    if (!supabase) {
        const orders = await getLocalOrders();
        return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        return getLocalOrders();
    }

    return data as Order[];
}

export async function getOrder(id: string): Promise<Order | undefined> {
    if (!supabase) {
        const orders = await getLocalOrders();
        return orders.find(o => o.id === id);
    }

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching order:', error);
        return undefined;
    }

    return data as Order;
}

export async function saveOrder(order: Order): Promise<void> {
    if (!supabase) {
        return saveLocalOrder(order);
    }

    const { error } = await supabase
        .from('orders')
        .upsert({
            id: order.id,
            customer_name: order.customerName,
            customer_email: order.customerEmail,
            customer_phone: order.customerPhone,
            address: order.address,
            city: order.city,
            state: order.state,
            zip: order.zip,
            items: order.items,
            total: order.total,
            payment_method: order.paymentMethod,
            payment_status: order.paymentStatus,
            status: order.status,
            created_at: order.createdAt,
        });

    if (error) {
        console.error('Error saving order:', error);
        throw new Error('Failed to save order');
    }
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    const order = await getOrder(id);
    if (!order) throw new Error('Order not found');
    
    order.status = status;
    await saveOrder(order);
}
