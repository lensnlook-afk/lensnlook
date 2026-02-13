'use client';

import { Product } from '@/lib/db';
import { createProduct, updateProduct } from '@/app/admin/actions';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, Image as ImageIcon, X, Loader2, Sparkles, Box, DollarSign, Type, FileText } from 'lucide-react';
import { useState, useRef, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ProductFormProps {
    product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
    const isEditing = !!product;
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [imageUrl, setImageUrl] = useState(product?.image || '');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            console.log('No file selected');
            return;
        }

        console.log('Starting upload for:', file.name, file.type, file.size);
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            console.log('Sending upload request...');
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            console.log('Upload response status:', res.status);
            const data = await res.json();
            console.log('Upload response data:', data);

            if (!res.ok) {
                throw new Error(data.error || data.details || 'Upload failed');
            }

            if (!data.url) {
                throw new Error('No URL returned from upload');
            }

            console.log('Upload successful, URL:', data.url);
            setImageUrl(data.url);
            alert('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            alert(`Failed to upload image: ${errorMessage}\n\nPlease try again or check the console for details.`);
        } finally {
            setIsUploading(false);
        }
    };

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            try {
                console.log('Submitting product form...');
                console.log('Image URL:', imageUrl);
                console.log('Has Power:', formData.get('hasPower'));
                console.log('Is Accessory:', formData.get('isAccessory'));

                if (isEditing) {
                    await updateProduct(product.id, formData);
                } else {
                    await createProduct(formData);
                }
                console.log('Product saved successfully');
                router.push('/admin/products');
                router.refresh();
            } catch (error) {
                console.error('Error saving product:', error);
                alert(`Failed to save product: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
    }

    return (
        <form action={handleSubmit} className="max-w-5xl mx-auto space-y-12 pb-24">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 sticky top-0 z-30 py-6 bg-background/80 backdrop-blur-xl border-b border-border/50 -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="flex items-center space-x-6">
                    <Link
                        href="/admin/products"
                        className="p-4 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-2xl transition-all shadow-sm active:scale-95"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <div className="flex items-center space-x-2 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Catalog Management</span>
                        </div>
                        <h1 className="text-4xl font-black text-foreground tracking-tighter">
                            {isEditing ? 'Refine Masterpiece.' : 'Catalog New Piece.'}
                        </h1>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isPending || isUploading}
                    className="bg-primary text-white px-10 py-5 rounded-2xl flex items-center space-x-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 font-bold group disabled:opacity-50 disabled:cursor-wait"
                >
                    {isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                    <span>{isEditing ? 'Commit Changes' : 'Sanctify to Catalog'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Identity Info */}
                <div className="lg:col-span-2 space-y-12">
                    <div className="bg-card p-10 rounded-[3rem] border border-border shadow-2xl shadow-black/[0.02] space-y-10 relative overflow-hidden">
                        <div className="flex items-center space-x-3 pb-6 border-b border-border/50">
                            <Type className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-black tracking-tighter uppercase">Visual Identity</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label htmlFor="name" className="text-xs font-black text-muted-foreground uppercase tracking-widest pl-1">
                                    Nomenclature / Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    defaultValue={product?.name}
                                    className="w-full bg-muted/30 px-6 py-5 rounded-[1.5rem] border border-border focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-lg"
                                    placeholder="e.g. Zenith Avant-Garde Gold"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label htmlFor="category" className="text-xs font-black text-muted-foreground uppercase tracking-widest pl-1">
                                        Archetype / Category
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        required
                                        defaultValue={product?.category}
                                        className="w-full bg-muted/30 px-6 py-5 rounded-[1.5rem] border border-border focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium appearance-none cursor-pointer"
                                    >
                                        <option value="">Select Archetype</option>
                                        <option value="Eyeglasses">Eyeglasses</option>
                                        <option value="Sunglasses">Sunglasses</option>
                                        <option value="Contact Lenses">Contact Lenses</option>
                                        <option value="Computer Glasses">Computer Glasses</option>
                                        <option value="Accessories">Accessories</option>
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="price" className="text-xs font-black text-muted-foreground uppercase tracking-widest pl-1">
                                        Valuation (INR)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground font-black">₹</span>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            required
                                            min="0"
                                            step="0.01"
                                            defaultValue={product?.price}
                                            className="w-full bg-muted/30 pl-12 pr-6 py-5 rounded-[1.5rem] border border-border focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-black text-lg"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label htmlFor="description" className="text-xs font-black text-muted-foreground uppercase tracking-widest pl-1 flex items-center space-x-2">
                                    <FileText className="w-3 h-3" />
                                    <span>Artistic Description</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={5}
                                    defaultValue={product?.description}
                                    className="w-full bg-muted/30 px-6 py-5 rounded-[1.5rem] border border-border focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all resize-none font-medium leading-relaxed"
                                    placeholder="Describe the craftsmanship and allure of this piece..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card p-10 rounded-[3rem] border border-border shadow-2xl shadow-black/[0.02] space-y-8">
                        <div className="flex items-center space-x-3 pb-6 border-b border-border/50">
                            <Box className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-black tracking-tighter uppercase">Inventory Logistics</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label htmlFor="stock" className="text-xs font-black text-muted-foreground uppercase tracking-widest pl-1">
                                    Stock Allocation
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    required
                                    min="0"
                                    defaultValue={product?.stock}
                                    className="w-full bg-muted/30 px-6 py-5 rounded-[1.5rem] border border-border focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-black"
                                    placeholder="0 items available"
                                />
                                <p className="text-[10px] text-muted-foreground font-medium pl-1 italic">
                                    Set to zero for "Exhausted" status.
                                </p>
                            </div>

                            <div className="space-y-6 flex flex-col justify-center">
                                <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
                                    <input
                                        type="checkbox"
                                        id="hasPower"
                                        name="hasPower"
                                        defaultChecked={product?.hasPower}
                                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="hasPower" className="text-sm font-bold cursor-pointer">
                                        Supports Custom Power
                                    </label>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
                                    <input
                                        type="checkbox"
                                        id="isAccessory"
                                        name="isAccessory"
                                        defaultChecked={product?.isAccessory}
                                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                                    />
                                    <label htmlFor="isAccessory" className="text-sm font-bold cursor-pointer">
                                        Mark as Accessory
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Aesthetic Preview & Asset Upload */}
                <div className="space-y-12">
                    <div className="bg-card p-10 rounded-[3rem] border border-border shadow-2xl shadow-black/[0.02] space-y-8 sticky top-[150px]">
                        <div className="flex items-center justify-between pb-6 border-b border-border/50">
                            <div className="flex items-center space-x-3">
                                <ImageIcon className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-black tracking-tighter uppercase">Visual Asset</h2>
                            </div>
                        </div>

                        <input type="hidden" name="image" value={imageUrl} />

                        <div className="space-y-6">
                            <div
                                className={cn(
                                    "relative aspect-[4/5] rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden group",
                                    imageUrl ? "border-primary/50 bg-background shadow-inner" : "border-border hover:border-primary/30 hover:bg-primary/[0.02]"
                                )}
                            >
                                {imageUrl ? (
                                    <>
                                        <img
                                            src={imageUrl}
                                            alt="Preview"
                                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700 mix-blend-multiply dark:mix-blend-normal"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => setImageUrl('')}
                                                className="p-4 bg-white text-red-500 rounded-full shadow-2xl hover:bg-red-50 transition-colors"
                                            >
                                                <X className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-8 space-y-4">
                                        <div className="w-20 h-20 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                                            <Upload className="w-8 h-8" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-black uppercase tracking-widest text-foreground">
                                                {isUploading ? 'Syncing...' : 'Missing Asset'}
                                            </p>
                                            <p className="text-xs text-muted-foreground font-medium">
                                                Tap to upload high-res piece
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 w-full h-full cursor-pointer z-10"
                                    aria-label="Upload Image"
                                />
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />

                            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Curator Note.</h4>
                                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed italic">
                                    Product imagery is the soul of the catalog. Ensure transparent or clean backgrounds for maximum impact.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
