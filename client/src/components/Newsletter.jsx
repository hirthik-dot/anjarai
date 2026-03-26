import React, { useState } from 'react';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setTimeout(() => {
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus(null), 3000);
        }, 1500);
    };

    return (
        <div className="bg-green-pale/50 py-16 sm:py-24 md:py-36 relative overflow-hidden text-center group">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-green/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 group-hover:bg-green/10 transition-colors duration-1000" />
            <div className="absolute bottom-0 right-0 w-64 sm:w-[500px] h-64 sm:h-[500px] bg-warm/5 rounded-full blur-[80px] sm:blur-[120px] translate-x-1/3 translate-y-1/3 group-hover:bg-warm/10 transition-colors duration-1000" />

            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 relative z-10 animate-in zoom-in duration-700">
                <span className="inline-block bg-green text-white text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] rounded-full px-5 sm:px-6 py-2 sm:py-2.5 mb-6 sm:mb-10 shadow-lg sm:shadow-2xl shadow-green/10 group-hover:-translate-y-1 transition-transform">
                    Our Community
                </span>
                <h2 className="font-head text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-dark mb-4 sm:mb-6 tracking-tight px-2">
                    Join The <span className="text-green underline underline-offset-4 sm:underline-offset-8 decoration-green-pale/20">Anjaraipetti</span> Care Family
                </h2>
                <p className="text-mid text-xs sm:text-sm md:text-lg max-w-[500px] mx-auto leading-relaxed font-semibold opacity-80 mb-8 sm:mb-14 drop-shadow-sm px-4">
                    Be the first to know about new organic collections, parenting tips, and exclusive offers. No spam, just pure goodness.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-5 w-full max-w-[600px] mx-auto group/form px-2 sm:px-0"
                >
                    <div className="relative w-full">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            required
                            className="w-full bg-white border-2 border-green-pale/50 rounded-full px-6 sm:px-8 py-4 sm:py-5 md:py-6 text-sm md:text-base font-bold outline-none transition-all focus:border-green focus:shadow-xl sm:focus:shadow-2xl focus:shadow-green/10 placeholder:text-gray-300 placeholder:font-black placeholder:uppercase placeholder:tracking-[0.1em] sm:placeholder:tracking-widest"
                        />
                        <span className="absolute right-6 sm:right-8 top-1/2 -translate-y-1/2 text-lg sm:text-xl opacity-20 filter grayscale">📧</span>
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className={`w-full sm:w-auto bg-green text-white rounded-full px-8 sm:px-12 md:px-16 py-4 sm:py-5 md:py-6 font-black text-[11px] sm:text-xs md:text-sm uppercase tracking-[0.2em] shadow-xl sm:shadow-2xl shadow-green/20 hover:bg-warm hover:shadow-warm/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group/btn shrink-0 ${status === 'loading' && 'pointer-events-none'}`}
                    >
                        {status === 'loading' ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-3.5 sm:w-4 h-3.5 sm:h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                                Subscribing
                            </span>
                        ) : status === 'success' ? (
                            <span className="flex items-center justify-center gap-2 animate-in fade-in zoom-in">
                                ✓ Sent!
                            </span>
                        ) : (
                            'Subscribe Now →'
                        )}
                    </button>
                </form>

                <p className="mt-10 sm:mt-14 text-[8px] sm:text-[10px] md:text-[11px] font-black uppercase text-mid/40 tracking-[0.2em] sm:tracking-[0.3em] flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-4">
                    <span className="hidden sm:inline-block w-6 sm:w-10 md:w-14 h-px bg-current opacity-10" /> Safe & Secure <span className="w-4 sm:w-10 md:w-14 h-px bg-current opacity-10" /> No Spam Ever <span className="w-4 sm:w-10 md:w-14 h-px bg-current opacity-10" /> Unsubscribe Anytime
                </p>
            </div>
        </div>
    );
};

export default Newsletter;
