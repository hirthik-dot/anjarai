import React from 'react';
import { useData } from '../context/DataContext';

const TrustBar = () => {
    const { trustItems } = useData();
    const active = (Array.isArray(trustItems) ? trustItems : []).filter(i => i.is_active !== false);

    if (active.length === 0) return null;

    return (
        <div className="bg-green py-5 sm:py-6">
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
                <div className={`grid grid-cols-2 sm:grid-cols-3 ${active.length >= 5 ? 'lg:grid-cols-5' : `lg:grid-cols-${active.length}`} gap-4 sm:gap-6`}>
                    {active.map((item, index) => (
                        <div
                            key={item._id || index}
                            className={`flex items-center gap-2.5 sm:gap-3 text-white ${index === 4 ? 'col-span-2 sm:col-span-1 justify-center sm:justify-start' : ''}`}
                        >
                            <span className="text-xl sm:text-2xl flex-shrink-0">{item.icon}</span>
                            <div>
                                <span className="block text-[11.5px] sm:text-sm font-bold uppercase tracking-wide">{item.title}</span>
                                <span className="text-[10px] sm:text-[11.5px] opacity-80 italic">{item.subtitle}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrustBar;
