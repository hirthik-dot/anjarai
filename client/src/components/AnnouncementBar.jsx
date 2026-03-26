import React from 'react';
import { useData } from '../context/DataContext';

const AnnouncementBar = () => {
    const { announcements } = useData();
    const active = (Array.isArray(announcements) ? announcements : []).filter(a => a.is_active !== false);

    if (active.length === 0) return null;

    return (
        <div className="bg-green py-2 overflow-hidden select-none">
            {/* Desktop: side by side */}
            <div className="hidden md:flex items-center justify-center gap-10">
                {active.map((a, i) => (
                    <React.Fragment key={a._id || i}>
                        <span className="text-white text-[10.5px] lg:text-[11.5px] font-bold uppercase tracking-widest">
                            {a.text}
                        </span>
                        {i < active.length - 1 && <span className="opacity-40 text-white text-xs">|</span>}
                    </React.Fragment>
                ))}
            </div>

            {/* Mobile: single scrolling marquee */}
            <div className="md:hidden flex">
                <div className={`flex gap-14 whitespace-nowrap ${active.length > 0 ? 'animate-marquee' : ''}`}>
                    {[...active, ...active].map((a, i) => (
                        <span key={`${a._id || i}-${i}`} className="text-white text-[9.5px] font-bold uppercase tracking-widest">
                            {a.text}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementBar;
