import React, { useState, useMemo } from 'react';
import CollectionHero from '../components/CollectionHero';
import SortToolbar from '../components/SortToolbar';
import ProductGrid from '../components/ProductGrid';
import { useData } from '../context/DataContext';

const AllProductsPage = () => {
    const { getByCollection } = useData();
    const [sort, setSort] = useState('featured');
    const products = useMemo(() => {
        let list = [...getByCollection('all')];
        if (sort === 'price-low-high') return list.sort((a, b) => a.price - b.price);
        if (sort === 'price-high-low') return list.sort((a, b) => b.price - a.price);
        if (sort === 'best-selling') return list.sort((a, b) => b.reviews - a.reviews);
        return list;
    }, [sort]);

    return (
        <div className="animate-in fade-in duration-1000">
            <CollectionHero
                title="All Products"
                subtitle="Complete range of natural baby nutrition and wholesome treats"
                breadcrumb={[{ name: "Products", link: "/collections/all" }]}
            />
            <SortToolbar count={products.length} onSort={setSort} />

            <div className="max-w-[1400px] mx-auto py-16 md:py-24 px-6">
                <ProductGrid products={products} />
            </div>
        </div>
    );
};

export default AllProductsPage;
