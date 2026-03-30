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
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-6">
                <div className="flex gap-4 overflow-x-auto scrollbar-hide -webkit-overflow-scrolling:touch md:grid md:grid-cols-8 md:gap-6 md:overflow-x-visible">
                    {active.map((cat, i) => {
                        const isSelected =
                            Boolean(cat.link) &&
                            (location.pathname === cat.link || (location.pathname || '').startsWith(cat.link));

                        return (
                            <button
                                key={cat._id || i}
                                type="button"
                                onClick={() => navigate(cat.link)}
                                className="min-w-[92px] md:min-w-0 flex flex-col items-center gap-2"
                                aria-label={cat.label}
                            >
                                <div
                                    className="rounded-full overflow-hidden flex items-center justify-center w-[80px] h-[80px] md:w-[100px] md:h-[100px]"
                                    style={{
                                        borderWidth: 3,
                                        borderStyle: 'solid',
                                        borderColor: isSelected ? 'var(--brand-primary)' : 'var(--brand-primary)',
                                        background: isSelected ? 'var(--brand-primary)' : 'transparent',
                                    }}
                                >
                                    <img
                                        src={cat.image_url}
                                        alt={cat.label}
                                        loading="lazy"
                                        className="w-full h-full object-cover"
                                        style={{ opacity: isSelected ? 1 : 1 }}
                                    />
                                </div>

                                <span
                                    className="text-[13px] font-black"
                                    style={{ color: isSelected ? '#ffffff' : 'var(--brand-text)' }}
                                >
                                    {cat.label}
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
