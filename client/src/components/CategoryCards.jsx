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
        <section className="w-full bg-[var(--brand-surface)] relative z-10 -mt-6">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="bg-white rounded-[24px] sm:rounded-[40px] shadow-sm border border-gray-100/50 p-6 sm:p-10">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-10 justify-items-center">
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
                                    className="flex flex-col items-center gap-3 sm:gap-4 group transition-transform hover:-translate-y-1 duration-300"
                                    aria-label={catLabel}
                                >
                                    <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] flex items-center justify-center p-2 rounded-2xl bg-gray-50/50 group-hover:bg-brand-green-pale/10 transition-colors">
                                        {cat.image_url ? (
                                            <img
                                                src={cat.image_url}
                                                alt={catLabel}
                                                loading="lazy"
                                                className="w-full h-full object-contain"
                                                style={{ opacity: isSelected ? 1 : 0.9 }}
                                            />
                                        ) : (
                                            <span className="text-4xl text-brand-mid/20">📦</span>
                                        )}
                                    </div>

                                    <span
                                        className="text-[10px] sm:text-[12px] font-bold uppercase tracking-wider text-center leading-tight transition-colors"
                                        style={{ color: isSelected ? 'var(--brand-primary)' : '#4a4a4a' }}
                                    >
                                        {catLabel}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CategoryCards;
