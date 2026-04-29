import { getProduct } from '@/lib/db';
import AddToCartButton from '@/components/AddToCartButton';
import { notFound } from 'next/navigation';
import { Star, Shield, Truck, Info, Sparkles, ChevronRight, Eye, Layers, Zap } from 'lucide-react';
import Link from 'next/link';
import BuyNowButton from '@/components/BuyNowButton';
import ProductSelection from '@/components/ProductSelection';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = await getProduct(id);
    
    if (!product) return { title: 'Product Not Found' };

    return {
        title: `${product.name} | Lens&Look Luxury`,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            images: [{ url: product.image }],
            type: 'website',
        },
    };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="bg-background min-h-screen pt-20 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <div className="py-8 flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link href={`/products?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-primary">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
                    {/* Visual Showcase */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/5 rounded-[4rem] blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative aspect-square bg-card/50 backdrop-blur-sm rounded-[3rem] border border-border/50 flex items-center justify-center p-12 overflow-hidden shadow-2xl shadow-black/[0.02]">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transform hover:scale-110 transition-transform duration-1000 ease-out drop-shadow-2xl"
                            />

                            {/* Animated Accents */}
                            <div className="absolute top-10 right-10 flex flex-col space-y-4">
                                <div className="p-4 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 animate-bounce">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Information Scarcity Design */}
                    <div className="flex flex-col justify-center space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                    {product.category}
                                </span>
                                <span className="flex items-center space-x-1 text-accent font-bold text-xs uppercase tracking-tighter">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>Premium Edition</span>
                                </span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter leading-none">
                                {product.name}<span className="text-primary">.</span>
                            </h1>

                            <div className="flex items-center space-x-6 pb-8 border-b border-border/50">
                                <span className="text-4xl font-black text-foreground italic">₹{product.price.toLocaleString()}</span>
                                <div className="h-8 w-px bg-border" />
                                <div className="flex items-center space-x-3">
                                    <div className="flex text-accent">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <span className="text-xs font-bold text-muted-foreground uppercase opacity-60">120+ Collectors</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-lg text-muted-foreground leading-relaxed font-medium max-w-xl italic">
                            "{product.description}"
                        </p>

                        <ProductSelection product={product} />


                        {/* Logistics */}
                        <div className="grid grid-cols-2 gap-8 pt-10 border-t border-border/50">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Global Warranty</span>
                                    <span className="text-[11px] font-bold text-muted-foreground">12 Months Coverage</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Truck className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Express Transit</span>
                                    <span className="text-[11px] font-bold text-muted-foreground">Free 48h Delivery</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technical Specifications - Expanded Context */}
                <div className="mb-24 p-16 bg-card rounded-[4rem] border border-border shadow-2xl shadow-black/[0.02]">
                    <div className="max-w-3xl space-y-12">
                        <div className="space-y-4">
                            <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">Craftsmanship</span>
                            <h2 className="text-4xl font-black tracking-tighter">Beyond the Frame.</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed font-medium">
                                Each piece in this collection is an intersection of precision engineering and artistic flair.
                                Using aerospace-grade materials and hand-finished accents, we ensure that your vision isn't just corrected, but elevated.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                            {[
                                { label: 'Frame Material', value: 'High-Tensile Titanium' },
                                { label: 'Lens Tech', value: 'Poly-Clear HD Plus' },
                                { label: 'Weight', value: '18 grams' },
                                { label: 'Hinges', value: 'Italian Flex-Action' },
                                { label: 'Nose Pads', value: 'Cloud-Sill Comfort' },
                                { label: 'Artisan', value: 'Hand-Finished' },
                            ].map((spec, idx) => (
                                <div key={idx} className="space-y-2">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-60">{spec.label}</p>
                                    <p className="text-lg font-black text-foreground italic">{spec.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
