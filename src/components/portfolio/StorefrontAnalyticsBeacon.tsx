/* src/components/portfolio/StorefrontAnalyticsBeacon.tsx */
'use client';

import { useEffect } from 'react';
import { supabase } from '@/utils/supabase';

interface BeaconProps {
  storefrontId: string;
  slug: string;
  isCanvasMode?: boolean;
  isAuditMode?: boolean;
}

export default function StorefrontAnalyticsBeacon({
  storefrontId,
  slug,
  isCanvasMode = false,
  isAuditMode = false
}: BeaconProps) {
  useEffect(() => {
    // Never count admin canvas previews or staging audit reviews as customer traffic
    if (!storefrontId || isCanvasMode || isAuditMode) return;
    if (typeof window === 'undefined') return;

    // Prevent double-counting on accidental page refreshes within the same session
    const sessionKey = `as_viewed_${storefrontId}`;
    if (sessionStorage.getItem(sessionKey)) return;
    sessionStorage.setItem(sessionKey, '1');

    // Generate or retrieve an anonymous visitor ID for Unique Visitor counting
    let visitorHash = localStorage.getItem('as_visitor_hash');
    if (!visitorHash) {
      visitorHash = `v_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
      localStorage.setItem('as_visitor_hash', visitorHash);
    }

    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const deviceType = isMobile ? 'mobile' : 'desktop';
    const referrer = document.referrer || 'Direct';

    supabase
      .from('storefront_analytics')
      .insert([
        {
          storefront_id: storefrontId,
          slug,
          visitor_hash: visitorHash,
          referrer,
          device_type: deviceType
        }
      ])
      .then(({ error }) => {
        if (error) console.error('Analytics beacon error:', error.message);
      });
  }, [storefrontId, slug, isCanvasMode, isAuditMode]);

  return null;
}