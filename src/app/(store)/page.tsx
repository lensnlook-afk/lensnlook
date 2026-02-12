import Link from 'next/link';
import { ArrowRight, Star, ShieldCheck, Truck, RefreshCw, Zap, Glasses, Sun, Monitor, Eye, Layers, TrendingUp, Award, Clock, ShoppingCart } from 'lucide-react';
import { getProducts } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

export default async function HomePage() {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 4);

  // Derive dynamic categories from the database
  const categories = Array.from(new Set(products.map(p => p.category)))
    .filter(Boolean)
    .map(name => {
      const categoryProduct = products.find(p => p.category === name);
      return {
        name,
        image: categoryProduct?.image,
        count: products.filter(p => p.category === name).length
      };
    });

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section - The Wow Factor */}
      <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden bg-mesh">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] animate-pulse delay-700" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left-10 duration-1000">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                < Award className="w-4 h-4 text-primary" />
                <span className="text-primary text-xs font-bold uppercase tracking-widest">Premium Collection 2026</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold leading-[1.1] text-foreground">
                Vision Meets <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal-500 to-accent">
                  Pure Elegance
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-xl leading-relaxed">
                Experience high-definition clarity with frames curated for the modern visionary. Engineered for comfort, designed for the bold.
              </p>

              <div className="flex flex-wrap gap-5 pt-4">
                <Link
                  href="/products"
                  className="group bg-primary text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 flex items-center justify-center transform hover:scale-105"
                >
                  Explore Collection
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
                <div className="flex items-center space-x-4 px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-slate-200" />
                    ))}
                  </div>
                  <div className="text-sm font-bold">
                    <span className="text-primary text-lg">10k+</span>
                    <p className="text-gray-500 font-medium">Happy Faces</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 hidden lg:block relative animate-in fade-in slide-in-from-right-10 duration-1000 delay-300">
              <div className="relative z-10 p-8 glass-dark rounded-[3rem] border-white/5 shadow-2xl animate-float">
                <img
                  src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80"
                  alt="Style"
                  className="rounded-[2.5rem] w-full aspect-[4/5] object-cover shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-black p-6 rounded-3xl shadow-2xl border border-primary/20 translate-y-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Star className="w-5 h-5 fill-accent text-accent" />
                    <span className="font-bold text-lg italic">Rating 4.9/5</span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium whitespace-nowrap">"Best eyewear I've ever owned!"</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Dynamic from Database */}
      {categories.length > 0 && (
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 text-center md:text-left">
              <div>
                <span className="text-accent font-bold uppercase tracking-widest text-sm block mb-4">The Selection</span>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Curated Styles.</h2>
              </div>
              <Link href="/products" className="group flex items-center space-x-3 text-lg font-bold text-primary px-8 py-3 bg-primary/10 rounded-full hover:bg-primary hover:text-white transition-all">
                <span>View Full Store</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat, idx) => (
                <Link
                  key={cat.name}
                  href={`/products?category=${cat.name}`}
                  className="group relative h-[400px] rounded-[3rem] overflow-hidden shadow-2xl transition-all hover:-translate-y-2 border border-border/50"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-10">
                    <span className="text-primary text-xs font-black uppercase tracking-widest mb-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full self-start">
                      {cat.count} Pieces
                    </span>
                    <h3 className="text-3xl font-black text-white tracking-tighter">{cat.name}.</h3>
                    <p className="text-white/60 text-sm font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Explore artisan collection &rarr;</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Now */}
      {featuredProducts.length > 0 && (
        <section className="py-24 bg-card/50 backdrop-blur-sm border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-16">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-primary/10 rounded-[1.5rem] shadow-xl shadow-primary/5">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter">New Arrivals.</h2>
              </div>
              <Link href="/products" className="text-sm font-black uppercase tracking-widest text-primary hover:underline">See All</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State if no products at all */}
      {products.length === 0 && (
        <section className="py-40 text-center px-6">
          <div className="max-w-xl mx-auto space-y-8 animate-in fade-in zoom-in duration-1000">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/20">
              <ShoppingCart className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">Catalog Refresh.</h2>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed">
              We are currently re-curating our global collection. Please return shortly to discover new dimensions of clarity.
            </p>
            <div className="pt-8">
              <div className="inline-flex items-center space-x-4 px-6 py-3 bg-muted rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest opacity-60">Status: Restocking Vault</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features - Premium Cards */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: ShieldCheck, title: "Iron Warranty", desc: "12 months comprehensive coverage for any manufacturing defects.", color: "text-blue-500" },
              { icon: Truck, title: "Express Delivery", desc: "Enjoy complimentary shipping on orders over ₹1299 within 48 hours.", color: "text-emerald-500" },
              { icon: RefreshCw, title: "Perfect Fit", desc: "Not satisfied? Return or exchange with zero questions asked in 14 days.", color: "text-orange-500" },
              { icon: Clock, title: "24/7 Support", desc: "Our vision experts are always available to guide your stylist journey.", color: "text-purple-500" },
            ].map((feature, idx) => (
              <div key={idx} className="group p-10 rounded-[2.5rem] bg-card border border-border hover:bg-background transition-all hover:shadow-2xl hover:scale-105 duration-500 shadow-xl shadow-black/[0.02]">
                <div className={`w-16 h-16 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center mb-8 shadow-lg group-hover:rotate-6 transition-all border border-border/50`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-black tracking-tighter mb-4">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship Store */}
      <section className="py-24 bg-foreground text-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/[0.03] rounded-[4rem] overflow-hidden border border-white/5 p-4 md:p-12 backdrop-blur-md">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-12">
                <div>
                  <span className="text-primary text-xs font-black uppercase tracking-[0.4em] mb-6 block opacity-80">Physical Presence</span>
                  <h2 className="text-5xl md:text-7xl font-black leading-tight tracking-tighter">Find Your <br />Signature.</h2>
                </div>

                <div className="space-y-10">
                  {[
                    { title: "Flagship Destination", detail: "Banashankari Road, Badami, Karnataka 587201" },
                    { title: "Direct Line", detail: "+91 7899200661" },
                    { title: "Hours", detail: "Daily: 10:30 AM - 9:30 PM" }
                  ].map((info, idx) => (
                    <div key={idx} className="flex gap-8 items-start group">
                      <div className="w-1 h-12 bg-primary/20 rounded-full group-hover:bg-primary transition-colors duration-500" />
                      <div>
                        <h4 className="font-black text-xl text-white tracking-tight mb-2 uppercase text-[10px] opacity-40">{info.title}</h4>
                        <p className="text-white/80 font-bold text-lg">{info.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex pt-4">
                  <button className="px-12 py-6 bg-white text-black font-black rounded-3xl hover:bg-primary hover:text-white transition-all active:scale-95 shadow-2xl">
                    Get Directions
                  </button>
                </div>
              </div>

              <div className="h-[500px] md:h-[700px] rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-1000 border border-white/10 group grayscale hover:grayscale-0 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3840.336436696354!2d75.6784682759027!3d15.91771068473836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb887e8f9b98f2f%3A0x371e249fe0bf0021!2sLens%20N%20Look!5e0!3m2!1sen!2sin!4v1716355000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="bg-secondary"
                ></iframe>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent pointer-events-none transition-all" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
