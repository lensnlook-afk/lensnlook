import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: ['query'],
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

async function main() {
    // Clear existing data
    await prisma.product.deleteMany();

    // Seed products
    const products = [
        // Eyeglasses
        {
            name: 'Classic Aviator Frame',
            price: 2499,
            category: 'Eyeglasses',
            image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80',
            stock: 15,
            description: 'Timeless aviator-style eyeglasses with premium metal frame and adjustable nose pads for ultimate comfort.'
        },
        {
            name: 'Modern Rectangle Frame',
            price: 1999,
            category: 'Eyeglasses',
            image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
            stock: 20,
            description: 'Sleek rectangular frames perfect for professional settings. Lightweight and durable acetate construction.'
        },
        {
            name: 'Round Vintage Frame',
            price: 2199,
            category: 'Eyeglasses',
            image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&q=80',
            stock: 12,
            description: 'Retro-inspired round frames that add a touch of vintage charm to any outfit.'
        },
        {
            name: 'Cat-Eye Fashion Frame',
            price: 2799,
            category: 'Eyeglasses',
            image: 'https://images.unsplash.com/photo-1622519407650-3df9883f76e6?w=800&q=80',
            stock: 8,
            description: 'Bold cat-eye frames for those who want to make a statement. Perfect blend of retro and modern.'
        },

        // Sunglasses
        {
            name: 'Polarized Sport Sunglasses',
            price: 3499,
            category: 'Sunglasses',
            image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
            stock: 18,
            description: 'High-performance polarized lenses with UV400 protection. Perfect for outdoor activities.'
        },
        {
            name: 'Classic Wayfarer Sunglasses',
            price: 2999,
            category: 'Sunglasses',
            image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80',
            stock: 25,
            description: 'Iconic wayfarer design with premium CR-39 lenses. A timeless classic that never goes out of style.'
        },
        {
            name: 'Oversized Glamour Sunglasses',
            price: 3299,
            category: 'Sunglasses',
            image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=80',
            stock: 10,
            description: 'Oversized frames for maximum sun protection and glamorous style. Perfect for beach days.'
        },
        {
            name: 'Pilot Aviator Sunglasses',
            price: 3799,
            category: 'Sunglasses',
            image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80',
            stock: 14,
            description: 'Classic pilot-style aviators with gradient lenses and gold-tone metal frames.'
        },

        // Computer Glasses
        {
            name: 'Blue Light Blocking Glasses',
            price: 1799,
            category: 'Computer Glasses',
            image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&q=80',
            stock: 30,
            description: 'Reduce eye strain with our blue light filtering technology. Perfect for long screen time.'
        },
        {
            name: 'Anti-Glare Work Glasses',
            price: 1999,
            category: 'Computer Glasses',
            image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80',
            stock: 22,
            description: 'Anti-reflective coating reduces glare from screens. Ideal for office workers and gamers.'
        },
        {
            name: 'Premium Blue Shield Glasses',
            price: 2299,
            category: 'Computer Glasses',
            image: 'https://images.unsplash.com/photo-1622519407650-3df9883f76e6?w=800&q=80',
            stock: 16,
            description: 'Advanced blue light protection with stylish frames. Protect your eyes in style.'
        },

        // Contact Lenses
        {
            name: 'Daily Disposable Lenses (30 Pack)',
            price: 1499,
            category: 'Contact Lenses',
            image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80',
            stock: 50,
            description: 'Ultra-comfortable daily disposable contact lenses. Fresh pair every day for optimal hygiene.'
        },
        {
            name: 'Monthly Silicone Hydrogel Lenses',
            price: 2199,
            category: 'Contact Lenses',
            image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80',
            stock: 40,
            description: 'Breathable silicone hydrogel material for all-day comfort. Monthly replacement schedule.'
        },
        {
            name: 'Colored Contact Lenses',
            price: 1899,
            category: 'Contact Lenses',
            image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80',
            stock: 35,
            description: 'Change your eye color with our safe and comfortable colored lenses. Available in multiple shades.'
        },
        {
            name: 'Toric Lenses for Astigmatism',
            price: 2599,
            category: 'Contact Lenses',
            image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80',
            stock: 28,
            description: 'Specially designed toric lenses for astigmatism correction. Clear vision all day long.'
        },
    ];

    for (const product of products) {
        await prisma.product.create({
            data: product,
        });
    }

    console.log('✅ Database seeded successfully!');
    console.log(`📦 Created ${products.length} products`);
}

// Only run if this file is executed directly
if (require.main === module) {
    main()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}
