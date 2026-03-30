import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';

const TrustBar = () => {
    const { trustItems } = useData();
    const active = (Array.isArray(trustItems) ? trustItems : []).filter(i => i.is_active !== false);

    const fallback = useMemo(
        () => [
            { icon: '✓', title: 'Lab Tested', subtitle: '' },
            { icon: '🌿', title: '100% Natural', subtitle: '' },
            { icon: '🚚', title: 'Free Delivery ₹499+', subtitle: '' },
            { icon: '❤️', title: '5000+ Happy Customers', subtitle: '' },
        ],
        [],
    );

    const items = active.length ? active : fallback;

    return (
        <div className="bg-white border-b border-[color:var(--brand-border)] py-4 sm:py-5">
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
                <div className="grid grid-cols-2 md:flex md:items-stretch md:justify-between gap-3 sm:gap-4">
                    {items.slice(0, 4).map((item, index) => (
                        <div key={item._id || index} className="flex items-center gap-3 sm:gap-4">
                            <span
                                className="text-[20px] sm:text-[22px] flex-shrink-0"
                                style={{ color: 'var(--brand-primary)' }}
                            >
                                {item.icon}
                            </span>
                            <div className="min-w-0">
                                <span className="block text-[12px] sm:text-[13px] font-bold uppercase tracking-wide text-[color:var(--brand-text)]">
                                    {item.title}
                                </span>
                                {item.subtitle ? (
                                    <span className="block text-[11px] text-mid opacity-80 italic whitespace-nowrap overflow-hidden text-ellipsis">
                                        {item.subtitle}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrustBar;
