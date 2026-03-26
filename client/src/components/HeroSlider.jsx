import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const HeroSlider = () => {
    const { heroSlides } = useData();
    const slides = (Array.isArray(heroSlides) ? heroSlides : []).filter(s => s.is_active !== false);
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const navigate = useNavigate();

    const touchStartX = useRef(null);

    const next = useCallback(() => {
        if (slides.length === 0) return;
        setCurrent((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const prev = () => {
        if (slides.length === 0) return;
        setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (!touchStartX.current) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? next() : prev();
        }
        touchStartX.current = null;
    };

    useEffect(() => {
        if (!isPaused && slides.length > 0) {
            const interval = setInterval(next, 4500);
            return () => clearInterval(interval);
        }
    }, [next, isPaused, slides.length]);

    if (slides.length === 0) return null;

    return (
        <div
            className="relative h-[240px] sm:h-[340px] md:h-[420px] lg:h-[500px] overflow-hidden group select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    {/* Background Image with Ken Burns Effect */}
                    <img
                        src={slide.image_url}
                        alt={slide.title}
                        className={`w-full h-full object-cover transform transition-transform duration-[8000ms] ease-linear ${index === current ? 'scale-110' : 'scale-100'}`}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent sm:from-green/80 sm:via-green/40 flex items-center">
                        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 lg:px-16 w-full">
                            <div className={`max-w-[260px] sm:max-w-[380px] lg:max-w-[480px] transition-all duration-700 delay-300 transform ${index === current ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
                                <span className="inline-block bg-warm text-white text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] rounded-full px-2.5 sm:px-4 py-0.5 sm:py-1.5 mb-2 sm:mb-5 shadow-lg shadow-warm/20">
                                    {slide.tag}
                                </span>

                                <h1 className="font-head text-xl sm:text-3xl lg:text-5xl font-bold text-white leading-tight mb-2 sm:mb-4 drop-shadow-sm">
                                    {slide.title}
                                </h1>

                                <p className="hidden sm:block text-white/88 text-sm lg:text-base leading-relaxed max-w-[280px] lg:max-w-[380px] mb-4 drop-shadow-sm">
                                    {slide.subtitle}
                                </p>

                                <button
                                    onClick={() => navigate(slide.btn_link)}
                                    className="bg-warm text-white rounded-full px-4 sm:px-7 py-2 sm:py-3 font-bold text-xs sm:text-sm uppercase tracking-widest shadow-xl shadow-warm/40 hover:-translate-y-0.5 transition-transform duration-300 mt-2 hover:bg-white hover:text-warm"
                                >
                                    {slide.btn_text}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows — hidden on mobile */}
            <button
                onClick={prev}
                className="hidden sm:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-10 md:w-12 h-10 md:h-12 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={next}
                className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-10 md:w-12 h-10 md:h-12 items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Indicators */}
            <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${index === current ? 'w-6 sm:w-8 bg-warm' : 'w-2 sm:w-3 bg-white/40 hover:bg-white/60'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;
