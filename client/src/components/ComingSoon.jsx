import React from 'react';
import { useNavigate } from 'react-router-dom';

const ComingSoon = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24 md:py-36 px-4 sm:px-6 w-full max-w-[1400px] mx-auto group">
            <div className="relative mb-8 sm:mb-12 animate-bounce-slow">
                <div className="absolute -inset-10 bg-green/10 rounded-full blur-[40px] sm:blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <span className="text-6xl sm:text-7xl md:text-9xl relative z-10 transition-transform duration-700 group-hover:scale-110">🌱</span>
            </div>

            <h2 className="font-head text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-black text-dark tracking-tight mb-4 sm:mb-8 drop-shadow-sm group-hover:text-green transition-colors">
                Coming <span className="text-warm underline decoration-green-pale/30 underline-offset-8 sm:underline-offset-16">Soon</span>
            </h2>

            <p className="text-mid text-sm sm:text-base md:text-lg lg:text-xl max-w-[600px] mb-10 sm:mb-14 font-semibold leading-relaxed opacity-70 drop-shadow-lg px-2">
                We're currently hand-crafting these amazing organic products just for you. Subscribe to our newsletter to be notified when they drop!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 w-full sm:w-auto px-4 sm:px-0">
                <button
                    onClick={() => navigate('/collections/all')}
                    className="w-full sm:w-auto bg-green text-white rounded-full px-8 sm:px-12 md:px-16 py-4 md:py-6 font-black text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] shadow-xl sm:shadow-2xl shadow-green/20 hover:bg-warm hover:shadow-warm/30 transition-all duration-300 hover:-translate-y-1 active:scale-95"
                >
                    Browse All Products →
                </button>

                <button
                    onClick={() => navigate('/')}
                    className="w-full sm:w-auto bg-transparent text-dark border-2 border-dark/10 rounded-full px-8 sm:px-10 md:px-14 py-4 md:py-6 font-black text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:bg-dark hover:text-white hover:border-dark transition-all duration-350 hover:-translate-y-1 active:scale-95"
                >
                    Back To Home
                </button>
            </div>

            <p className="mt-14 sm:mt-20 text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] text-mid/20 flex flex-nowrap items-center justify-center gap-3 sm:gap-6 w-full">
                <span className="w-8 sm:w-14 h-px bg-current opacity-20 shrink-0" /> <span className="shrink-0">Quality Takes Time</span> <span className="w-8 sm:w-14 h-px bg-current opacity-20 shrink-0" />
            </p>
        </div>
    );
};

export default ComingSoon;
