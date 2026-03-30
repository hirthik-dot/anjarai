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
import { useLang } from '../context/LanguageContext';
import OffersCarousel from '../components/OffersCarousel';

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
    const { t } = useLang();
    
    // Updated slugs to match exact database collections ("best-seller" and "combo-packs")
    const bestSellers = getByCollection('best-seller').slice(0, 4);
    const allProducts = getByCollection('all').slice(0, 8);
    const rawNewArrivals = getByCollection('new-arrivals');
    const fallbackNewArrivals = getByCollection('organic');
    const newArrivals = (rawNewArrivals.length ? rawNewArrivals : fallbackNewArrivals).slice(0, 4);

    const isInitialLoad = loading && bestSellers.length === 0;

    return (
        <div className="animate-in fade-in duration-1000">
            <MarqueeStrip />
            <HeroSlider />
            <TrustBar />
            <CategoryCards />

            {/* Best Sellers Section */}
            <section className="max-w-[1400px] mx-auto py-8 md:py-12 px-6">
                <div className="flex justify-between items-end mb-8 md:mb-12">
                    <div>
                        <span className="text-warm text-[12px] font-black uppercase tracking-[0.3em] mb-3 flex items-center gap-3">
                            <span className="w-10 h-px bg-warm" /> {t('Bestsellers')}
                        </span>
                        <h2 className="font-head text-3xl md:text-5xl font-black text-dark tracking-tight">
                            {t('Most')} <span className="text-green italic underline decoration-green-pale/30">{t('Loved')}</span> {t('Products')}
                        </h2>
                    </div>
                    <button
                        onClick={() => navigate('/collections/best-seller')}
                        className="hidden md:flex items-center gap-3 text-[13px] font-black text-green hover:text-warm tracking-widest uppercase transition-all group"
                    >
                        {t('View all products')} <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </button>
                </div>
                {isInitialLoad ? <SkeletonGrid count={4} /> : bestSellers.length > 0 ? <ProductGrid products={bestSellers} /> : null}
                <button
                    onClick={() => navigate('/collections/best-seller')}
                    className="md:hidden w-full mt-10 bg-transparent text-green border-2 border-green/10 rounded-full py-4 font-black text-xs uppercase tracking-widest"
                >
                    {t('View all products →')}
                </button>
            </section>

            {/* Gold banner */}
            <div
                className="bg-[var(--brand-gold)] text-[color:var(--brand-primary-dark)] text-center font-black tracking-wide py-3.5"
                style={{ fontSize: 14 }}
            >
                🚚 Free delivery on orders above ₹499
            </div>

            {/* New Arrivals */}
            <section className="max-w-[1400px] mx-auto py-8 md:py-12 px-6">
                <div className="flex justify-between items-end mb-8 md:mb-12">
                    <div>
                        <span className="text-warm text-[12px] font-black uppercase tracking-[0.3em] mb-3 flex items-center gap-3">
                            <span className="w-10 h-px bg-warm" /> New
                        </span>
                        <h2 className="font-head text-3xl md:text-5xl font-black text-dark tracking-tight">
                            New <span className="text-green italic">Arrivals</span>
                        </h2>
                    </div>
                </div>

                {isInitialLoad ? <SkeletonGrid count={4} /> : newArrivals.length > 0 ? <ProductGrid products={newArrivals} /> : null}
            </section>

            <AdBanner />

            {/* Middle Statement Section */}
            <section className="bg-white py-8 md:py-12 text-center group">
                <div className="max-w-[900px] mx-auto px-6">
                    <div className="mb-6 md:mb-8 text-5xl md:text-7xl animate-bounce-slow text-warm"><i className="fa-solid fa-heart"></i></div>
                    <h2 className="font-head text-3xl md:text-5xl font-black text-dark leading-[1.1] mb-6 md:mb-8 tracking-tight">
                        {t('Pure. Natural. Made with')} <br /> <span className="text-green underline underline-offset-12 decoration-black/5">{t('The Anjaraipetti')}</span>
                    </h2>
                    <p className="text-mid text-base md:text-xl font-medium leading-[1.8] mb-14 max-w-[650px] mx-auto opacity-70">
                        {t('We source only the finest organic ingredients and follow traditional homemade recipes to ensure your baby gets the best nutrition possible.')} <i className="fa-solid fa-leaf"></i>
                    </p>
                    <button
                        onClick={() => navigate('/collections/all')}
                        className="bg-dark text-white rounded-full px-12 md:px-16 py-5 md:py-6 font-black text-xs md:text-sm uppercase tracking-widest shadow-2xl hover:bg-green hover:-translate-y-1 transition-all duration-300 active:scale-95"
                    >
                        {t('Visit Full Shop →')}
                    </button>
                </div>
            </section>

            <AboutStrip />

            {/* Special Promo Offers Section */}
            <section className="max-w-[1400px] mx-auto py-8 md:py-12 px-6">
                <div className="flex justify-between items-end mb-8 md:mb-12">
                    <div>
                        <span className="text-warm text-[12px] font-black uppercase tracking-[0.3em] mb-3 flex items-center gap-3">
                            <span className="w-10 h-px bg-warm" /> {t('Save More')}
                        </span>
                        <h2 className="font-head text-3xl md:text-5xl font-black text-dark tracking-tight">
                            Special <span className="text-sale italic underline decoration-sale/10">Promo</span> Offers
                        </h2>
                    </div>
                    <button
                        onClick={() => navigate('/collections/special-promo-offers')}
                        className="hidden md:flex items-center gap-3 text-[13px] font-black text-green hover:text-warm tracking-widest uppercase transition-all group"
                    >
                        View all promo offers <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </button>
                </div>
                <OffersCarousel showHeader={false} />
                <button
                    onClick={() => navigate('/collections/special-promo-offers')}
                    className="md:hidden w-full mt-10 bg-transparent text-green border-2 border-green/10 rounded-full py-4 font-black text-xs uppercase tracking-widest"
                >
                    View all promo offers →
                </button>
            </section>

            {/* All Products Section */}
            <section className="max-w-[1400px] mx-auto py-8 md:py-12 px-6 md:pb-12">
                <div className="flex justify-between items-end mb-8 md:mb-12">
                    <div>
                        <span className="text-warm text-[12px] font-black uppercase tracking-[0.3em] mb-3 flex items-center gap-3">
                            <span className="w-10 h-px bg-warm" /> {t('Full Range')}
                        </span>
                        <h2 className="font-head text-3xl md:text-5xl font-black text-dark tracking-tight">
                            {t('All')} <span className="text-green italic underline decoration-green-pale/30">{t('Products')}</span>
                        </h2>
                    </div>
                    <button
                        onClick={() => navigate('/collections/all')}
                        className="hidden md:flex items-center gap-3 text-[13px] font-black text-green hover:text-warm tracking-widest uppercase transition-all group"
                    >
                        {t('Explore all products')} <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                    </button>
                </div>
                {isInitialLoad ? <SkeletonGrid count={8} /> : allProducts.length > 0 ? <ProductGrid products={allProducts} /> : null}
                <button
                    onClick={() => navigate('/collections/all')}
                    className="md:hidden w-full mt-10 bg-transparent text-green border-2 border-green/10 rounded-full py-4 font-black text-xs uppercase tracking-widest"
                >
                    {t('Explore all products →')}
                </button>
            </section>

            <ClosingBanner />
            <VideoSection />
        </div>
    );
};

export default HomePage;
