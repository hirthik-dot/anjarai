import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { FALLBACK_DATA, CACHE_KEYS } from './DataConstants';
import { io } from 'socket.io-client';

const DataContext = createContext(null);

const fetchWithTimeout = (url, options = {}, timeoutMs) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal })
    .then(r => { clearTimeout(id); return r; })
    .catch(e => { clearTimeout(id); throw e; });
};

export const DataProvider = ({ children }) => {
  const [content, setContent] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEYS.ALL_CONTENT);
      return cached ? JSON.parse(cached) : FALLBACK_DATA;
    } catch { return FALLBACK_DATA; }
  });
  const [loading, setLoading] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false);
  const retryRef = useRef(null);
  
  const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
  const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl.replace(/\/api$/, '') : rawApiUrl.replace(/\/$/, '');

  const fetchContent = useCallback(async (attempt = 1) => {
    const MAX = 4;
    const timeout = 12000 + (attempt - 1) * 6000; // 12s, 18s, 24s, 30s
    try {
      const res = await fetchWithTimeout(`${API_URL}/api/all-content`, { cache: 'no-store' }, timeout);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const fresh = await res.json();
      if (fresh && typeof fresh === 'object') {
        const merged = { ...FALLBACK_DATA, ...fresh };
        
        // Auto-patch incorrectly mapped "All" links from DB
        if (merged.navbar && merged.navbar.nav_links) {
          merged.navbar.nav_links = merged.navbar.nav_links.map(link => {
            if (link.label?.toLowerCase() === 'all' && link.link === '/collections/offers') {
              return { ...link, link: '/collections/all' };
            }
            return link;
          });
        }

        setContent(merged);
        try {
          localStorage.setItem(CACHE_KEYS.ALL_CONTENT, JSON.stringify(merged));
          localStorage.setItem(CACHE_KEYS.LAST_FETCH, Date.now().toString());
        } catch { }
        return true;
      }
    } catch (err) {
      if (attempt < MAX) {
        const delay = [4000, 8000, 14000][attempt - 1] || 8000;
        retryRef.current = setTimeout(() => fetchContent(attempt + 1), delay);
      }
    }
    return false;
  }, [API_URL]);

  const refreshContent = useCallback(async (force = false) => {
    const lastFetch = localStorage.getItem(CACHE_KEYS.LAST_FETCH);
    if (!force && lastFetch && Date.now() - parseInt(lastFetch) < 120000) return; // 2 mins cache
    setLoading(true);
    setIsWakingUp(true);
    // Wake the backend first
    fetch(API_URL + '/api/health', { method: 'HEAD' }).catch(() => {});
    await fetchContent(1);
    setLoading(false);
    setIsWakingUp(false);
  }, [fetchContent, API_URL]);

  useEffect(() => {
    refreshContent();
    return () => { if (retryRef.current) clearTimeout(retryRef.current); };
  }, [refreshContent]);

  // REAL-TIME ENGINE
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';
    const socket = io(socketUrl, {
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
      transports: ['websocket', 'polling'],
      timeout: 10000
    });

    const triggerRefresh = (event) => {
      console.log(`[REAL-TIME SYNC] ${event} detected. Refetching...`);
      refreshContent(true);
    };

    socket.on('connect', () => console.log('📡 Engine Live: Socket Connected'));
    // Gracefully handle connection errors (e.g. mobile / offline)
    socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error — will retry:', err.message);
    });
    socket.on('reconnect_failed', () => {
      console.warn('[Socket] All reconnection attempts failed — using cached data');
    });
    
    const events = [
      'product:created', 'product:deleted',
      'hero:created', 'hero:updated', 'hero:deleted', 'hero:reordered',
      'navbar:updated', 'tagline:updated', 'closingbanner:updated', 
      'footer:updated', 'announcement:updated', 'marquee:updated',
      'categories:updated', 'ads:updated', 'videos:updated'
    ];

    events.forEach(ev => socket.on(ev, () => triggerRefresh(ev)));

    // Handle product stock updates in-place
    socket.on('product:updated', (payload) => {
      // payload: { productId, stock, stock_total, stock_by_variant }
      console.log('[REAL-TIME SYNC] product:updated detected for in-place update:', payload);
      
      // Update the main content state if the product exists
      setContent(prev => {
        if (!prev || !prev.products) return prev;
        return {
          ...prev,
          products: prev.products.map(p => {
            if (p._id === payload.productId || String(p._id) === String(payload.productId)) {
              return { 
                ...p, 
                stock: payload.stock,
                stock_total: payload.stock_total !== undefined ? payload.stock_total : payload.stock,
                stock_by_variant: payload.stock_by_variant || p.stock_by_variant
              };
            }
            return p;
          })
        };
      });
    });

    return () => socket.disconnect();
  }, [refreshContent]);

  const getByCollection = useCallback((rawSlug) => {
    // Legacy slug normalization mapping
    let slug = rawSlug;
    if (slug === 'best-sellers') slug = 'best-seller';
    if (slug === 'combo-offers' || slug === 'mega-combo-offers') slug = 'combo-packs';
    if (slug === 'organic') slug = 'organic-masalas';

    const products = content.products || [];
    if (slug === 'all' || !slug) return products;
    return products.filter(p =>
      p.category?.toLowerCase() === slug?.toLowerCase() ||
      (p.collections && Array.isArray(p.collections) && p.collections.includes(slug))
    );
  }, [content.products]);

  const getBySlug = useCallback((slug) => {
    return (content.products || []).find(p => p.slug === slug);
  }, [content.products]);

  const value = useMemo(() => ({
    ...content, loading, isWakingUp,
    refetch: () => refreshContent(true),
    getByCollection, getBySlug,
  }), [content, loading, isWakingUp, refreshContent, getByCollection, getBySlug]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};
