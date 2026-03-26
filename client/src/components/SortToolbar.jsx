import React from 'react';

const SortToolbar = ({ count, onSort }) => {
    return (
        <div className="border-b border-gray-100 py-4 sm:py-6 sticky top-[68px] sm:top-[76px] lg:top-[85px] z-30 bg-white/90 backdrop-blur-md">
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex justify-between items-center gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                    <span className="text-[12px] sm:text-[14px] md:text-base text-mid font-black tracking-tight">
                        {count} products
                    </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 group">
                    <label className="hidden sm:inline-block text-[11px] sm:text-[13.5px] font-black text-dark/40 uppercase tracking-widest">Sort by:</label>
                    <select
                        onChange={(e) => onSort(e.target.value)}
                        className="w-[140px] sm:w-auto border-2 border-green-pale/50 rounded-lg sm:rounded-xl px-2 sm:px-5 py-2 sm:py-3 text-[11px] sm:text-[13.5px] md:text-[14.5px] font-bold outline-none cursor-pointer focus:border-green transition-all bg-white hover:border-green-light"
                    >
                        <option value="featured">Featured</option>
                        <option value="best-selling">Best selling</option>
                        <option value="price-low-high">Price, low to high</option>
                        <option value="price-high-low">Price, high to low</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SortToolbar;
