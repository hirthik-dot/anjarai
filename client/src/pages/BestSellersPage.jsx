import React, { useState, useMemo } from 'react';
import CollectionHero from '../components/CollectionHero';
import SortToolbar from '../components/SortToolbar';
import ProductGrid from '../components/ProductGrid';
import { useData } from '../context/DataContext';

const BestSellersPage = () => {
    const { getByCollection } = useData();
    const [sort, setSort] = useState('best-selling');
    const products = useMemo(() => {
        let list = [...getByCollection('best-sellers')];
        if (sort === 'price-low-high') return list.sort((a, b) => a.price - b.price);
        if (sort === 'price-high-low') return list.sort((a, b) => b.price - a.price);
        return list;
    }, [sort, getByCollection]);

    return (
        <div className="animate-in fade-in duration-1000">
            <CollectionHero
                title="Best Sellers"
                subtitle="Our most loved products by mothers across India"
                breadcrumb={[{ name: "Best Sellers", link: "/collections/best-sellers" }]}
            />
            <SortToolbar count={products.length} onSort={setSort} />
            <div className="max-w-[1400px] mx-auto py-16 md:py-24 px-6 gap-y-16">
                <ProductGrid products={products} />
            </div>
        </div>
    );
};

export default BestSellersPage;
