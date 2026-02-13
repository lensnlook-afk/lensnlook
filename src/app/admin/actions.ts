'use server';

import { saveProduct, deleteProduct, Product } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

export async function adminLogin(password: string) {
    // In a real app, use environment variables and hashing
    const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';

    if (password === ADMIN_PASS) {
        const cookieStore = await cookies();
        cookieStore.set('isAdmin', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24, // 24 hours
        });
        return { success: true };
    }
    return { success: false, error: 'Invalid password' };
}

export async function adminLogout() {
    const cookieStore = await cookies();
    cookieStore.delete('isAdmin');
    redirect('/admin/login');
}

export async function createProduct(formData: FormData) {
    try {
        console.log('=== Creating Product ===');
        const name = formData.get('name') as string;
        const price = parseFloat(formData.get('price') as string);
        const category = formData.get('category') as string;
        const image = formData.get('image') as string;
        const stock = parseInt(formData.get('stock') as string);
        const description = formData.get('description') as string;
        const hasPower = formData.get('hasPower') === 'on';
        const isAccessory = formData.get('isAccessory') === 'on';

        console.log('Form data:', { name, price, category, image, stock, description, hasPower, isAccessory });

        if (!name || !category) {
            throw new Error('Name and category are required');
        }

        if (isNaN(price) || isNaN(stock)) {
            throw new Error('Price and stock must be valid numbers');
        }

        const newProduct: Product = {
            id: uuidv4(),
            name,
            price,
            category,
            image: image || 'https://placehold.co/600x400',
            stock,
            description,
            hasPower,
            isAccessory,
        };

        console.log('Saving product:', newProduct);
        await saveProduct(newProduct);
        console.log('Product saved successfully');

        revalidatePath('/admin/products');
        revalidatePath('/products');
        revalidatePath('/');
        redirect('/admin/products');
    } catch (error) {
        console.error('Error in createProduct:', error);
        throw error;
    }
}

export async function updateProduct(id: string, formData: FormData) {
    try {
        console.log('=== Updating Product ===');
        console.log('Product ID:', id);

        const name = formData.get('name') as string;
        const price = parseFloat(formData.get('price') as string);
        const category = formData.get('category') as string;
        const image = formData.get('image') as string;
        const stock = parseInt(formData.get('stock') as string);
        const description = formData.get('description') as string;
        const hasPower = formData.get('hasPower') === 'on';
        const isAccessory = formData.get('isAccessory') === 'on';

        console.log('Form data:', { name, price, category, image, stock, description, hasPower, isAccessory });

        if (!name || !category) {
            throw new Error('Name and category are required');
        }

        if (isNaN(price) || isNaN(stock)) {
            throw new Error('Price and stock must be valid numbers');
        }

        const updatedProduct: Product = {
            id,
            name,
            price,
            category,
            image,
            stock,
            description,
            hasPower,
            isAccessory,
        };

        console.log('Updating product:', updatedProduct);
        await saveProduct(updatedProduct);
        console.log('Product updated successfully');

        revalidatePath('/admin/products');
        revalidatePath('/products');
        revalidatePath('/');
        redirect('/admin/products');
    } catch (error) {
        console.error('Error in updateProduct:', error);
        throw error;
    }
}

export async function deleteProductAction(id: string) {
    try {
        await deleteProduct(id);
        revalidatePath('/admin/products');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete product:', error);
        return { success: false, error: 'Failed to delete product' };
    }
}
