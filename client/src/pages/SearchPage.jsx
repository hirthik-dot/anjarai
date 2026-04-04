import React, { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import ProductGrid from '../components/ProductGrid';
import { useLang } from '../context/LanguageContext';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { products } = useData();
    const { t } = useLang();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const filteredProducts = useMemo(() => {
        if (!query.trim() || !products) return [];
        const lowerQuery = query.toLowerCase();
        return products.filter((p) => {
            return (
                (p.name && p.name.toLowerCase().includes(lowerQuery)) ||
                (p.category && p.category.toLowerCase().includes(lowerQuery)) ||
                (p.description && p.description.toLowerCase().includes(lowerQuery)) ||
                (p.type && p.type.toLowerCase().includes(lowerQuery))
            );
        });
    }, [query, products]);

    return (
        <div className="bg-white min-h-[60vh] py-10 sm:py-20 animate-in fade-in duration-700">
            <div className="flex flex-col max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-14">
                <div className="mb-10 max-w-2xl mx-auto w-full text-center">
                    <h1 className="text-2xl sm:text-4xl font-black text-dark mb-4 tracking-tight">
                        {t('Search Products')}
                    </h1>
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <i className="fa-solid fa-search text-gray-400"></i>
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setSearchParams({ q: e.target.value }, { replace: true })}
                            autoFocus
                            placeholder={t('Type to search for spices, masalas, or more...')}
                            className="w-full bg-gray-50 border-2 border-gray-200 outline-none focus:border-green focus:ring-4 focus:ring-green/10 rounded-2xl py-4 pl-12 pr-4 text-base font-bold text-dark transition-all placeholder:font-medium placeholder:opacity-50"
                        />
                        {query && (
                            <button 
                                onClick={() => setSearchParams({}, { replace: true })} 
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-dark transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                </svg>
                            </button>
                        )}
                    </div>
                    {query && (
                        <p className="text-sm text-gray-500 font-medium tracking-wide mt-4">
                            {filteredProducts.length > 0 ? t('Results for') : t('No results for')} "{query}" • {filteredProducts.length} items
                        </p>
                    )}
                </div>

                {filteredProducts.length > 0 ? (
                    <ProductGrid products={filteredProducts} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-xl border border-gray-100 p-8 text-center text-dark/40 shadow-sm mt-4">
                        <i className="fa-solid fa-search text-5xl mb-6 opacity-30 text-gray-400"></i>
                        <h2 className="text-xl sm:text-2xl font-bold mb-2 opacity-80">{t('No products found')}</h2>
                        <p className="opacity-60 text-sm max-w-sm mx-auto">{t('Try adjusting your search terms or browse our categories.')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;
