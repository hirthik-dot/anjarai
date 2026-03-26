import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const CategoryCards = () => {
    const navigate = useNavigate();
    const { categories } = useData();
    const active = (Array.isArray(categories) ? categories : []).filter(c => c.is_active !== false);

    if (active.length === 0) return null;

    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 my-10 sm:my-16 lg:my-24">
            <div className={`grid grid-cols-1 sm:grid-cols-3 md:grid-cols-${Math.min(active.length, 3)} gap-3 sm:gap-4 lg:gap-6`}>
                {active.map((cat, i) => (
                    <div
                        key={cat._id || i}
                        onClick={() => navigate(cat.link)}
                        className="group relative rounded-xl sm:rounded-2xl overflow-hidden h-[160px] sm:h-[200px] lg:h-[230px] shadow cursor-pointer hover:scale-[1.02] transition-transform duration-250"
                    >
                        {/* Background Image */}
                        <img
                            src={cat.image_url}
                            alt={cat.label}
                            className="w-full h-full object-cover"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent flex flex-col justify-end p-4 sm:p-[18px]">
                            <h3 className="font-head text-white text-base sm:text-[17px] lg:text-[19px] font-bold">
                                {cat.label}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryCards;
