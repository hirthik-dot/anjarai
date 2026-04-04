import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { io } from 'socket.io-client';

const OffersCarousel = ({ showHeader = true } = {}) => {
  const navigate = useNavigate();
  const { API } = useAuth();
  const { t } = useLang();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollerRef = useRef(null);

  const loadOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API}/offers`);
      const data = await res.json();
      setOffers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('Failed to load offers');
    } finally {
      setLoading(false);
    }
  }, [API]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  useEffect(() => {
    // Subscribe to promo changes from admin panel for instant home updates.
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
    const socket = io(socketUrl, {
      transports: ['polling'],
      upgrade: false,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000
    });

    const onOffersChanged = () => loadOffers();

    socket.on('connect', () => { /* no-op */ });
    socket.on('offers:created', onOffersChanged);
    socket.on('offers:updated', onOffersChanged);
    socket.on('offers:deleted', onOffersChanged);
    socket.on('offers:reordered', onOffersChanged);

    return () => {
      socket.off('offers:created', onOffersChanged);
      socket.off('offers:updated', onOffersChanged);
      socket.off('offers:deleted', onOffersChanged);
      socket.off('offers:reordered', onOffersChanged);
      socket.disconnect();
    };
  }, [loadOffers]);

  const activeOffers = useMemo(() => {
    // Backend already returns is_active offers, but keep it defensive.
    return (offers || []).filter((o) => o && o.is_active !== false);
  }, [offers]);

  useEffect(() => {
    if (activeOffers.length <= 1) return;
    const el = scrollerRef.current;
    if (!el) return;

    let timer = null;
    timer = setInterval(() => {
      // Gentle auto-scroll like a promo carousel.
      el.scrollBy({ left: 420, behavior: 'smooth' });
    }, 5000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeOffers.length]);

  const scrollByCard = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 420, behavior: 'smooth' });
  };

  const goToOffer = (offer) => {
    // Always open the dedicated promo page (admins should not worry about URLs).
    navigate('/collections/special-promo-offers');
  };

  return (
    <section className="max-w-[1400px] mx-auto px-6 pb-4">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          {showHeader && (
            <>
              <h2 className="font-head text-3xl md:text-5xl font-black text-dark tracking-tight">
                {t('Mega')} <span className="text-sale italic underline decoration-sale/10">{t('Combo')}</span>{' '}
                {t('Offers')}
              </h2>
              <p className="text-mid text-sm md:text-base font-medium opacity-70 mt-2">
                {t('Save extra with our specially curated bundles')}
              </p>
            </>
          )}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            className="w-12 h-12 rounded-2xl bg-white border border-gray-100 hover:bg-green-pale/30 hover:border-green/20 transition-all shadow-sm"
            aria-label="Scroll offers left"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            className="w-12 h-12 rounded-2xl bg-white border border-gray-100 hover:bg-green-pale/30 hover:border-green/20 transition-all shadow-sm"
            aria-label="Scroll offers right"
          >
            ›
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-2"
          style={{ paddingBottom: 8 }}
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-[280px] sm:w-[300px] shrink-0 bg-white rounded-[26px] border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="h-[140px] bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-4 bg-gray-100 rounded-full w-1/2" />
                  <div className="h-8 bg-gray-100 rounded-xl w-2/3" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="w-full text-center py-14 text-brand-mid font-bold italic">{error}</div>
          ) : activeOffers.length === 0 ? (
            <div className="w-full text-center py-14 text-brand-mid font-bold italic">No offers available</div>
          ) : (
            activeOffers.map((offer) => (
              <button
                key={offer._id}
                type="button"
                onClick={() => goToOffer(offer)}
                className="shrink-0 snap-start w-[280px] sm:w-[300px] text-left border border-gray-100 bg-white rounded-[26px] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-[150px] bg-green-pale/20 overflow-hidden">
                  {offer.image_url ? (
                    <img
                      src={offer.image_url}
                      alt={offer.title || 'Offer'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-black">Offer</div>
                  )}

                  <div className="absolute top-4 left-4 bg-dark/85 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                    {(offer.code || '').toUpperCase() || 'NO CODE'}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-head text-xl font-bold text-brand-dark leading-tight line-clamp-2">
                    {offer.title || 'Offer'}
                  </h3>
                  {offer.subtitle && (
                    <p className="text-xs text-brand-mid opacity-70 font-bold mt-2 line-clamp-2">{offer.subtitle}</p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <span className="bg-brand-sale/10 text-brand-sale text-[10px] font-black uppercase px-3 py-1 rounded-full">
                      {offer.discount || 'LIMITED TIME'}
                    </span>
                    <span className="text-[10px] font-black text-green uppercase tracking-widest">
                      Shop →
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Edge fades */}
        {!loading && activeOffers.length > 0 && (
          <>
            <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-white to-transparent z-10" />
          </>
        )}
      </div>

      {/* Mobile scroll indicator */}
      {!loading && activeOffers.length > 0 && (
        <div className="md:hidden flex items-center justify-center gap-2 mt-2 text-[10px] text-gray-400 uppercase tracking-widest font-black opacity-80">
          <span className="animate-pulse">Swipe to explore</span>
          <i className="fas fa-arrow-right animate-pulse"></i>
        </div>
      )}
    </section>
  );
};

export default OffersCarousel;

