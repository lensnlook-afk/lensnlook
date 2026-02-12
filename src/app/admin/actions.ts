'use server';

import { saveProduct, deleteProduct, Product } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export async function createProduct(formData: FormData) {
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const image = formData.get('image') as string;
    const stock = parseInt(formData.get('stock') as string);
    const description = formData.get('description') as string;

    const newProduct: Product = {
        id: uuidv4(),
        name,
        price,
        category,
        image: image || 'https://placehold.co/600x400',
        stock,
        description,
    };

    await saveProduct(newProduct);
    revalidatePath('/admin/products');
    redirect('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const image = formData.get('image') as string;
    const stock = parseInt(formData.get('stock') as string);
    const description = formData.get('description') as string;

    const updatedProduct: Product = {
        id,
        name,
        price,
        category,
        image,
        stock,
        description,
    };

    await saveProduct(updatedProduct);
    revalidatePath('/admin/products');
    redirect('/admin/products');
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
