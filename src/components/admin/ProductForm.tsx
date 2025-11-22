'use client';

import { Product } from '@/lib/db';
import { createProduct, updateProduct } from '@/app/admin/actions';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, Image as ImageIcon, X } from 'lucide-react';
import { useState, useRef } from 'react';

interface ProductFormProps {
    product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
    const isEditing = !!product;
    const action = isEditing ? updateProduct.bind(null, product.id) : createProduct;

    const [imageUrl, setImageUrl] = useState(product?.image || '');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            setImageUrl(data.url);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form action={action} className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between sticky top-0 bg-gray-100 py-4 z-10">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/products"
                        className="p-2 text-gray-500 hover:bg-white hover:shadow-sm rounded-full transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {isEditing ? 'Edit Product' : 'New Product'}
                        </h1>
                        <p className="text-sm text-gray-500">
                            {isEditing ? 'Update product details' : 'Add a new item to inventory'}
                        </p>
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-teal-600 text-white px-6 py-2.5 rounded-lg flex items-center space-x-2 hover:bg-teal-700 transition-all shadow-md hover:shadow-lg font-medium"
                >
                    <Save className="w-4 h-4" />
                    <span>Save Product</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-4">Basic Information</h2>

                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Product Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                defaultValue={product?.name}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                placeholder="e.g. Vincent Chase Wayfarer"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="category" className="text-sm font-medium text-gray-700">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    required
                                    defaultValue={product?.category}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all bg-white"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Eyeglasses">Eyeglasses</option>
                                    <option value="Sunglasses">Sunglasses</option>
                                    <option value="Contact Lenses">Contact Lenses</option>
                                    <option value="Computer Glasses">Computer Glasses</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="price" className="text-sm font-medium text-gray-700">
                                    Price (₹)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        required
                                        min="0"
                                        step="0.01"
                                        defaultValue={product?.price}
                                        className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium text-gray-700">
                                Description / Caption
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={6}
                                defaultValue={product?.description}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                                placeholder="Describe the product features, style, and benefits..."
                            />
                            <p className="text-xs text-gray-500 text-right">
                                Write a catchy caption to attract customers.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-4">Inventory</h2>
                        <div className="space-y-2">
                            <label htmlFor="stock" className="text-sm font-medium text-gray-700">
                                Stock Quantity
                            </label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                required
                                min="0"
                                defaultValue={product?.stock}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                                placeholder="0"
                            />
                            <p className="text-xs text-gray-500">
                                Set to 0 to mark as "Out of Stock".
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Image Upload */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 border-b pb-4">Product Image</h2>

                        <input type="hidden" name="image" value={imageUrl} />

                        <div className="space-y-4">
                            <div
                                className={`relative aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden ${imageUrl ? 'border-teal-500 bg-gray-50' : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
                                    }`}
                            >
                                {imageUrl ? (
                                    <>
                                        <img
                                            src={imageUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setImageUrl('')}
                                            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50 text-red-500 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <ImageIcon className="w-6 h-6" />
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">
                                            {isUploading ? 'Uploading...' : 'No image selected'}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Upload a high-quality image
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="w-full py-2.5 px-4 bg-white border border-gray-200 hover:border-teal-500 hover:text-teal-600 text-gray-700 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    {isUploading ? 'Uploading...' : 'Upload Image'}
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
