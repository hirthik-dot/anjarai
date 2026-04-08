import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const CategoryCards = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { categories } = useData();
    const active = (Array.isArray(categories) ? categories : []).filter(c => c.is_active !== false);

    if (active.length === 0) return null;

    return (
        <section className="w-full bg-[var(--brand-surface)] border-y border-[rgba(165,214,167,0.35)]">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
                <div className="mb-8 md:mb-10 flex items-center justify-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse" />
                    <h2 className="text-xl md:text-2xl font-black text-brand-dark uppercase tracking-widest leading-none">
                        Categories
                    </h2>
                </div>
                <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-2 md:flex-wrap md:justify-center md:overflow-x-visible">
                    {active.map((cat, i) => {
                        const catSlug = cat.slug || '';
                        const catLink = `/collections/${catSlug}`;
                        const catLabel = cat.name || cat.label || '';
                        const isSelected =
                            Boolean(catLink) &&
                            (location.pathname === catLink || (location.pathname || '').startsWith(catLink));

                        return (
                            <button
                                key={cat._id || i}
                                type="button"
                                onClick={() => navigate(catLink)}
                                className="min-w-[80px] sm:min-w-[100px] md:min-w-0 flex flex-col items-center gap-3 sm:gap-4 group transition-transform hover:scale-105 duration-300"
                                aria-label={catLabel}
                            >
                                <div
                                    className="rounded-full overflow-hidden flex items-center justify-center w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] shadow-sm group-hover:shadow-md transition-shadow"
                                    style={{
                                        borderWidth: 3,
                                        borderStyle: 'solid',
                                        borderColor: isSelected ? 'var(--brand-primary)' : 'var(--brand-primary)',
                                        background: isSelected ? 'var(--brand-primary)' : 'transparent',
                                    }}
                                >
                                    {cat.image_url ? (
                                        <img
                                            src={cat.image_url}
                                            alt={catLabel}
                                            loading="lazy"
                                            className="w-full h-full object-cover"
                                            style={{ opacity: isSelected ? 1 : 1 }}
                                        />
                                    ) : (
                                        <span className="text-3xl text-brand-mid/20">📦</span>
                                    )}
                                </div>

                                <span
                                    className="text-[12px] sm:text-[13px] font-black tracking-wide text-center leading-tight transition-colors"
                                    style={{ color: isSelected ? '#ffffff' : 'var(--brand-text)' }}
                                >
                                    {catLabel}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default CategoryCards;
