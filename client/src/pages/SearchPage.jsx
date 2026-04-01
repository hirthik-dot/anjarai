import React, { useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import ProductGrid from '../components/ProductGrid';
import { useLang } from '../context/LanguageContext';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { products } = useData();
    const { t } = useLang();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [query]);

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
                <div className="mb-8">
                    <h1 className="text-xl sm:text-3xl font-bold text-dark mb-2">
                        {filteredProducts.length > 0 ? t('Results for') : t('Search Results for')} "{query}"
                    </h1>
                    <p className="text-sm text-gray-500 font-medium tracking-wide">
                        Check each product page for other buying options.
                    </p>
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
