import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';

const MarqueeStrip = () => {
    const { marqueeItems } = useData();
    const active = (Array.isArray(marqueeItems) ? marqueeItems : []).filter(i => i.is_active !== false).map(i => i.text);
    const fallback = '🌿 Free delivery above ₹499 · 🧂 100% Natural · ✨ A Pinch of Magic · 🚚 Ships Pan-India ·';
    const items = useMemo(() => (active.length ? active : [fallback]), [active, fallback]);

    if (items.length === 0) return null;

    return (
        <div
            className="bg-[var(--brand-gold)] py-2.5 overflow-hidden select-none border-y border-[rgba(0,0,0,0.04)]"
            aria-label="Promotions marquee"
        >
            <div className="flex whitespace-nowrap animate-marquee">
                {[...items, ...items].map((item, index) => (
                    <span
                        key={`${index}-${item}`}
                        className="text-[color:var(--brand-primary-dark)] text-[13px] font-black uppercase tracking-widest inline-flex items-center mx-6 shrink-0"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default MarqueeStrip;
