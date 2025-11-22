import { prisma } from './prisma';

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    stock: number;
    description: string;
}

// Get all products
export async function getProducts(): Promise<Product[]> {
    return await prisma.product.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
    return await prisma.product.findMany({
        where: {
            category,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

// Get a single product by ID (alias for compatibility)
export async function getProduct(id: string): Promise<Product | null> {
    return await prisma.product.findUnique({
        where: {
            id,
        },
    });
}

// Get a single product by ID
export async function getProductById(id: string): Promise<Product | null> {
    return await prisma.product.findUnique({
        where: {
            id,
        },
    });
}

// Get featured/trending products (first 4)
export async function getFeaturedProducts(): Promise<Product[]> {
    return await prisma.product.findMany({
        take: 4,
        orderBy: {
            createdAt: 'desc',
        },
    });
}

// Search products by name
export async function searchProducts(query: string): Promise<Product[]> {
    return await prisma.product.findMany({
        where: {
            name: {
                contains: query,
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

// Save (create or update) a product
export async function saveProduct(product: Product): Promise<void> {
    await prisma.product.upsert({
        where: {
            id: product.id,
        },
        update: {
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image,
            stock: product.stock,
            description: product.description,
        },
        create: {
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image,
            stock: product.stock,
            description: product.description,
        },
    });
}

// Delete a product
export async function deleteProduct(id: string): Promise<void> {
    await prisma.product.delete({
        where: {
            id,
        },
    });
}
