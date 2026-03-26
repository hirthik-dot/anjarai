import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useSiteStore from '../store/siteStore';

const useSocketSync = () => {
    const { updateProduct, addProduct, removeProduct, updateSlides, updateContent } = useSiteStore();

    useEffect(() => {
        const socket = io('http://localhost:5000', {
            withCredentials: true,
        });

        socket.on('connect', () => {
            console.log('✅ Site Live Sync: Connected to Anjaraipetti Engine');
        });

        // Product Events
        socket.on('product:created', (product) => {
            console.log('⚡ Engine Sync: New Product Added', product.name);
            addProduct(product);
        });

        socket.on('product:updated', (product) => {
            console.log('⚡ Engine Sync: Product Updated', product.name);
            updateProduct(product);
        });

        socket.on('product:deleted', (productId) => {
            console.log('⚡ Engine Sync: Product Removed', productId);
            removeProduct(productId);
        });

        // Slider Events
        socket.on('slider:updated', (slides) => {
            console.log('⚡ Engine Sync: Hero Slider Patched');
            updateSlides(slides);
        });

        // Content Events
        socket.on('content:updated', (data) => {
            console.log('⚡ Engine Sync: Global Content Patched');
            updateContent({ [data.key]: data.value });
        });

        return () => {
            socket.disconnect();
        };
    }, []);
};

export default useSocketSync;
