import React, { useState, useMemo } from 'react';
import CollectionHero from '../components/CollectionHero';
import SortToolbar from '../components/SortToolbar';
import ProductGrid from '../components/ProductGrid';
import { useData } from '../context/DataContext';

const ComboPacksPage = () => {
    const { getByCollection } = useData();
    const [sort, setSort] = useState('featured');
    const products = useMemo(() => {
        let list = [...getByCollection('mega-combo-offers')];
        if (sort === 'price-low-high') return list.sort((a, b) => a.price - b.price);
        if (sort === 'price-high-low') return list.sort((a, b) => b.price - a.price);
        return list;
    }, [sort, getByCollection]);

    return (
        <div className="animate-in fade-in duration-1000">
            <CollectionHero
                title="Mega Combo Offers"
                subtitle="Save more with our specially curated bundles"
                breadcrumb={[{ name: "Mega Combo Offers", link: "/collections/mega-combo-offers" }]}
            />
            <SortToolbar count={products.length} onSort={setSort} />
            <div className="max-w-[1400px] mx-auto py-16 md:py-24 px-6 gap-y-16">
                <ProductGrid products={products} />
            </div>
        </div>
    );
};

export default ComboPacksPage;
