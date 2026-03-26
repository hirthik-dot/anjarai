import React from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Footer = () => {
    const { footer } = useData();

    if (!footer) return null;

    return (
        <footer className="bg-dark pt-16 sm:pt-24 lg:pt-36 relative overflow-hidden text-white/70 select-none">
            {/* Background Decorative Shapes */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green/5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-warm/5 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />

            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 sm:gap-14 lg:gap-24 relative z-10 pb-16 sm:pb-20 lg:pb-32">

                {/* Column 1 - Brand */}
                <div className="flex flex-col animate-in slide-in-from-bottom duration-700">
                    <NavLink to="/" className="font-head text-2xl md:text-3xl font-black text-white mb-6 md:mb-10 tracking-tight flex items-center gap-3">
                        <span className="w-10 h-10 rounded-full bg-green text-white flex items-center justify-center text-lg shadow-lg shadow-green/10">TA</span>
                        The <span className="text-warm underline decoration-white/10 underline-offset-4 decoration-dashed">Anjaraipetti</span>
                    </NavLink>
                    <p className="text-white/60 text-sm md:text-base leading-[1.8] font-medium max-w-[340px] mb-12 drop-shadow-sm opacity-90 transition-opacity hover:opacity-100 italic">
                        "{footer.brand_description}"
                    </p>

                    <div className="flex items-center gap-4 md:gap-6">
                        {footer.instagram_url && (
                             <a href={footer.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 md:w-12 h-10 md:h-12 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:bg-green hover:text-white hover:border-green hover:-translate-y-1 hover:shadow-2xl hover:shadow-green/40 transition-all duration-300 backdrop-blur-sm group">
                                <i className="fab fa-instagram text-lg md:text-xl transition-transform group-hover:scale-110" />
                             </a>
                        )}
                        {footer.facebook_url && (
                             <a href={footer.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 md:w-12 h-10 md:h-12 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:bg-green hover:text-white hover:border-green hover:-translate-y-1 hover:shadow-2xl hover:shadow-green/40 transition-all duration-300 backdrop-blur-sm group">
                                <i className="fab fa-facebook text-lg md:text-xl transition-transform group-hover:scale-110" />
                             </a>
                        )}
                        {footer.youtube_url && (
                             <a href={footer.youtube_url} target="_blank" rel="noopener noreferrer" className="w-10 md:w-12 h-10 md:h-12 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:bg-green hover:text-white hover:border-green hover:-translate-y-1 hover:shadow-2xl hover:shadow-green/40 transition-all duration-300 backdrop-blur-sm group">
                                <i className="fab fa-youtube text-lg md:text-xl transition-transform group-hover:scale-110" />
                             </a>
                        )}
                    </div>
                </div>

                {/* Column 2 - Quick Links */}
                <div className="flex flex-col animate-in slide-in-from-bottom duration-700 delay-100">
                    <h4 className="font-head text-lg md:text-xl font-black text-white mb-8 md:mb-12 tracking-wide uppercase flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-warm" /> Policies
                    </h4>
                    <ul className="space-y-4 md:space-y-6">
                        {(footer.quick_links || []).map((link, i) => (
                            <li key={i} className="flex group">
                                <NavLink
                                    to={link.href}
                                    className="text-[13px] md:text-[14px] font-black uppercase tracking-widest text-white/50 hover:text-warm transition-all duration-300 relative pl-0 group-hover:pl-4"
                                >
                                    <span className="absolute left-0 opacity-0 group-hover:opacity-100 transition-all duration-300">→</span>
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 3 - Categories */}
                <div className="flex flex-col animate-in slide-in-from-bottom duration-700 delay-200">
                    <h4 className="font-head text-lg md:text-xl font-black text-white mb-8 md:mb-12 tracking-wide uppercase flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-green" /> Categories
                    </h4>
                    <ul className="space-y-4 md:space-y-6">
                        {(footer.category_links || []).map((link, i) => (
                            <li key={i} className="flex group">
                                <NavLink
                                    to={link.href}
                                    className="text-[13px] md:text-[14px] font-black uppercase tracking-widest text-white/50 hover:text-green transition-all duration-300 relative pl-0 group-hover:pl-4"
                                >
                                    <span className="absolute left-0 opacity-0 group-hover:opacity-100 transition-all duration-300">→</span>
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 4 - Contact Us */}
                <div className="flex flex-col animate-in slide-in-from-bottom duration-700 delay-300">
                    <h4 className="font-head text-lg md:text-xl font-black text-white mb-8 md:mb-12 tracking-wide uppercase flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-sale" /> Contact Us
                    </h4>
                    <div className="space-y-6 md:space-y-10">
                        {footer.whatsapp_link && (
                             <a href={footer.whatsapp_link} className="flex items-center gap-5 group w-fit" target="_blank" rel="noopener noreferrer">
                                <div className="w-12 md:w-14 h-12 md:h-14 bg-green/10 rounded-2xl flex items-center justify-center text-green group-hover:bg-green group-hover:text-white transition-all duration-350 shadow-lg shadow-green/5">
                                    <i className="fab fa-whatsapp text-xl md:text-2xl" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] md:text-[12px] font-black text-white/30 tracking-[0.2em] mb-1">WhatsApp</span>
                                    <span className="text-sm md:text-base font-black text-white group-hover:text-green transition-colors">{footer.whatsapp_number}</span>
                                </div>
                             </a>
                        )}

                        {footer.instagram_handle && (
                             <a href={footer.instagram_url} className="flex items-center gap-5 group w-fit" target="_blank" rel="noopener noreferrer">
                                <div className="w-12 md:w-14 h-12 md:h-14 bg-warm/10 rounded-2xl flex items-center justify-center text-warm group-hover:bg-warm group-hover:text-white transition-all duration-350 shadow-lg shadow-warm/5">
                                    <i className="fab fa-instagram text-xl md:text-2xl" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] md:text-[12px] font-black text-white/30 tracking-[0.2em] mb-1">Instagram</span>
                                    <span className="text-sm md:text-base font-black text-white group-hover:text-warm transition-colors">{footer.instagram_handle}</span>
                                </div>
                             </a>
                        )}

                        <div className="flex items-center gap-5 group w-fit cursor-default">
                            <div className="w-12 md:w-14 h-12 md:h-14 bg-gray-500/10 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-white/10 transition-all duration-350 shadow-lg">
                                <i className="fas fa-map-marker-alt text-xl md:text-2xl" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] md:text-[12px] font-black text-white/30 tracking-[0.2em] mb-1">Location</span>
                                <span className="text-sm md:text-base font-black text-white">{footer.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-black/50 backdrop-blur-xl border-t border-white/5 py-10 md:py-14 animate-in fade-in duration-1000">
                <div className="max-w-[1400px] mx-auto px-6 md:px-14 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-14 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-14">
                        <p className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.3em] text-white/30">
                            {footer.copyright}
                        </p>
                        <span className="hidden md:block w-px h-6 bg-white/10" />
                        <div className="flex items-center gap-8 text-[11px] md:text-[12px] font-black uppercase tracking-[0.4em] text-white/20">
                            <span>Safe Payments</span>
                            <span>FSSAI Certified</span>
                        </div>
                    </div>

                    <a
                        href={footer.powered_by_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 group"
                    >
                        <span className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.5em] text-white/20 group-hover:text-white/40 transition-all">Powered By</span>
                        <span className="text-[11px] md:text-[12px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-warm transition-all flex items-center gap-3">
                            {footer.powered_by_text} <span className="w-12 h-px bg-current opacity-20 scale-x-50 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                        </span>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
