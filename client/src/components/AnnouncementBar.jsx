import React, { useMemo, useState } from 'react';
import { useData } from '../context/DataContext';

const AnnouncementBar = () => {
    const { announcements } = useData();
    const [dismissed, setDismissed] = useState(false);

    const active = useMemo(
        () => (Array.isArray(announcements) ? announcements : []).filter(a => a.is_active !== false),
        [announcements],
    );

    if (dismissed || active.length === 0) return null;

    return (
        <div
            className="bg-[color:var(--brand-primary-dark)] py-2 px-4 overflow-hidden select-none relative z-[1200]"
            style={{ color: 'white' }}
        >
            <div className="relative max-w-[1400px] mx-auto flex items-center justify-center">
                <span className="text-[13px] font-bold text-white text-center px-10">
                    {active[0]?.text}
                </span>

                <button
                    type="button"
                    onClick={() => setDismissed(true)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white/90 hover:text-white"
                    aria-label="Dismiss announcement"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

export default AnnouncementBar;
