'use server';

import {
    saveProduct,
    deleteProduct,
    Product,
    ProductVariant,
    updateOrderStatus,
    Order,
    getOrder,
    getProductById,
    quickUpdateStock,
    toggleProductVisibility,
} from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { sendStatusUpdateEmail } from '@/lib/email';

export async function adminLogin(password: string) {
    const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'admin123';
    if (password === ADMIN_PASS) {
        const cookieStore = await cookies();
        cookieStore.set('isAdmin', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24,
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

function parseProductFormData(formData: FormData, existingId?: string): Product {
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const discountPriceRaw = formData.get('discountPrice') as string;
    const discountPrice = discountPriceRaw ? parseFloat(discountPriceRaw) : undefined;
    const category = formData.get('category') as string;
    const image = formData.get('image') as string;
    const imagesRaw = formData.get('images') as string;
    const images = imagesRaw ? JSON.parse(imagesRaw) : [];
    const stock = parseInt(formData.get('stock') as string);
    const sku = (formData.get('sku') as string) || undefined;
    const description = formData.get('description') as string;
    const hasPower = formData.get('hasPower') === 'on';
    const isAccessory = formData.get('isAccessory') === 'on';
    const isActive = formData.get('isActive') !== 'off';
    const variantsRaw = formData.get('variants') as string;
    const variants: ProductVariant[] = variantsRaw ? JSON.parse(variantsRaw) : [];
    const tagsRaw = formData.get('tags') as string;
    const tags: string[] = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

    if (!name || !category) throw new Error('Name and category are required');
    if (isNaN(price) || isNaN(stock)) throw new Error('Price and stock must be valid numbers');

    return {
        id: existingId || uuidv4(),
        name,
        price,
        discountPrice,
        category,
        image: image || 'https://placehold.co/600x400',
        images,
        stock,
        sku,
        description,
        hasPower,
        isAccessory,
        isActive,
        variants,
        tags,
        createdAt: existingId ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}

export async function createProduct(formData: FormData) {
    try {
        const product = parseProductFormData(formData);
        await saveProduct(product);
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
        const product = parseProductFormData(formData, id);
        await saveProduct(product);
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

export async function quickStockUpdateAction(id: string, stock: number) {
    try {
        await quickUpdateStock(id, stock);
        revalidatePath('/admin/products');
        revalidatePath('/products');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to update stock:', error);
        return { success: false, error: 'Failed to update stock' };
    }
}

export async function toggleVisibilityAction(id: string, isActive: boolean) {
    try {
        await toggleProductVisibility(id, isActive);
        revalidatePath('/admin/products');
        revalidatePath('/products');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to toggle visibility:', error);
        return { success: false, error: 'Failed to toggle visibility' };
    }
}

export async function duplicateProductAction(id: string) {
    try {
        const original = await getProductById(id);
        if (!original) throw new Error('Product not found');
        const duplicate: Product = {
            ...original,
            id: uuidv4(),
            name: `${original.name} (Copy)`,
            sku: original.sku ? `${original.sku}-COPY` : undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        await saveProduct(duplicate);
        revalidatePath('/admin/products');
        return { success: true, id: duplicate.id };
    } catch (error) {
        console.error('Failed to duplicate product:', error);
        return { success: false, error: 'Failed to duplicate product' };
    }
}

export async function bulkDeleteProductsAction(ids: string[]) {
    try {
        await Promise.all(ids.map(id => deleteProduct(id)));
        revalidatePath('/admin/products');
        revalidatePath('/products');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to bulk delete:', error);
        return { success: false, error: 'Failed to delete products' };
    }
}

export async function bulkToggleVisibilityAction(ids: string[], isActive: boolean) {
    try {
        await Promise.all(ids.map(id => toggleProductVisibility(id, isActive)));
        revalidatePath('/admin/products');
        revalidatePath('/products');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to bulk toggle visibility:', error);
        return { success: false, error: 'Failed to update products' };
    }
}

export async function bulkImportProductsAction(products: Omit<Product, 'id'>[]) {
    try {
        const toSave: Product[] = products.map(p => ({
            ...p,
            id: uuidv4(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: p.isActive ?? true,
        }));
        await Promise.all(toSave.map(p => saveProduct(p)));
        revalidatePath('/admin/products');
        revalidatePath('/products');
        revalidatePath('/');
        return { success: true, count: toSave.length };
    } catch (error) {
        console.error('Failed to bulk import:', error);
        return { success: false, error: 'Failed to import products' };
    }
}

export async function updateOrderStatusAction(id: string, status: Order['status']) {
    try {
        await updateOrderStatus(id, status);
        const order = await getOrder(id);
        if (order) {
            sendStatusUpdateEmail(order).catch(err => console.error('Status update email failed:', err));
        }
        revalidatePath('/admin/orders');
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error('Failed to update order status:', error);
        return { success: false, error: 'Failed to update order status' };
    }
}
