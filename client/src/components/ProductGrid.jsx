import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products = [] }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 px-3 md:px-0 w-full max-w-6xl mx-auto">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
