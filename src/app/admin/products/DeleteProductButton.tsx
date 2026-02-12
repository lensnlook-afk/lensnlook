'use client';

import { useState } from 'react';
import { Trash2, Loader2, Check, AlertCircle } from 'lucide-react';
import { deleteProductAction } from '../actions';
import { cn } from '@/lib/utils';

export function DeleteProductButton({ id }: { id: string }) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    async function handleDelete() {
        if (!confirm('This action cannot be undone. Are you sure you want to remove this piece from inventory?')) return;

        setStatus('loading');
        const result = await deleteProductAction(id);

        if (result?.success) {
            setStatus('success');
            // Path will be revalidated by the server action
        } else {
            setStatus('error');
            alert('Encountered an error while removing the product. Please check your connection and try again.');
            setTimeout(() => setStatus('idle'), 3000);
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={status === 'loading'}
            className={cn(
                "p-4 rounded-2xl transition-all shadow-sm active:scale-95 flex items-center justify-center",
                status === 'idle' && "text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10",
                status === 'loading' && "text-muted-foreground bg-muted cursor-wait",
                status === 'success' && "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
                status === 'error' && "text-red-500 bg-red-50 dark:bg-red-500/10"
            )}
        >
            {status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
            {status === 'idle' && <Trash2 className="w-5 h-5" />}
            {status === 'success' && <Check className="w-5 h-5" />}
            {status === 'error' && <AlertCircle className="w-5 h-5" />}
        </button>
    );
}
