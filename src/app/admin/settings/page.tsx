import { Database, Shield, Bell, Globe, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="space-y-12 pb-20">
            {/* Header Section */}
            <div>
                <h1 className="text-6xl font-heading font-black tracking-tighter text-foreground mb-4">Infrastructure.</h1>
                <p className="text-muted-foreground text-lg font-medium opacity-80">Configure your global store parameters and connectivity.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Navigation-like Cards */}
                <div className="space-y-4">
                    {[
                        { name: 'Database & Sync', icon: Database, active: true },
                        { name: 'Security & Access', icon: Shield, active: false },
                        { name: 'Notifications', icon: Bell, active: false },
                        { name: 'Localization', icon: Globe, active: false },
                    ].map((item, i) => (
                        <button
                            key={i}
                            className={`w-full flex items-center justify-between p-6 rounded-[2rem] border transition-all ${item.active ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:bg-primary/5'}`}
                        >
                            <div className="flex items-center space-x-4">
                                <item.icon className="w-5 h-5" />
                                <span className="font-bold text-sm tracking-tight">{item.name}</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 ${item.active ? 'opacity-100' : 'opacity-30'}`} />
                        </button>
                    ))}
                </div>

                {/* Main Settings Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card rounded-[3rem] border border-border overflow-hidden shadow-2xl shadow-black/[0.02]">
                        <div className="p-10 border-b border-border bg-muted/20">
                            <h2 className="text-2xl font-black tracking-tighter">System Connectivity.</h2>
                        </div>

                        <div className="p-10 space-y-10">
                            {/* Connection Status */}
                            <div className="bg-primary/5 border border-primary/10 p-8 rounded-[2.5rem] relative overflow-hidden">
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                            <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em]">Operational Mode</p>
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground">Cloud-First Architecture</h3>
                                        <p className="text-muted-foreground text-sm mt-1 max-w-sm">Your application is currently optimized for Supabase cloud scalability.</p>
                                    </div>
                                    <button className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-xs shadow-lg shadow-primary/20">Verify Link</button>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-6 bg-muted/10 rounded-2xl border border-border/50">
                                    <div>
                                        <p className="font-bold text-foreground">Automatic Edge Synchronization</p>
                                        <p className="text-xs text-muted-foreground">Keep local inventory mirrors in sync with global cloud state.</p>
                                    </div>
                                    <div className="w-14 h-8 bg-primary rounded-full relative shadow-inner">
                                        <div className="absolute right-1.5 top-1.5 w-5 h-5 bg-white rounded-full shadow-md"></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-muted/10 rounded-2xl border border-border/50 opacity-60">
                                    <div>
                                        <p className="font-bold text-foreground">Visual Asset Optimization</p>
                                        <p className="text-xs text-muted-foreground">Automatically compress product imagery on upload.</p>
                                    </div>
                                    <div className="w-14 h-8 bg-muted rounded-full relative">
                                        <div className="absolute left-1.5 top-1.5 w-5 h-5 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-[2.5rem]">
                        <h4 className="text-red-500 text-xs font-black uppercase tracking-widest mb-2">Danger Zone</h4>
                        <p className="text-sm text-red-500/70 font-medium leading-relaxed">
                            Alterations to database configuration may lead to immediate service disruption. Proceed with caution.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
