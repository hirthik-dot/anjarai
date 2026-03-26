import { create } from 'zustand';
import axios from 'axios';

const useSiteStore = create((set) => ({
    products: [],
    slides: [],
    content: {},
    loading: true,

    fetchInitialData: async () => {
        try {
            const [prodRes, slideRes, contentRes] = await Promise.all([
                axios.get('http://localhost:5000/api/products'),
                axios.get('http://localhost:5000/api/slider'),
                axios.get('http://localhost:5000/api/content'),
            ]);

            const contentMap = contentRes.data.data.reduce((acc, item) => {
                acc[item.key] = item.value;
                return acc;
            }, {});

            set({
                products: prodRes.data.data,
                slides: slideRes.data.data,
                content: contentMap,
                loading: false
            });
        } catch (error) {
            console.error('Failed to sync with mothers-care-backend');
            set({ loading: false });
        }
    },

    updateProduct: (updatedProduct) => set((state) => ({
        products: state.products.map(p => p._id === updatedProduct._id ? updatedProduct : p)
    })),

    addProduct: (product) => set((state) => ({
        products: [product, ...state.products]
    })),

    removeProduct: (productId) => set((state) => ({
        products: state.products.filter(p => p._id !== productId)
    })),

    updateSlides: (slides) => set({ slides }),
    updateContent: (content) => set((state) => ({
        content: { ...state.content, ...content }
    })),
}));

export default useSiteStore;
