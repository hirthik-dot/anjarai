import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const AboutStrip = () => {
    const navigate = useNavigate();
    const { about } = useData();

    if (!about) return null;

    return (
        <section className="bg-cream py-10 sm:py-14 lg:py-16 relative overflow-hidden">
            {/* Decorative SVG/Shapes */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-pale/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-warm/5 rounded-full blur-3xl" />

            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">

                    {/* Left Column - Large Image */}
                    <div className="relative group animate-in slide-in-from-left duration-1000">
                        <img
                            src={about.image_url}
                            alt={about.title}
                            className="rounded-2xl w-full h-[240px] sm:h-[300px] lg:h-[360px] object-cover shadow-[0_12px_40px_rgba(0,0,0,.12)]"
                        />

                        {/* Quality Badge */}
                        <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-6 md:bottom-2 md:-right-8 bg-white rounded-xl sm:rounded-[24px] p-3 sm:p-5 flex flex-col items-center gap-1 sm:gap-2 shadow-2xl animate-float font-head">
                            <span className="text-2xl sm:text-4xl">🎖️</span>
                            <span className="text-[9px] sm:text-xs font-black text-dark uppercase tracking-[0.2em] text-center">
                                100% <br /> Lab Approved
                            </span>
                        </div>
                    </div>

                    {/* Right Column - Content */}
                    <div className="flex flex-col animate-in slide-in-from-right duration-1000 mt-2 sm:mt-0">
                        <span className="text-warm text-[10px] sm:text-[12px] font-black uppercase tracking-[0.3em] mb-2 sm:mb-4 flex items-center gap-2">
                            <span className="w-6 sm:w-8 h-px bg-warm" /> Our Story
                        </span>
                        <h2 className="font-head text-2xl sm:text-3xl lg:text-[34px] font-bold leading-[1.2] mb-3 sm:mb-3.5">
                            {about.title}
                        </h2>
                        <p className="text-mid text-[13.5px] sm:text-[14.5px] leading-[1.75] mb-4 sm:mb-5.5">
                            {about.body}
                        </p>

                        <ul className="space-y-2 sm:space-y-2.5 mb-5 sm:mb-6">
                            {(about.badges || []).map((badge, index) => (
                                <li key={index} className="flex items-center gap-2.5 text-[12.5px] sm:text-[13.5px] font-semibold text-green cursor-default">
                                    🌿 {badge}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => navigate(about.btn_link || '/collections/all')}
                            className="w-fit bg-warm text-white rounded-full px-5 sm:px-7 py-2.5 sm:py-3 font-bold text-sm sm:text-base hover:bg-green transition-all"
                        >
                            {about.btn_text || 'Shop Now →'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutStrip;
