import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import CollectionHero from '../components/CollectionHero';
import SortToolbar from '../components/SortToolbar';
import ProductGrid from '../components/ProductGrid';
import { useData } from '../context/DataContext';

const CollectionPage = () => {
    const { slug } = useParams();
    const { getByCollection, loading } = useData();
    const [sort, setSort] = useState('featured');

    const products = useMemo(() => {
        // Special case for 'all' or defined slug
        const colKey = slug === 'all' ? 'all' : slug;
        let list = [...getByCollection(colKey)];
        
        if (sort === 'price-low-high') return list.sort((a, b) => a.price - b.price);
        if (sort === 'price-high-low') return list.sort((a, b) => b.price - a.price);
        if (sort === 'best-selling') return list.sort((a, b) => b.reviews - a.reviews);
        return list;
    }, [slug, sort, getByCollection]);

    // Format title from slug: best-seller -> Best Seller
    const title = slug === 'all' ? 'All Products' : slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    if (loading) return <div className="min-h-screen flex items-center justify-center text-green font-black animate-pulse uppercase tracking-[0.3em]">Loading {title}...</div>;

    return (
        <div className="animate-in fade-in duration-1000">
            <CollectionHero
                title={title}
                subtitle={`Explore our handpicked range of ${title.toLowerCase()}`}
                breadcrumb={[{ name: title, link: `/collections/${slug}` }]}
            />
            <SortToolbar count={products.length} onSort={setSort} />

            <div className="max-w-[1400px] mx-auto py-16 md:py-24 px-6 min-h-[40vh]">
                {products.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                        <p className="text-3xl mb-4">🌿</p>
                        <h3 className="text-xl font-bold text-dark mb-2">No products found</h3>
                        <p className="text-mid">We are currently updating our {title} collection. Check back soon!</p>
                    </div>
                ) : (
                    <ProductGrid products={products} />
                )}
            </div>
        </div>
    );
};

export default CollectionPage;
