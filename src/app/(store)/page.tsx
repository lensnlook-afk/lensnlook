import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, ShieldCheck, Truck, RefreshCw, Zap, Glasses, Sun, Monitor, Eye, Layers } from 'lucide-react';
import { getProducts } from '@/lib/db';
import ProductCard from '@/components/ProductCard';

export default async function HomePage() {
  const products = await getProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-white min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-black -mt-px">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <div className="max-w-5xl mx-auto">
            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-bold leading-tight text-white mb-8 animate-slide-up">
              See the World
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-teal-400 to-neon-lime animate-gradient">
                Through Style
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 font-light max-w-3xl mx-auto leading-relaxed animate-fade-in-delay">
              Premium eyewear that combines cutting-edge optical technology with high-fashion design. Your vision, elevated.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in-delay-2">
              <Link
                href="/products"
                className="group bg-neon-blue text-black px-10 py-5 rounded-full font-bold text-lg hover:bg-white transition-all flex items-center justify-center shadow-lg hover:shadow-2xl transform hover:scale-105"
              >
                Shop Collection
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/our-story"
                className="px-10 py-5 rounded-full font-bold text-lg text-white border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm transition-all flex items-center justify-center"
              >
                Our Story
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-12 text-white/80 text-sm animate-fade-in-delay-3">
              <div>
                <div className="text-4xl font-bold text-white mb-1">5000+</div>
                <div className="text-gray-400">Happy Customers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">500+</div>
                <div className="text-gray-400">Premium Frames</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">24/7</div>
                <div className="text-gray-400">Expert Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Mobile Easy Shopping (Mobile Only) */}
      <section className="md:hidden py-8 px-4 bg-white dark:bg-black">
        <h2 className="text-xl font-heading font-bold text-black dark:text-white mb-6 text-center">Easy Shopping</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
          {[
            { name: 'Eyeglasses', icon: Glasses, href: '/products?category=Eyeglasses' },
            { name: 'Sunglasses', icon: Sun, href: '/products?category=Sunglasses' },
            { name: 'Computer Glasses', icon: Monitor, href: '/products?category=Computer Glasses' },
            { name: 'Contact Lenses', icon: Eye, href: '/products?category=Contact Lenses' },
            { name: 'View All', icon: Layers, href: '/products' },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex-shrink-0 flex flex-col items-center justify-center p-4 bg-white dark:bg-white/10 rounded-xl shadow-sm border border-gray-100 dark:border-white/10 active:scale-95 transition-transform w-28 h-28"
            >
              <item.icon className="w-8 h-8 text-neon-blue mb-2" />
              <span className="text-xs font-bold text-black dark:text-white text-center leading-tight">{item.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 bg-white dark:bg-black border-y border-gray-100 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-black dark:text-white mb-4">
              Why Choose Lens&Look?
            </h2>
            <p className="text-black dark:text-white max-w-2xl mx-auto">
              Experience the perfect blend of style, quality, and service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group hover:transform hover:scale-105 transition-all">
              <div className="w-16 h-16 mx-auto mb-4 bg-neon-blue/10 rounded-full flex items-center justify-center group-hover:bg-neon-blue/20 transition-colors">
                <ShieldCheck className="w-8 h-8 text-neon-blue" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-2">Premium Quality</h3>
              <p className="text-black dark:text-white text-sm">
                Handcrafted frames with the finest materials and craftsmanship
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all">
              <div className="w-16 h-16 mx-auto mb-4 bg-neon-blue/10 rounded-full flex items-center justify-center group-hover:bg-neon-blue/20 transition-colors">
                <Eye className="w-8 h-8 text-neon-blue" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-2">Expert Consultation</h3>
              <p className="text-black dark:text-white text-sm">
                Professional opticians to help you find the perfect fit
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all">
              <div className="w-16 h-16 mx-auto mb-4 bg-neon-blue/10 rounded-full flex items-center justify-center group-hover:bg-neon-blue/20 transition-colors">
                <Zap className="w-8 h-8 text-neon-blue" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-2">Fast Delivery</h3>
              <p className="text-black dark:text-white text-sm">
                Get your frames delivered in 2-4 business days
              </p>
            </div>

            <div className="text-center group hover:transform hover:scale-105 transition-all">
              <div className="w-16 h-16 mx-auto mb-4 bg-neon-blue/10 rounded-full flex items-center justify-center group-hover:bg-neon-blue/20 transition-colors">
                <Star className="w-8 h-8 text-neon-blue" />
              </div>
              <h3 className="text-xl font-bold text-black dark:text-white mb-2">Affordable Luxury</h3>
              <p className="text-black dark:text-white text-sm">
                Premium eyewear at prices that won't break the bank
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* Featured Collections - More Visually Appealing */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-heading font-bold text-black dark:text-white mb-6">
              Discover Your Perfect Style
            </h2>
            <p className="text-xl text-black dark:text-white max-w-3xl mx-auto">
              Explore our handpicked collections designed for every occasion and personality
            </p>
          </div>

          {/* Large Featured Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Main Featured - Eyeglasses */}
            <Link
              href="/products?category=Eyeglasses"
              className="group relative h-[500px] rounded-3xl overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&q=80"
                alt="Eyeglasses Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-10">
                <div className="transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                  <h3 className="text-5xl font-heading font-bold text-white mb-3">Eyeglasses</h3>
                  <p className="text-white/90 text-lg mb-4">Where vision meets fashion</p>
                  <div className="inline-flex items-center text-white font-medium">
                    Explore Collection
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Main Featured - Sunglasses */}
            <Link
              href="/products?category=Sunglasses"
              className="group relative h-[500px] rounded-3xl overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&q=80"
                alt="Sunglasses Collection"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-10">
                <div className="transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                  <h3 className="text-5xl font-heading font-bold text-white mb-3">Sunglasses</h3>
                  <p className="text-white/90 text-lg mb-4">Shield your eyes in style</p>
                  <div className="inline-flex items-center text-white font-medium">
                    Explore Collection
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Secondary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Computer Glasses */}
            <Link
              href="/products?category=Computer Glasses"
              className="group relative h-[300px] rounded-3xl overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&q=80"
                alt="Computer Glasses"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-8">
                <div className="transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                  <h3 className="text-3xl font-heading font-bold text-white mb-2">Computer Glasses</h3>
                  <p className="text-white/90 mb-3">Digital protection for modern life</p>
                  <div className="inline-flex items-center text-white font-medium text-sm">
                    Shop Now
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Contact Lenses */}
            <Link
              href="/products?category=Contact Lenses"
              className="group relative h-[300px] rounded-3xl overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80"
                alt="Contact Lenses"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-8">
                <div className="transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                  <h3 className="text-3xl font-heading font-bold text-white mb-2">Contact Lenses</h3>
                  <p className="text-white/90 mb-3">All-day comfort and clarity</p>
                  <div className="inline-flex items-center text-white font-medium text-sm">
                    Shop Now
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="py-16 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-black dark:text-white mb-4">
              Real Reviews from Real Customers
            </h2>
            <p className="text-black dark:text-white max-w-2xl mx-auto">
              See what our customers in Badami are saying about their Lens&Look experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-black dark:text-white mb-4">
                "Excellent service and wide variety of frames. The staff is very helpful and professional. Highly recommended for quality eyewear!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center">
                  <span className="text-neon-blue font-bold">GR</span>
                </div>
                <div>
                  <div className="font-bold text-black dark:text-white">Google Reviewer</div>
                  <div className="text-sm text-black dark:text-white">Badami</div>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-black dark:text-white mb-4">
                "Great collection of spectacles and sunglasses. The quality is top-notch and prices are very reasonable. Best optical shop in Badami!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center">
                  <span className="text-neon-blue font-bold">LC</span>
                </div>
                <div>
                  <div className="font-bold text-black dark:text-white">Local Customer</div>
                  <div className="text-sm text-black dark:text-white">Badami</div>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-black dark:text-white mb-4">
                "Very good experience! The staff helped me choose the perfect frames for my face. Quality products and excellent customer service."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neon-blue/20 flex items-center justify-center">
                  <span className="text-neon-blue font-bold">VC</span>
                </div>
                <div>
                  <div className="font-bold text-black dark:text-white">Verified Customer</div>
                  <div className="text-sm text-black dark:text-white">Badami</div>
                </div>
              </div>
            </div>
          </div>

          {/* Google Reviews Link */}
          <div className="text-center mt-8">
            <a
              href="https://www.google.com/maps/place/Lens+N+Look/@15.91771,75.6784683,17z/data=!4m8!3m7!1s0x3bb887e8f9b98f2f:0x371e249fe0bf0021!8m2!3d15.9177107!4d75.6810432!9m1!1b1!16s%2Fg%2F11t_8d0q3h?entry=ttu"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-neon-blue hover:text-black dark:hover:text-white font-medium transition-colors"
            >
              Read all reviews on Google Maps
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-12 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-neon-blue font-bold tracking-widest uppercase text-sm mb-2 block">Weekly Favorites</span>
            <h2 className="text-4xl font-heading font-bold text-black dark:text-white mb-4">Trending Now</h2>
            <p className="text-black dark:text-white max-w-2xl mx-auto">
              Discover the frames that everyone is talking about.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <div className="bg-black border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-2 md:gap-8 py-6 md:py-12">
            {[
              { icon: ShieldCheck, title: "1 Year Warranty", desc: "Comprehensive coverage" },
              { icon: Truck, title: "Free Shipping", desc: "On all orders > ₹999" },
              { icon: RefreshCw, title: "Easy Returns", desc: "14-day hassle-free" },
              { icon: Zap, title: "Fast Delivery", desc: "2-4 business days" },
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center mb-2 md:mb-4 group-hover:bg-white/20 transition-colors">
                  <feature.icon className="w-4 h-4 md:w-6 md:h-6 text-neon-blue" />
                </div>
                <h3 className="text-white font-bold text-[10px] md:text-base mb-0.5 md:mb-1 leading-tight font-heading">{feature.title}</h3>
                <p className="text-white/70 text-[8px] md:text-sm hidden sm:block">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Store Location Section */}
      <section className="py-12 bg-charcoal text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-warm-coral font-bold tracking-widest uppercase text-sm mb-2 block">Visit Us</span>
            </div>

            {/* Google Maps Embed */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3840.336436696354!2d75.6784682759027!3d15.91771068473836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb887e8f9b98f2f%3A0x371e249fe0bf0021!2sLens%20N%20Look!5e0!3m2!1sen!2sin!4v1716355000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
