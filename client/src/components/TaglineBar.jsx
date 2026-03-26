import React from 'react';
import { useData } from '../context/DataContext';

const TaglineBar = () => {
    const { tagline } = useData();
    if (!tagline) return null;

    return (
        <div className="bg-green-pale py-1.5 border-b border-[#b7e4c7]">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-6 px-4">
                <span className="text-green text-[10px] sm:text-xs font-bold uppercase tracking-widest text-center">
                    {tagline.left_text}
                </span>
                {/* Divider — desktop only */}
                <span className="hidden sm:block text-green/40 text-xs">|</span>
                <span className="text-green text-[10px] sm:text-xs font-bold uppercase tracking-widest text-center">
                    {tagline.right_text}
                </span>
            </div>
        </div>
    );
};

export default TaglineBar;
