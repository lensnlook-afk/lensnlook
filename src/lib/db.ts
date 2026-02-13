import { supabase } from './supabase';
import fs from 'fs/promises';
import path from 'path';

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    stock: number;
    description: string;
    hasPower?: boolean;
    isAccessory?: boolean;
}

const dataFilePath = path.join(process.cwd(), 'data', 'products.json');

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
            category: product.category,
            image: product.image,
            stock: product.stock,
            description: product.description,
            hasPower: product.hasPower,
            isAccessory: product.isAccessory,
        });

    if (error) {
        console.error('Error saving product:', error);
        throw new Error('Failed to save product');
    }
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
