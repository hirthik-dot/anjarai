/**
 * Expanded Static Fallback Data
 * Covers all website sections to prevent "undefined[0]" crashes.
 */

export const FALLBACK_DATA = {
  products: [],
  heroSlides: [],
  announcements: [],
  tagline: { text: "Premium Homemade Spices & Masalas" },
  trustItems: [],
  marqueeItems: [],
  categories: [],
  about: { title: "About Anjaraipetti", content: "Traditional recipes for the modern kitchen." },
  ads: [],
  closingBanner: { title: "Love our products?", btn_text: "Shop Now" },
  videos: [],
  footer: { contact: { email: "support@anjaraipetti.com" } },
  navbar: { links: [] }
};

export const CACHE_KEYS = {
  ALL_CONTENT: "anj_cache_all_v1",
  LAST_FETCH: "anj_cache_timestamp"
};

export const CACHE_EXPIRY = 2 * 60 * 1000; // 2 minutes (optimized for real-time)
