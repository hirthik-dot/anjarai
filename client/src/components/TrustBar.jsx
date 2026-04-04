import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';

const TrustBar = () => {
    const { trustItems } = useData();
    const active = (Array.isArray(trustItems) ? trustItems : []).filter(i => i.is_active !== false);

    const fallback = useMemo(
        () => [
            { icon: '<i class="fa-solid fa-tree"></i>', image_url: '', title: 'No Palm Oil', subtitle: 'Hygenically Made' },
            { icon: '<i class="fa-solid fa-truck"></i>', image_url: '', title: 'Free Shipping', subtitle: 'Orders Above ₹1000' },
            { icon: '<i class="fa-solid fa-box-open"></i>', image_url: '', title: 'Secure Package', subtitle: 'Professionally Packed' },
            { icon: '<i class="fa-solid fa-shield-halved"></i>', image_url: '', title: 'Secure Payments', subtitle: 'Safest payment options' },
        ],
        [],
    );

    const items = active.length ? active : fallback;

    return (
        <div className="bg-white border-b border-[color:var(--brand-border)] py-4 sm:py-5">
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
                <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x divide-gray-200/70">
                    {items.slice(0, 4).map((item, index) => (
                        <div key={item._id || index} className={`flex items-center gap-3 sm:gap-4 py-3 md:py-0 px-2 sm:px-4 md:px-6 ${index % 2 === 1 ? 'border-l border-gray-200/70 md:border-l-0' : ''}`}>
                            {item.image_url ? (
                                <img src={item.image_url} alt={item.title} className="w-[34px] sm:w-[42px] h-[34px] sm:h-[42px] object-contain flex-shrink-0" />
                            ) : (
                                <span
                                    className="text-[26px] sm:text-[32px] flex-shrink-0 flex items-center justify-center opacity-80"
                                    style={{ color: 'var(--brand-primary)' }}
                                    dangerouslySetInnerHTML={{ __html: item.icon.includes('<') ? item.icon : item.icon }}
                                >
                                </span>
                            )}
                            <div className="min-w-0">
                                <span className="block text-[12px] sm:text-[13px] font-black uppercase tracking-wide text-brand-dark/80 whitespace-nowrap overflow-hidden text-ellipsis">
                                    {item.title}
                                </span>
                                {item.subtitle ? (
                                    <span className="block text-[10px] sm:text-[11px] text-brand-mid/80 whitespace-nowrap overflow-hidden text-ellipsis">
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
