import { getProducts } from '@/lib/db';
import { deleteProductAction } from '../actions';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default async function ProductList() {
    const products = await getProducts();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                <Link
                    href="/admin/products/new"
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-teal-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Price</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Stock</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-10 h-10 rounded-md object-cover bg-gray-200"
                                        />
                                        <span className="font-medium text-gray-900">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{product.category}</td>
                                <td className="px-6 py-4 font-medium text-gray-900">₹{product.price}</td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10
                                                ? 'bg-green-100 text-green-700'
                                                : product.stock > 0
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Link
                                            href={`/admin/products/${product.id}/edit`}
                                            className="p-2 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <form action={deleteProductAction.bind(null, product.id)}>
                                            <button
                                                type="submit"
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No products found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
