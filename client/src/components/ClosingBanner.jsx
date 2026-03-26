import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const ClosingBanner = () => {
    const navigate = useNavigate();
    const { closingBanner } = useData();

    if (!closingBanner) return null;

    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 my-10 sm:my-16 md:my-24 group overflow-hidden">
            <div className="relative rounded-2xl sm:rounded-[32px] md:rounded-[48px] overflow-hidden min-h-[300px] sm:h-[340px] md:h-[480px] shadow-2xl flex items-center justify-center text-center p-6 sm:p-10 ring-1 ring-gray-100 shadow-black/10 hover-scale-1005 transition-transform duration-700">

                {/* Background Image with Zoom - Centered perfectly */}
                <div className="absolute inset-0 z-0 group-hover:scale-110 transition-transform duration-[8000ms] pointer-events-none">
                    <img
                        src={closingBanner.image_url}
                        alt="Anjaraipetti"
                        className="w-full h-full object-cover filter brightness-[.85] saturate-[1.1]"
                    />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-1" />

                <div className="relative z-10 max-w-[750px] animate-in zoom-in duration-1000">
                    <span className="inline-block bg-sale text-white text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] rounded-full px-5 sm:px-6 py-2 sm:py-2.5 mb-6 sm:mb-8 shadow-2xl shadow-sale/40">
                        Anjaraipetti Heart
                    </span>
                    <h2 className="font-head text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] sm:leading-[1.05] tracking-tight mb-4 sm:mb-8 drop-shadow-lg font-black uppercase px-2">
                        {closingBanner.title}
                    </h2>
                    <p className="text-white/85 text-xs sm:text-sm md:text-lg mb-8 sm:mb-12 font-medium leading-relaxed max-w-[480px] mx-auto drop-shadow-md font-black uppercase tracking-widest opacity-80 px-4">
                        {closingBanner.subtitle}
                    </p>
                    <button
                        onClick={() => navigate(closingBanner.btn_link || '/collections/all')}
                        className="bg-warm text-white w-full sm:w-auto rounded-full px-10 sm:px-12 md:px-16 py-4 sm:py-4.5 md:py-6 font-black text-[11px] sm:text-xs md:text-sm uppercase tracking-widest shadow-2xl shadow-warm/40 hover:bg-green hover:shadow-green/30 hover:-translate-y-1 active:scale-95 transition-all duration-300"
                    >
                        {closingBanner.btn_text || 'Shop Now →'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClosingBanner;
