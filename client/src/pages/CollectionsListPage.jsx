import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLang } from '../context/LanguageContext';

const CollectionsListPage = () => {
    const navigate = useNavigate();
    const { categories, loading } = useData();
    const { t } = useLang();
    
    // Filter active collections
    const active = (Array.isArray(categories) ? categories : []).filter(c => c.is_active !== false);

    if (loading && active.length === 0) {
        return (
            <div className="min-h-[60vh] max-w-[1400px] mx-auto px-4 md:px-10 py-12">
                <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-xl mb-10"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="bg-gray-100 animate-pulse h-[300px] md:h-[400px] rounded-[32px] w-full"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light/30 pt-10 pb-16">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
                {/* Header */}
                <div className="text-left mb-10 md:mb-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="text-warm text-[12px] font-black uppercase tracking-[0.3em] mb-3 flex items-center justify-start gap-3">
                        <span className="w-10 h-px bg-warm" /> {t('Explore All')}
                    </span>
                    <h1 className="font-head text-4xl md:text-5xl lg:text-6xl font-black text-dark tracking-tight">
                        {t('Our')} <span className="text-green italic underline decoration-green-pale/30">{t('Collections')}</span>
                    </h1>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {active.map((cat, i) => {
                        const catSlug = cat.slug || '';
                        const catLink = `/collections/${catSlug}`;
                        const catLabel = cat.name || cat.label || 'Collection';
                        
                        return (
                            <button
                                key={cat._id || i}
                                type="button"
                                onClick={() => navigate(catLink)}
                                className="group relative rounded-[32px] overflow-hidden bg-white shadow-lg hover:shadow-2xl hover:shadow-green/20 transition-all duration-500 animate-in fade-in zoom-in-95 duration-700 text-left w-full block aspect-[4/5] sm:aspect-square md:aspect-[4/5] focus:outline-none focus:ring-4 focus:ring-green/20"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                {/* Image Wrapper */}
                                <div className="absolute inset-0 w-full h-full bg-gray-100 overflow-hidden">
                                     {cat.image_url ? (
                                        <img
                                            src={cat.image_url}
                                            alt={catLabel}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-6xl opacity-20 bg-gray-50 scale-150">
                                            🌿
                                        </div>
                                    )}
                                </div>

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100"></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100"></div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform translate-y-0 md:translate-y-2 group-hover:translate-y-0 transition-transform duration-500 z-10">
                                    <h3 className="font-head text-3xl md:text-4xl font-black text-white mb-2 md:mb-3 tracking-wide drop-shadow-md leading-none">
                                        {catLabel}
                                    </h3>
                                    
                                    <div className="flex items-center gap-2 text-warm font-black text-[11px] md:text-sm tracking-[0.2em] uppercase opacity-90 md:opacity-0 group-hover:opacity-100 transition-all duration-500 md:translate-x-[-10px] group-hover:translate-x-0">
                                        {t('View Products')} <span className="text-base md:text-lg">→</span>
                                    </div>
                                </div>
                                
                                {/* Top Badge (Optional, you could use this if the collection is "new" or has offers) */}
                                <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100 border border-white/30 text-xl shadow-lg">
                                    <i className="fas fa-arrow-right -rotate-45"></i>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CollectionsListPage;
