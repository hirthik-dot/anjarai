import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';

const MarqueeStrip = () => {
    const { marqueeItems } = useData();
    const active = (Array.isArray(marqueeItems) ? marqueeItems : []).filter(i => i.is_active !== false).map(i => i.text);
    const fallback = 'FREE SHIPPING ON ORDERS ABOVE ₹499 / TAMIL NADU AND PONDICHERRY';
    const items = useMemo(() => (active.length ? active : [fallback]), [active, fallback]);

    if (items.length === 0) return null;

    return (
        <div
            className="bg-green-pale py-2.5 overflow-hidden select-none border-y border-[#b7e4c7]"
            aria-label="Promotions marquee"
        >
            <div className="flex whitespace-nowrap animate-marquee">
                {[...items, ...items, ...items].map((item, index) => (
                    <span
                        key={`${index}-${item}`}
                        className="text-green text-[13px] font-black uppercase tracking-widest inline-flex items-center mx-6 shrink-0"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default MarqueeStrip;
