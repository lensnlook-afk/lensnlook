'use client';

import { Product, ProductVariant } from '@/lib/db';
import { createProduct, updateProduct } from '@/app/admin/actions';
import Link from 'next/link';
import {
    ArrowLeft, Save, Upload, X, Loader2, Plus, Trash2,
    Tag, Package, DollarSign, Type, FileText, ToggleLeft,
    ToggleRight, Image as ImageIcon, Layers, Hash, Percent,
    GripVertical, AlertCircle, CheckCircle2
} from 'lucide-react';
import { useState, useRef, useTransition, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ProductFormProps {
    product?: Product;
}

const CATEGORIES = [
    'Eyeglasses',
    'Sunglasses',
    'Contact Lenses',
    'Computer Glasses',
    'Accessories',
    'Reading Glasses',
    'Sports Eyewear',
    'Kids Eyewear',
];

export default function ProductForm({ product }: ProductFormProps) {
    const isEditing = !!product;
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Image state
    const [primaryImage, setPrimaryImage] = useState(product?.image || '');
    const [additionalImages, setAdditionalImages] = useState<string[]>(product?.images || []);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const additionalFileInputRef = useRef<HTMLInputElement>(null);

    // Variants state
    const [variants, setVariants] = useState<ProductVariant[]>(product?.variants || []);
    const [newVariantName, setNewVariantName] = useState('');
    const [newVariantOptions, setNewVariantOptions] = useState('');

    // Form state
    const [isActive, setIsActive] = useState(product?.isActive ?? true);
    const [tags, setTags] = useState<string[]>(product?.tags || []);
    const [tagInput, setTagInput] = useState('');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    };

    // ── Image Upload ──────────────────────────────────────────────
    const uploadFile = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        return data.url;
    };

    const handlePrimaryImageUpload = async (file: File) => {
        setIsUploading(true);
        try {
            const url = await uploadFile(file);
            setPrimaryImage(url);
            showToast('success', 'Primary image uploaded');
        } catch (e) {
            showToast('error', e instanceof Error ? e.message : 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleAdditionalImageUpload = async (files: FileList | File[]) => {
        setUploadingIndex(-1);
        let successCount = 0;
        let failCount = 0;

        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                try {
                    const url = await uploadFile(file);
                    setAdditionalImages(prev => [...prev, url]);
                    successCount++;
                } catch (e) {
                    failCount++;
                }
            });

            await Promise.all(uploadPromises);

            if (successCount > 0) {
                showToast('success', `${successCount} image(s) added`);
            }
            if (failCount > 0) {
                showToast('error', `Failed to upload ${failCount} image(s)`);
            }
        } finally {
            setUploadingIndex(null);
        }
    };

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            await handlePrimaryImageUpload(file);
        }
    }, []);

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);

    const removeAdditionalImage = (index: number) => {
        setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    };

    // ── Variants ──────────────────────────────────────────────────
    const addVariant = () => {
        if (!newVariantName.trim() || !newVariantOptions.trim()) return;
        const options = newVariantOptions.split(',').map(o => o.trim()).filter(Boolean);
        setVariants(prev => [...prev, { name: newVariantName.trim(), options }]);
        setNewVariantName('');
        setNewVariantOptions('');
    };

    const removeVariant = (index: number) => {
        setVariants(prev => prev.filter((_, i) => i !== index));
    };

    // ── Tags ──────────────────────────────────────────────────────
    const addTag = () => {
        const t = tagInput.trim();
        if (t && !tags.includes(t)) {
            setTags(prev => [...prev, t]);
        }
        setTagInput('');
    };

    const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

    // ── Submit ────────────────────────────────────────────────────
    async function handleSubmit(formData: FormData) {
        formData.set('image', primaryImage);
        formData.set('images', JSON.stringify(additionalImages));
        formData.set('variants', JSON.stringify(variants));
        formData.set('tags', tags.join(','));
        if (!isActive) formData.set('isActive', 'off');

        startTransition(async () => {
            try {
                if (isEditing) {
                    await updateProduct(product.id, formData);
                } else {
                    await createProduct(formData);
                }
                router.push('/admin/products');
                router.refresh();
            } catch (error) {
                showToast('error', error instanceof Error ? error.message : 'Failed to save product');
            }
        });
    }

    return (
        <div className="max-w-5xl mx-auto pb-24">
            {/* Toast */}
            {toast && (
                <div className={cn(
                    'fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-semibold transition-all',
                    toast.type === 'success'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-red-500 text-white'
                )}>
                    {toast.type === 'success'
                        ? <CheckCircle2 className="w-5 h-5 shrink-0" />
                        : <AlertCircle className="w-5 h-5 shrink-0" />}
                    {toast.message}
                </div>
            )}

            <form action={handleSubmit} className="space-y-8">
                {/* ── Sticky Header ── */}
                <div className="sticky top-0 z-30 py-5 bg-background/80 backdrop-blur-xl border-b border-border/50 -mx-4 px-4 sm:mx-0 sm:px-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/products"
                            className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-2xl transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-0.5">
                                {isEditing ? 'Edit Product' : 'New Product'}
                            </p>
                            <h1 className="text-2xl font-black tracking-tight text-foreground">
                                {isEditing ? product.name : 'Add to Catalog'}
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Visibility Toggle */}
                        <button
                            type="button"
                            onClick={() => setIsActive(!isActive)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border',
                                isActive
                                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20'
                                    : 'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                            )}
                        >
                            {isActive ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                            {isActive ? 'Active' : 'Hidden'}
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-60"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isPending ? 'Saving…' : 'Save Product'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ── Left Column (main fields) ── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Basic Info */}
                        <Section title="Basic Information" icon={<Type className="w-4 h-4" />}>
                            <div className="space-y-4">
                                <Field label="Product Name *">
                                    <input
                                        name="name"
                                        defaultValue={product?.name}
                                        required
                                        placeholder="e.g. Ray-Ban Aviator Classic"
                                        className={inputClass}
                                    />
                                </Field>
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Category *">
                                        <select name="category" defaultValue={product?.category || ''} required className={inputClass}>
                                            <option value="" disabled>Select category</option>
                                            {CATEGORIES.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </Field>
                                    <Field label="SKU">
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <input
                                                name="sku"
                                                defaultValue={product?.sku}
                                                placeholder="e.g. RB-3025-001"
                                                className={cn(inputClass, 'pl-9')}
                                            />
                                        </div>
                                    </Field>
                                </div>
                                <Field label="Description">
                                    <textarea
                                        name="description"
                                        defaultValue={product?.description}
                                        rows={4}
                                        placeholder="Describe the product — materials, features, style…"
                                        className={cn(inputClass, 'resize-none')}
                                    />
                                </Field>
                            </div>
                        </Section>

                        {/* Pricing */}
                        <Section title="Pricing" icon={<DollarSign className="w-4 h-4" />}>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Price (₹) *">
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">₹</span>
                                        <input
                                            name="price"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            defaultValue={product?.price}
                                            required
                                            placeholder="0.00"
                                            className={cn(inputClass, 'pl-7')}
                                        />
                                    </div>
                                </Field>
                                <Field label="Discount Price (₹)">
                                    <div className="relative">
                                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            name="discountPrice"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            defaultValue={product?.discountPrice}
                                            placeholder="Sale price"
                                            className={cn(inputClass, 'pl-9')}
                                        />
                                    </div>
                                </Field>
                            </div>
                            {/* Discount badge preview */}
                        </Section>

                        {/* Inventory */}
                        <Section title="Inventory" icon={<Package className="w-4 h-4" />}>
                            <Field label="Stock Quantity *">
                                <input
                                    name="stock"
                                    type="number"
                                    min="0"
                                    defaultValue={product?.stock ?? 0}
                                    required
                                    placeholder="0"
                                    className={inputClass}
                                />
                            </Field>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input type="checkbox" name="hasPower" defaultChecked={product?.hasPower} className="w-4 h-4 rounded accent-primary" />
                                    <span className="text-sm font-medium text-foreground">Supports Custom Power</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input type="checkbox" name="isAccessory" defaultChecked={product?.isAccessory} className="w-4 h-4 rounded accent-primary" />
                                    <span className="text-sm font-medium text-foreground">Mark as Accessory</span>
                                </label>
                            </div>
                        </Section>

                        {/* Variants */}
                        <Section title="Variants" icon={<Layers className="w-4 h-4" />}>
                            <p className="text-xs text-muted-foreground mb-4">Add size, color, or other options customers can choose from.</p>
                            {variants.length > 0 && (
                                <div className="space-y-2 mb-4">
                                    {variants.map((v, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-muted/40 rounded-xl px-4 py-3">
                                            <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-foreground">{v.name}</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {v.options.map(opt => (
                                                        <span key={opt} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">{opt}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => removeVariant(i)} className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-500 rounded-lg transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="grid grid-cols-5 gap-2">
                                <input
                                    value={newVariantName}
                                    onChange={e => setNewVariantName(e.target.value)}
                                    placeholder="Name (e.g. Size)"
                                    className={cn(inputClass, 'col-span-2 text-sm')}
                                />
                                <input
                                    value={newVariantOptions}
                                    onChange={e => setNewVariantOptions(e.target.value)}
                                    placeholder="Options (S, M, L)"
                                    className={cn(inputClass, 'col-span-2 text-sm')}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addVariant())}
                                />
                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="flex items-center justify-center gap-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl font-bold text-xs transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add
                                </button>
                            </div>
                        </Section>

                        {/* Tags */}
                        <Section title="Tags" icon={<Tag className="w-4 h-4" />}>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {tags.map(tag => (
                                    <span key={tag} className="flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    value={tagInput}
                                    onChange={e => setTagInput(e.target.value)}
                                    placeholder="Add a tag…"
                                    className={cn(inputClass, 'flex-1 text-sm')}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                                />
                                <button type="button" onClick={addTag} className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl font-bold text-xs transition-colors">
                                    Add
                                </button>
                            </div>
                        </Section>
                    </div>

                    {/* ── Right Column (images) ── */}
                    <div className="space-y-6">
                        {/* Primary Image */}
                        <Section title="Primary Image" icon={<ImageIcon className="w-4 h-4" />}>
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => !primaryImage && fileInputRef.current?.click()}
                                className={cn(
                                    'relative rounded-2xl border-2 border-dashed transition-all overflow-hidden',
                                    isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border hover:border-primary/50',
                                    !primaryImage && 'cursor-pointer',
                                    'aspect-square'
                                )}
                            >
                                {primaryImage ? (
                                    <div className="relative w-full h-full group">
                                        <img src={primaryImage} alt="Product" className="w-full h-full object-contain p-4" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="bg-white text-black px-3 py-2 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors"
                                            >
                                                Change
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPrimaryImage('')}
                                                className="bg-red-500 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-red-600 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                                        {isUploading ? (
                                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                                    <Upload className="w-6 h-6 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-foreground">Drop image here</p>
                                                    <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground">PNG, JPG, WebP, SVG</p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) handlePrimaryImageUpload(file);
                                }}
                            />

                        </Section>

                        {/* Additional Images */}
                        <Section title="Additional Images" icon={<Layers className="w-4 h-4" />}>
                            <div className="grid grid-cols-3 gap-2">
                                {additionalImages.map((img, i) => (
                                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
                                        <img src={img} alt="" className="w-full h-full object-contain p-2" />
                                        <button
                                            type="button"
                                            onClick={() => removeAdditionalImage(i)}
                                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => additionalFileInputRef.current?.click()}
                                    className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 transition-colors"
                                >
                                    {uploadingIndex === -1 ? (
                                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                    ) : (
                                        <>
                                            <Plus className="w-5 h-5 text-muted-foreground" />
                                            <span className="text-[10px] text-muted-foreground font-medium">Add</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <input
                                ref={additionalFileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={e => {
                                    const files = e.target.files;
                                    if (files && files.length > 0) handleAdditionalImageUpload(files);
                                    if (additionalFileInputRef.current) additionalFileInputRef.current.value = '';
                                }}
                            />
                        </Section>

                        {/* Product Status Card */}
                        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Status</p>
                            <div className={cn(
                                'flex items-center gap-3 p-3 rounded-xl',
                                isActive ? 'bg-emerald-500/10' : 'bg-muted'
                            )}>
                                <div className={cn('w-2.5 h-2.5 rounded-full', isActive ? 'bg-emerald-500' : 'bg-muted-foreground')} />
                                <span className={cn('text-sm font-bold', isActive ? 'text-emerald-600' : 'text-muted-foreground')}>
                                    {isActive ? 'Visible to customers' : 'Hidden from store'}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsActive(!isActive)}
                                className="w-full text-xs font-bold text-muted-foreground hover:text-foreground transition-colors py-1"
                            >
                                {isActive ? 'Hide product' : 'Make visible'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const inputClass =
    'w-full px-4 py-3 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all';

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
                <span className="text-primary">{icon}</span>
                <h3 className="text-sm font-black uppercase tracking-widest text-foreground">{title}</h3>
            </div>
            {children}
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</label>
            {children}
        </div>
    );
}
