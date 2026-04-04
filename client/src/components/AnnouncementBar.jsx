import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';

const AnnouncementBar = () => {
    const { announcements } = useData();

    const active = useMemo(
        () => (Array.isArray(announcements) ? announcements : []).filter(a => a.is_active !== false).map(a => a.text),
        [announcements],
    );

    const items = active.length ? active : ['FREE SHIPPING ON ORDERS ABOVE ₹1499 🇮🇳 FOR ALL OTHER STATES'];

    if (items.length === 0) return null;

    return (
        <div
            className="bg-[color:var(--brand-primary-dark)] py-2.5 overflow-hidden select-none relative z-[1200]"
            aria-label="Announcements"
        >
            <div className="flex whitespace-nowrap animate-marquee">
                {[...items, ...items, ...items].map((item, index) => (
                    <span
                        key={`${index}-${item}`}
                        className="text-white text-[13px] font-bold uppercase tracking-widest inline-flex items-center mx-8 shrink-0"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default AnnouncementBar;
