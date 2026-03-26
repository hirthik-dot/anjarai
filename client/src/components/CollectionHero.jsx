import React from 'react';
import { NavLink } from 'react-router-dom';

const CollectionHero = ({ title, subtitle, breadcrumb = [] }) => {
    return (
        <div className="bg-gradient-to-br from-green via-green/95 to-green-light py-10 sm:py-16 md:py-20 text-center relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 p-10 text-[180px] opacity-[0.06] select-none pointer-events-none rotate-12">🌿</div>
            <div className="absolute bottom-0 left-0 p-10 text-[140px] opacity-[0.04] select-none pointer-events-none -rotate-12">🌱</div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <h1 className="font-head text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 sm:mb-4 drop-shadow-sm tracking-tight">
                    {title}
                </h1>
                <p className="text-white/85 text-[13px] sm:text-sm md:text-lg max-w-[600px] mx-auto leading-relaxed font-medium px-2">
                    {subtitle}
                </p>

                {/* Breadcrumb */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2.5 mt-4 sm:mt-8 text-[10px] sm:text-[12px] md:text-[13.5px] font-bold tracking-widest uppercase">
                    <NavLink to="/" className="text-white/60 hover:text-white transition-colors">Home</NavLink>
                    {breadcrumb.map((item, index) => (
                        <React.Fragment key={index}>
                            <span className="text-white/30">/</span>
                            <NavLink
                                to={item.link}
                                className={index === breadcrumb.length - 1 ? 'text-warm font-black' : 'text-white/60 hover:text-white transition-colors'}
                            >
                                {item.name}
                            </NavLink>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CollectionHero;
