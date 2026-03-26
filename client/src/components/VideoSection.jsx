import React from 'react';
import { useData } from '../context/DataContext';
import { getYouTubeThumbnail } from '../utils/helpers';

const VideoSection = () => {
    const { videos } = useData();
    const active = (Array.isArray(videos) ? videos : []).filter(v => v.is_active !== false);

    if (active.length === 0) return null;
    return (
        <div className="bg-dark/95 py-16 sm:py-24 md:py-36 relative overflow-hidden">
            {/* Decorative Blur Backgrounds */}
            <div className="absolute top-0 right-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-green/10 rounded-full blur-[80px] sm:blur-[120px] mix-blend-screen" />
            <div className="absolute bottom-0 left-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-warm/10 rounded-full blur-[60px] sm:blur-[100px] mix-blend-screen" />

            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-14 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-10 mb-10 sm:mb-16 md:mb-24 animate-in slide-in-from-bottom duration-1000">
                    <div className="max-w-[650px]">
                        <span className="text-warm text-[10px] sm:text-[12px] md:text-[14px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                            <span className="w-6 sm:w-8 h-px bg-warm" /> Our Process
                        </span>
                        <h2 className="font-head text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] sm:leading-[1.15] mb-4 sm:mb-6 md:mb-8">
                            Watch How We Craft <br className="hidden sm:block" /> The <span className="text-green underline underline-offset-[8px] sm:underline-offset-[12px] md:underline-offset-[16px] decoration-white/20">Purest</span> Baby Food
                        </h2>
                        <p className="text-white/60 text-sm sm:text-base md:text-lg leading-[1.6] sm:leading-[1.8] font-medium pr-4 sm:pr-0">
                            Transparency is at the heart of everything we do. See our preparation process, ingredients, and the love that goes into every batch.
                        </p>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end gap-3 sm:gap-0 text-white/40 text-[9px] sm:text-[11px] md:text-[13px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] md:text-right mt-4 md:mt-0">
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white/20 md:hidden block"></span>Verified Process</span>
                        <span className="hidden sm:inline-block md:hidden mx-2">•</span>
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white/20 md:hidden block"></span>100% Organic Recipes</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-14">
                    {active.map((video, index) => (
                        <div
                            key={video._id || index}
                            onClick={() => window.open(video.youtube_url, '_blank')}
                            className="group relative rounded-2xl sm:rounded-[28px] md:rounded-[40px] overflow-hidden aspect-video sm:aspect-square md:h-[400px] shadow-2xl sm:shadow-3xl shadow-black/40 ring-1 ring-white/10 hover:-translate-y-2 sm:hover:-translate-y-3 transition-all duration-500 cursor-pointer"
                        >
                            <img
                                src={getYouTubeThumbnail(video.youtube_url)}
                                alt={video.title}
                                className="w-full h-full object-cover group-hover:scale-110 filter brightness-[.85] transition-transform duration-1000"
                            />

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <div className="w-16 sm:w-20 md:w-28 h-16 sm:h-20 md:h-28 rounded-full bg-white/10 backdrop-blur-xl border-2 border-white/20 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 group-hover:bg-green group-hover:border-green group-hover:shadow-[0_0_50px_rgba(45,106,79,.6)] relative">
                                    <div className="absolute inset-0 rounded-full border border-white/40 animate-ping group-hover:hidden" />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 sm:h-8 md:h-12 w-6 sm:w-8 md:w-12 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Labels */}
                            <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 md:bottom-12 md:left-12 max-w-[calc(100%-48px)] sm:max-w-[calc(100%-80px)]">
                                <span className="inline-block bg-warm/90 backdrop-blur text-white text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-2 sm:mb-4 group-hover:-translate-y-1 transition-all duration-300">
                                    Official Video
                                </span>
                                <h3 className="text-sm sm:text-lg md:text-2xl font-black text-white drop-shadow-lg group-hover:text-warm transition-colors duration-300 leading-tight uppercase line-clamp-2">
                                    {video.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VideoSection;
