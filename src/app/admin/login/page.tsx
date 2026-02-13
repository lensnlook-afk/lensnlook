'use client';

import { useState } from 'react';
import { adminLogin } from '../actions';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await adminLogin(password);
            if (result.success) {
                router.push('/admin');
                router.refresh();
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] animate-pulse delay-1000" />

            <div className="max-w-md w-full relative z-10">
                <div className="bg-card/50 backdrop-blur-2xl p-12 rounded-[3rem] border border-white/10 shadow-2xl space-y-8">
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto transform rotate-12 hover:rotate-0 transition-transform duration-500 shadow-xl shadow-primary/20">
                            <ShieldCheck className="w-10 h-10 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-center space-x-2 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                                <Sparkles className="w-3 h-3" />
                                <span>Curator Access</span>
                            </div>
                            <h1 className="text-3xl font-black text-white tracking-tighter">Admin Portal.</h1>
                            <p className="text-gray-400 text-sm font-medium">Please enter your master key to manage the vault.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Master Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold p-4 rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Authenticate</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center pt-4">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            Protected by Lens & Look RSA &copy; 2026
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
