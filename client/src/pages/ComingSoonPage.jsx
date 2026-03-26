import React from 'react';
import CollectionHero from '../components/CollectionHero';
import ComingSoon from '../components/ComingSoon';

const ComingSoonPage = () => {
    return (
        <div className="animate-in fade-in duration-1000">
            <CollectionHero
                title="Coming Soon"
                subtitle="We're crafting something special for you"
                breadcrumb={[{ name: "Coming Soon", link: "#" }]}
            />
            <ComingSoon />
        </div>
    );
};

export default ComingSoonPage;
