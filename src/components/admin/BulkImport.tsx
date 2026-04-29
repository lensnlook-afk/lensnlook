'use client';

import { useState, useRef, useTransition } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle, Download, Loader2 } from 'lucide-react';
import { bulkImportProductsAction } from '@/app/admin/actions';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface BulkImportProps {
    onClose: () => void;
}

const CSV_TEMPLATE = `name,price,discountPrice,category,sku,stock,description,isActive
"Ray-Ban Aviator",4999,3999,"Sunglasses","RB-3025",50,"Classic aviator sunglasses",true
"Blue Blockers Pro",1999,,"Computer Glasses","BB-001",30,"Anti-blue light glasses",true`;

export default function BulkImport({ onClose }: BulkImportProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<any[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [result, setResult] = useState<{ success: boolean; count?: number; error?: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const parseCSV = (text: string) => {
        const lines = text.trim().split('\n');
        if (lines.length < 2) return { rows: [], errors: ['CSV must have a header row and at least one data row'] };

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const required = ['name', 'price', 'category', 'stock'];
        const missing = required.filter(r => !headers.includes(r));
        if (missing.length > 0) {
            return { rows: [], errors: [`Missing required columns: ${missing.join(', ')}`] };
        }

        const rows: any[] = [];
        const errs: string[] = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Simple CSV parse (handles quoted fields)
            const values: string[] = [];
            let current = '';
            let inQuotes = false;
            for (const char of line) {
                if (char === '"') { inQuotes = !inQuotes; }
                else if (char === ',' && !inQuotes) { values.push(current.trim()); current = ''; }
                else { current += char; }
            }
            values.push(current.trim());

            const row: any = {};
            headers.forEach((h, idx) => { row[h] = values[idx] || ''; });

            const price = parseFloat(row.price);
            const stock = parseInt(row.stock);

            if (!row.name) { errs.push(`Row ${i}: name is required`); continue; }
            if (isNaN(price)) { errs.push(`Row ${i}: invalid price "${row.price}"`); continue; }
            if (isNaN(stock)) { errs.push(`Row ${i}: invalid stock "${row.stock}"`); continue; }

            rows.push({
                name: row.name,
                price,
                discountPrice: row.discountPrice ? parseFloat(row.discountPrice) : undefined,
                category: row.category || 'Uncategorized',
                sku: row.sku || undefined,
                stock,
                description: row.description || '',
                image: row.image || 'https://placehold.co/600x400',
                isActive: row.isActive !== 'false',
                hasPower: row.hasPower === 'true',
                isAccessory: row.isAccessory === 'true',
            });
        }

        return { rows, errors: errs };
    };

    const handleFile = (f: File) => {
        setFile(f);
        setResult(null);
        const reader = new FileReader();
        reader.onload = e => {
            const text = e.target?.result as string;
            const { rows, errors } = parseCSV(text);
            setPreview(rows.slice(0, 5));
            setErrors(errors);
        };
        reader.readAsText(f);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files[0];
        if (f && (f.type === 'text/csv' || f.name.endsWith('.csv'))) handleFile(f);
    };

    const handleImport = () => {
        if (!file || errors.length > 0) return;
        const reader = new FileReader();
        reader.onload = e => {
            const text = e.target?.result as string;
            const { rows } = parseCSV(text);
            startTransition(async () => {
                const res = await bulkImportProductsAction(rows);
                setResult(res);
                if (res.success) {
                    router.refresh();
                    setTimeout(onClose, 2000);
                }
            });
        };
        reader.readAsText(file);
    };

    const downloadTemplate = () => {
        const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'product-import-template.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black tracking-tight text-foreground">Bulk Import Products</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">Upload a CSV file to add multiple products at once</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Template Download */}
                    <button
                        onClick={downloadTemplate}
                        className="w-full flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl hover:bg-primary/10 transition-colors text-left"
                    >
                        <Download className="w-5 h-5 text-primary shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-foreground">Download CSV Template</p>
                            <p className="text-xs text-muted-foreground">Get the correct format with all supported columns</p>
                        </div>
                    </button>

                    {/* Drop Zone */}
                    <div
                        onDrop={handleDrop}
                        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                            'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
                            isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                        )}
                    >
                        {file ? (
                            <div className="flex items-center justify-center gap-3">
                                <FileText className="w-8 h-8 text-primary" />
                                <div className="text-left">
                                    <p className="font-bold text-sm text-foreground">{file.name}</p>
                                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                                <p className="font-bold text-foreground">Drop your CSV file here</p>
                                <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
                            </>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,text/csv"
                        className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                    />

                    {/* Errors */}
                    {errors.length > 0 && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 space-y-1">
                            <p className="text-xs font-black uppercase tracking-widest text-red-600 mb-2">Validation Errors</p>
                            {errors.map((e, i) => (
                                <p key={i} className="text-xs text-red-600 flex items-start gap-2">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                    {e}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* Preview */}
                    {preview.length > 0 && (
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">
                                Preview (first {preview.length} rows)
                            </p>
                            <div className="overflow-x-auto rounded-xl border border-border">
                                <table className="w-full text-xs">
                                    <thead className="bg-muted/30">
                                        <tr>
                                            {['Name', 'Price', 'Category', 'Stock', 'SKU'].map(h => (
                                                <th key={h} className="px-3 py-2 text-left font-bold text-muted-foreground">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {preview.map((row, i) => (
                                            <tr key={i}>
                                                <td className="px-3 py-2 font-medium">{row.name}</td>
                                                <td className="px-3 py-2">₹{row.price}</td>
                                                <td className="px-3 py-2">{row.category}</td>
                                                <td className="px-3 py-2">{row.stock}</td>
                                                <td className="px-3 py-2 font-mono text-muted-foreground">{row.sku || '—'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Result */}
                    {result && (
                        <div className={cn(
                            'flex items-center gap-3 p-4 rounded-2xl',
                            result.success ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'
                        )}>
                            {result.success ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                            )}
                            <p className={cn('text-sm font-bold', result.success ? 'text-emerald-600' : 'text-red-600')}>
                                {result.success
                                    ? `Successfully imported ${result.count} products!`
                                    : result.error || 'Import failed'}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-bold text-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleImport}
                            disabled={!file || errors.length > 0 || isPending || preview.length === 0}
                            className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isPending ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Importing…</>
                            ) : (
                                <><Upload className="w-4 h-4" /> Import Products</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
