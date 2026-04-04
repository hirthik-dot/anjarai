import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products = [], horizontal = false }) => {
    if (horizontal) {
        return (
            <div className="relative w-full">
                <div className="flex overflow-x-auto gap-4 lg:gap-6 px-3 md:px-0 w-full max-w-[1400px] mx-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                    {products.map((product) => (
                        <div key={product.id} className="w-[calc(100vw-24px)] sm:w-[45vw] lg:w-[300px] xl:w-[320px] snap-center sm:snap-start flex-shrink-0">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
                {/* Mobile scroll indicator */}
                <div className="md:hidden flex items-center justify-center gap-2 mt-2 pb-2 text-[10px] text-gray-400 uppercase tracking-widest font-black opacity-80">
                    <span className="animate-pulse">Swipe to explore</span>
                    <i className="fas fa-arrow-right animate-pulse"></i>
                </div>
                {/* Edge fade */}
                <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-white to-transparent z-10" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 px-3 md:px-0 w-full max-w-6xl mx-auto">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
