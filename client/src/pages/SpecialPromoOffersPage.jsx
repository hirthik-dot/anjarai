import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CollectionHero from '../components/CollectionHero';
import { useLang } from '../context/LanguageContext';

const SpecialPromoOffersPage = () => {
  const navigate = useNavigate();
  const { API } = useAuth();
  const { t } = useLang();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`${API}/offers`);
        const data = await res.json();
        if (!cancelled) setOffers(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError('Failed to load promo offers');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [API]);

  const activeOffers = useMemo(() => {
    return (offers || []).filter((o) => o && o.is_active !== false);
  }, [offers]);

  const usePromoCode = (code) => {
    if (!code) return;
    localStorage.setItem('tmc_promo_code', String(code).trim().toUpperCase());
    navigate('/checkout');
  };

  return (
    <div className="animate-in fade-in duration-700">
      <CollectionHero
        title="Special Promo Offers"
        subtitle="Use promo code during checkout to get instant discounts"
        breadcrumb={[{ name: 'Special Promo Offers', link: '/collections/special-promo-offers' }]}
      />

      <div className="max-w-[1400px] mx-auto py-16 md:py-24 px-6">
        {loading ? (
          <div className="text-center py-20 text-green font-black uppercase tracking-[0.3em] text-xs animate-pulse">
            {t('Loading...')}
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 font-black">{error}</div>
        ) : activeOffers.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
            <p className="text-3xl mb-4 text-green-600">
              <i className="fa-solid fa-ticket"></i>
            </p>
            <h3 className="text-xl font-bold text-dark mb-2">No promo offers available</h3>
            <p className="text-mid">Check back later for new codes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
            {activeOffers.map((offer) => (
              <div
                key={offer._id}
                className="bg-white rounded-[26px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-[200px] bg-green-pale/20">
                  {offer.image_url ? (
                    <img src={offer.image_url} alt={offer.title || 'Offer'} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-black">Offer</div>
                  )}
                  <div className="absolute top-4 left-4 bg-dark/85 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                    {(offer.code || '').toUpperCase() || 'NO CODE'}
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <h3 className="font-head text-xl font-bold text-brand-dark leading-tight line-clamp-2">
                    {offer.title || 'Offer'}
                  </h3>
                  {offer.subtitle && (
                    <p className="text-xs text-brand-mid opacity-70 font-bold mt-2 line-clamp-2">{offer.subtitle}</p>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <span className="bg-brand-sale/10 text-brand-sale text-[10px] font-black uppercase px-3 py-1 rounded-full">
                      {offer.discount || 'LIMITED TIME'}
                    </span>
                    <button
                      type="button"
                      onClick={() => usePromoCode(offer.code)}
                      className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-green hover:text-green/80"
                    >
                      Use code →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialPromoOffersPage;

