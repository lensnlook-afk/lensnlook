import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-secondary text-white pt-24 pb-12 overflow-hidden relative">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    <div className="space-y-8">
                        <div>
                            <Link href="/" className="text-3xl font-heading font-extrabold tracking-tighter">
                                Lens<span className="text-primary">&</span>Look
                            </Link>
                            <p className="text-gray-400 text-base mt-6 leading-relaxed max-w-xs">
                                Redefining eyewear through artisan craftsmanship and optical innovation. Vision for the modern pioneer.
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            {[
                                { icon: Instagram, href: "https://www.instagram.com/lens_n_look_badami/" },
                                { icon: Facebook, href: "https://www.facebook.com/people/Lens-n-Look/61576364800475/" },
                                { icon: Twitter, href: "#" }
                            ].map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 group"
                                >
                                    <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-8 flex items-center gap-2">
                            Navigation
                            <div className="w-12 h-px bg-primary/30" />
                        </h4>
                        <ul className="space-y-4">
                            {[
                                { name: "Our Story", href: "/our-story" },
                                { name: "Latest Collection", href: "/products" },
                                { name: "Men's Collection", href: "/products?category=Sunglasses" },
                                { name: "Women's Collection", href: "/products?category=Eyeglasses" },
                                { name: "Virtual Assistant", href: "#" }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-gray-400 hover:text-white hover:translate-x-2 transition-all flex items-center group">
                                        <ArrowUpRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-all text-primary" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-8 flex items-center gap-2">
                            Help & Info
                            <div className="w-12 h-px bg-primary/30" />
                        </h4>
                        <ul className="space-y-4 text-gray-400">
                            {[
                                "Shipping Policy",
                                "Returns & Exchanges",
                                "Privacy Policy",
                                "Terms of Service",
                                "Sitemap"
                            ].map((item) => (
                                <li key={item}>
                                    <a href="#" className="hover:text-white transition-colors">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem]">
                        <h4 className="text-lg font-bold mb-6">Concierge</h4>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-primary/20 rounded-xl">
                                    <Phone className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Speak to us</p>
                                    <p className="font-bold">+91 7899200661</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-primary/20 rounded-xl">
                                    <Mail className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Email Support</p>
                                    <p className="font-bold">help@lensnlook.in</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Lens&Look Private Limited. All Rights Reserved.
                    </p>
                    <div className="flex gap-8">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
