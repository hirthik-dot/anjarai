import React from 'react';
import { useData } from '../context/DataContext';

const MarqueeStrip = () => {
    const { marqueeItems } = useData();
    const active = (Array.isArray(marqueeItems) ? marqueeItems : []).filter(i => i.is_active !== false).map(i => i.text);

    if (active.length === 0) return null;

    return (
        <div className="bg-green-pale border-y border-[#b7e4c7] py-2.5 md:py-3.5 overflow-hidden select-none">
            <div className="flex whitespace-nowrap animate-marquee">
                {/* First Set */}
                {active.map((item, index) => (
                    <span key={index} className="text-green text-[11px] md:text-[12.5px] font-black uppercase tracking-widest inline-flex items-center mx-6 md:mx-10 shrink-0">
                        <span className="mr-3 opacity-50">🌿</span> {item}
                    </span>
                ))}
                {/* Duplicated for Seamless Loop */}
                {active.map((item, index) => (
                    <span key={`dup-${index}`} className="text-green text-[11px] md:text-[12.5px] font-black uppercase tracking-widest inline-flex items-center mx-6 md:mx-10 shrink-0">
                        <span className="mr-3 opacity-50">🌿</span> {item}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default MarqueeStrip;
