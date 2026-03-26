import React from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Navbar = () => {
    const { navbar } = useData();
    const links = (navbar?.nav_links || []);

    if (links.length === 0) return null;

    return (
        <nav className="bg-green shadow-md relative z-40 overflow-x-auto scrollbar-hide">
            <div className="max-w-[1400px] mx-auto flex whitespace-nowrap px-4 md:px-10">
                {links.map((link, i) => (
                    <NavLink
                        key={i}
                        to={link.link}
                        className={({ isActive }) =>
                            `inline-block px-3.5 md:px-5 py-3.5 md:py-4 text-[12.5px] md:text-[13.5px] font-bold tracking-wide transition-all duration-300 border-b-[3px]
              ${isActive
                                ? 'text-white border-warm'
                                : 'text-white/85 border-transparent hover:text-white hover:border-warm/50'}`
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
