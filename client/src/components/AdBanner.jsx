import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const AdBanner = () => {
    const navigate = useNavigate();
    const { ads } = useData();
    const active = (Array.isArray(ads) ? ads : []).filter(a => a.is_active !== false);

    if (active.length === 0) return null;
    const ad = active[0];

    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 my-10 sm:my-16 md:my-24 overflow-hidden group">
            <div className="relative rounded-2xl md:rounded-[48px] bg-gradient-to-br from-green-light via-green to-dark p-8 sm:p-12 md:p-20 shadow-2xl overflow-hidden shadow-green/20 hover:scale-[1.005] transition-transform duration-700">

                {/* Background Image Overlay */}
                <div className="absolute inset-0 opacity-40 mix-blend-overlay group-hover:scale-110 transition-transform duration-[8000ms] pointer-events-none">
                    <img
                        src={ad.image_url}
                        alt={ad.title || "Ad Banner"}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Decorative 🌿 SVG Icon */}
                <div className="absolute -top-6 sm:-top-12 -right-6 sm:-right-12 text-[80px] sm:text-[140px] md:text-[240px] opacity-[.08] select-none pointer-events-none rotate-12 group-hover:rotate-45 transition-transform duration-1000">🌿</div>

                <div className="relative z-10 max-w-[550px] animate-in slide-in-from-bottom-6 duration-700 cursor-pointer" onClick={() => ad.btn_link && navigate(ad.btn_link)}>
                    <span className="inline-block bg-sale text-white text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] rounded-full px-4 sm:px-5 py-1.5 sm:py-2 mb-6 sm:mb-8 shadow-xl shadow-sale/40">
                        {ad.sticker || 'Exclusive Offer'}
                    </span>
                    <h2 className="font-head text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] sm:leading-[1.05] tracking-tight mb-4 sm:mb-8 drop-shadow-lg uppercase">
                        {ad.heading_1 || 'Anjaraipetti'} <br /> <span className="text-warm underline decoration-white/20 underline-offset-4 sm:underline-offset-8">{ad.heading_2 || 'Care'}</span>
                    </h2>
                    <p className="text-white/80 text-xs sm:text-sm md:text-lg mb-8 sm:mb-12 font-medium leading-relaxed max-w-[420px] drop-shadow-sm font-black uppercase tracking-widest">
                       {ad.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                        <button
                            onClick={() => ad.btn_link && navigate(ad.btn_link)}
                            className="bg-white text-green w-full sm:w-auto rounded-full px-8 sm:px-10 md:px-14 py-3.5 sm:py-4 md:py-5 font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-widest shadow-2xl hover:bg-warm hover:text-white hover:-translate-y-1 active:scale-95 transition-all duration-350"
                        >
                            {ad.btn_text || 'Shop Offers →'}
                        </button>
                        <div className="flex flex-col text-white/60 text-[9px] sm:text-[11px] md:text-[13px] font-black uppercase tracking-widest whitespace-pre-line text-center sm:text-left mt-2 sm:mt-0">
                            {ad.footer_text}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdBanner;
