import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSlider from '../components/HeroSlider';
import TrustBar from '../components/TrustBar';
import MarqueeStrip from '../components/MarqueeStrip';
import ProductGrid from '../components/ProductGrid';
import AdBanner from '../components/AdBanner';
import CategoryCards from '../components/CategoryCards';
import AboutStrip from '../components/AboutStrip';
import ClosingBanner from '../components/ClosingBanner';
import VideoSection from '../components/VideoSection';
import { useData } from '../context/DataContext';

const SkeletonCard = () => (
    <div className="bg-white rounded-[16px] sm:rounded-[22px] overflow-hidden border border-gray-50 animate-pulse">
        <div className="h-[160px] sm:h-[180px] lg:h-[210px] bg-gray-100" />
        <div className="p-3 sm:p-5 space-y-2.5">
            <div className="h-3 bg-gray-100 rounded-full w-3/4" />
            <div className="h-3 bg-gray-100 rounded-full w-1/2" />
            <div className="h-8 bg-gray-100 rounded-xl mt-4" />
        </div>
    </div>
);

const SkeletonGrid = ({ count = 4 }) => (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 px-4 md:px-0">
        {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
);

const HomePage = () => {
    const navigate = useNavigate();
    const { getByCollection, loading } = useData();
    
    const bestSellers = getByCollection('best-sellers').slice(0, 4);
    const comboPacks = getByCollection('mega-combo-offers').slice(0, 4);
    const allProducts = getByCollection('all').slice(0, 8);

    const isInitialLoad = loading && bestSellers.length === 0;

    return (
        <div className="animate-in fade-in duration-1000">
            <HeroSlider />
            <TrustBar />
            <MarqueeStrip />

            {/* Best Sellers Section */}
            <section className="max-w-[1400px] mx-auto py-20 px-6">
                <div className="flex justify-between items-end mb-12 md:mb-16">
                    <div>
                        <span className="text-warm text-[12px] font-black uppercase tracking-[0.3em] mb-3 flex items-center gap-3">
                            <span className="w-10 h-px bg-warm" /> Bestsellers
                        </span>
                        <h2 className="font-head text-3xl md:text-5xl font-black text-dark tracking-tight">
                            Most <span className="text-green italic underline decoration-green-pale/30">Loved</span> Products
                        </h2>
                    </div>
                    <button
                        onClick={() => navigate('/collections/best-sellers')}
                        className="hidden md:flex items-center gap-3 text-[13px] font-black text-green hover:text-warm tracking-widest uppercase transition-all group"
                    >
                        View all products <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </button>
                </div>
                {isInitialLoad ? <SkeletonGrid count={4} /> : bestSellers.length > 0 ? <ProductGrid products={bestSellers} /> : null}
                <button
                    onClick={() => navigate('/collections/best-sellers')}
                    className="md:hidden w-full mt-10 bg-transparent text-green border-2 border-green/10 rounded-full py-4 font-black text-xs uppercase tracking-widest"
                >
                    View all products →
                </button>
            </section>

            <AdBanner />

            {/* Middle Statement Section */}
            <section className="bg-white py-20 md:py-32 text-center group">
                <div className="max-w-[900px] mx-auto px-6">
                    <div className="mb-10 text-6xl md:text-8xl animate-bounce-slow">🤍</div>
                    <h2 className="font-head text-4xl md:text-6xl font-black text-dark leading-[1.1] mb-10 tracking-tight">
                        Pure. Natural. Made with <br /> <span className="text-green underline underline-offset-12 decoration-black/5">The Anjaraipetti</span>
                    </h2>
                    <p className="text-mid text-base md:text-xl font-medium leading-[1.8] mb-14 max-w-[650px] mx-auto opacity-70">
                        We source only the finest organic ingredients and follow traditional homemade recipes to ensure your baby gets the best nutrition possible. 🌿
                    </p>
                    <button
                        onClick={() => navigate('/collections/all')}
                        className="bg-dark text-white rounded-full px-12 md:px-16 py-5 md:py-6 font-black text-xs md:text-sm uppercase tracking-widest shadow-2xl hover:bg-green hover:-translate-y-1 transition-all duration-300 active:scale-95"
                    >
                        Visit Full Shop →
                    </button>
                </div>
            </section>

            <CategoryCards />
            <AboutStrip />

            {/* Combo Packs Section */}
            <section className="max-w-[1400px] mx-auto py-20 px-6">
                <div className="flex justify-between items-end mb-12 md:mb-16">
                    <div>
                        <span className="text-warm text-[12px] font-black uppercase tracking-[0.3em] mb-3 flex items-center gap-3">
                            <span className="w-10 h-px bg-warm" /> Save More
                        </span>
                        <h2 className="font-head text-3xl md:text-5xl font-black text-dark tracking-tight">
                            Mega <span className="text-sale italic underline decoration-sale/10">Combo</span> Offers
                        </h2>
                    </div>
                    <button
                        onClick={() => navigate('/collections/mega-combo-offers')}
                        className="hidden md:flex items-center gap-3 text-[13px] font-black text-green hover:text-warm tracking-widest uppercase transition-all group"
                    >
                        View all combos <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </button>
                </div>
                {isInitialLoad ? <SkeletonGrid count={4} /> : comboPacks.length > 0 ? <ProductGrid products={comboPacks} /> : null}
                <button
                    onClick={() => navigate('/collections/mega-combo-offers')}
                    className="md:hidden w-full mt-10 bg-transparent text-green border-2 border-green/10 rounded-full py-4 font-black text-xs uppercase tracking-widest"
                >
                    View all combos →
                </button>
            </section>

            {/* All Products Section */}
            <section className="max-w-[1400px] mx-auto py-20 px-6 md:pb-32">
                <div className="flex justify-between items-end mb-12 md:mb-16">
                    <div>
                        <span className="text-warm text-[12px] font-black uppercase tracking-[0.3em] mb-3 flex items-center gap-3">
                            <span className="w-10 h-px bg-warm" /> Full Range
                        </span>
                        <h2 className="font-head text-3xl md:text-5xl font-black text-dark tracking-tight">
                            All <span className="text-green italic underline decoration-green-pale/30">Products</span>
                        </h2>
                    </div>
                    <button
                        onClick={() => navigate('/collections/all')}
                        className="hidden md:flex items-center gap-3 text-[13px] font-black text-green hover:text-warm tracking-widest uppercase transition-all group"
                    >
                        Explore all products <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </button>
                </div>
                {isInitialLoad ? <SkeletonGrid count={8} /> : allProducts.length > 0 ? <ProductGrid products={allProducts} /> : null}
                <button
                    onClick={() => navigate('/collections/all')}
                    className="md:hidden w-full mt-10 bg-transparent text-green border-2 border-green/10 rounded-full py-4 font-black text-xs uppercase tracking-widest"
                >
                    Explore all products →
                </button>
            </section>

            <ClosingBanner />
            <VideoSection />
        </div>
    );
};

export default HomePage;
