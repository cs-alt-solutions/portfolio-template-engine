/* src/components/portfolio/content-engine/shared/CapabilityActionModals.tsx */
'use client';

import React, { useMemo } from 'react';
import { Capability, CapabilityOperationalTerm, GalleryItem } from '../types';
import { CAPABILITY_DEFAULTS } from '@/utils/glossary';
import HubDetailsModal from '../layouts/hub/HubDetailsModal';
import UniversalLeadModal from '../../UniversalLeadModal';
import {
  buildCapabilityTopicConfigs,
  getCapabilityPhotos,
  getCapabilityTerms,
} from './capabilityHelpers';

interface CapabilityActionModalsProps {
  capabilities: Capability[];
  alaCarte?: Capability[];
  galleryItems?: GalleryItem[];
  operationalTerms?: CapabilityOperationalTerm[];
  detailsCapability: Capability | null;
  initialCollection?: string | null;
  bookingCapability: Capability | null;
  onCloseDetails: () => void;
  onCloseBooking: () => void;
  onSwitchDetailsToBooking: (cap: Capability) => void;
  themeStyle: string;
  brandColor: string;
  isLightMode: boolean;
  fonts: { heading: string; body: string };
  businessName?: string;
  storefrontSlug?: string;
  contactEmail?: string;
  ctaPrefix?: string;
}

export default function CapabilityActionModals({
  capabilities,
  alaCarte = [],
  galleryItems = [],
  operationalTerms = [],
  detailsCapability,
  initialCollection = null,
  bookingCapability,
  onCloseDetails,
  onCloseBooking,
  onSwitchDetailsToBooking,
  themeStyle,
  brandColor,
  isLightMode,
  fonts,
  businessName,
  storefrontSlug,
  contactEmail,
  ctaPrefix = '',
}: CapabilityActionModalsProps) {
  const topicConfigs = useMemo(
    () => buildCapabilityTopicConfigs(capabilities, alaCarte),
    [capabilities, alaCarte]
  );

  const detailsPhotos = useMemo(
    () => (detailsCapability ? getCapabilityPhotos(detailsCapability.title, galleryItems) : []),
    [detailsCapability, galleryItems]
  );

  const detailsTerms = useMemo(
    () => (detailsCapability ? getCapabilityTerms(detailsCapability.title, operationalTerms) : []),
    [detailsCapability, operationalTerms]
  );

  const activeBookingTitle = bookingCapability?.title || '';
  const bookingTopicConfig = activeBookingTitle ? topicConfigs[activeBookingTitle] : undefined;

  const orderedInquiryTopics = useMemo(() => {
    const allTitles = capabilities
      .filter((c) => c && !c.isAlaCarte && c.title?.trim())
      .map((c) => c.title.trim());

    if (!activeBookingTitle) {
      return allTitles.length > 0 ? allTitles : [CAPABILITY_DEFAULTS.DIRECT_INQUIRY_OPTION];
    }

    return [activeBookingTitle, ...allTitles.filter((t) => t !== activeBookingTitle)];
  }, [capabilities, activeBookingTitle]);

  const modalCtaLabel = bookingCapability?.ctaLabel?.trim()
    ? bookingCapability.ctaLabel.trim()
    : `${ctaPrefix} ${activeBookingTitle}`.trim() || CAPABILITY_DEFAULTS.INQUIRE_BTN;

  const showTimeframe = bookingCapability?.timeframeMode
    ? bookingCapability.timeframeMode !== 'off'
    : bookingCapability?.askTimeframe === true;

  const allowSpecificDate = bookingCapability?.timeframeMode
    ? bookingCapability.timeframeMode === 'calendar'
    : true;

  return (
    <>
      {detailsCapability && (
        <HubDetailsModal
          isOpen={true}
          onClose={onCloseDetails}
          onInquire={() => onSwitchDetailsToBooking(detailsCapability)}
          department={detailsCapability}
          photos={detailsPhotos}
          terms={detailsTerms}
          initialCollection={initialCollection}
          isLightMode={isLightMode}
          isLightBrand={false}
          themeStyle={themeStyle}
          fonts={fonts}
        />
      )}

      <UniversalLeadModal
        key={activeBookingTitle || 'closed'}
        isOpen={!!bookingCapability}
        onClose={onCloseBooking}
        ctaLabel={modalCtaLabel}
        inquiryOptions={orderedInquiryTopics}
        addonOptions={bookingTopicConfig?.addons || []}
        addonSelectionMode={bookingCapability?.addonSelectionMode || 'multiple'}
        showTimeframeFields={showTimeframe}
        allowSpecificDate={allowSpecificDate}
        topicConfigs={topicConfigs}
        businessName={businessName || CAPABILITY_DEFAULTS.DEFAULT_BUSINESS_NAME}
        storefrontSlug={storefrontSlug || CAPABILITY_DEFAULTS.DEFAULT_SLUG}
        contactEmail={contactEmail || ''}
        brandColor={brandColor}
        isLightMode={isLightMode}
        themeStyle={themeStyle}
      />
    </>
  );
}