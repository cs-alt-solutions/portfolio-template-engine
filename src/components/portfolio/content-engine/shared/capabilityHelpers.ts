/* src/components/portfolio/content-engine/shared/capabilityHelpers.ts */
import { Capability, CapabilityOperationalTerm, GalleryItem } from '../types';
import { CAPABILITY_DEFAULTS } from '@/utils/glossary';
import { OperationalTerm } from '../layouts/hub/PolicyCard';
import { HubCollectionPhoto, normalizeExternalUrl } from '../layouts/hub/hubCollections';
import { TopicConfig } from '../../lead-modal/leadModalStyles';

export function getCapabilityPhotos(
  capabilityTitle: string,
  galleryItems: GalleryItem[] = []
): HubCollectionPhoto[] {
  const target = (capabilityTitle || '').trim().toLowerCase();
  if (!target) return [];

  return galleryItems
    .filter(
      (item) =>
        item &&
        item.imageUrl &&
        item.isVisible !== false &&
        (item.category || '').trim().toLowerCase() === target
    )
    .map((item) => ({
      url: item.imageUrl,
      title: item.title,
      description: item.description,
      collection: item.collection,
      focalPoint: item.focalPoint,
      imageFit: item.imageFit,
      imageZoom: item.imageZoom,
    }));
}

export function getCapabilityTerms(
  capabilityTitle: string,
  operationalTerms: CapabilityOperationalTerm[] = []
): OperationalTerm[] {
  const target = (capabilityTitle || '').trim().toLowerCase();
  if (!target) return [];

  return operationalTerms
    .filter((t) => {
      if (!t || !t.title?.trim() || !t.appliesTo || t.appliesTo === 'ALL') return false;
      return t.appliesTo.trim().toLowerCase() === target;
    })
    .map((t) => ({
      ...t,
      description: t.description || '',
    })) as OperationalTerm[];
}

export function getValidCapabilityFaqs(cap: Capability) {
  return (cap.faqs || []).filter((f) => f && f.question?.trim() && f.answer?.trim());
}

export function getValidCapabilityProfiles(cap: Capability) {
  return (cap.collectionProfiles || []).filter((p) => p && p.name?.trim());
}

export function hasCapabilityDetails(
  cap: Capability,
  photos: HubCollectionPhoto[],
  terms: OperationalTerm[]
): boolean {
  return (
    photos.length > 0 ||
    terms.length > 0 ||
    getValidCapabilityFaqs(cap).length > 0 ||
    getValidCapabilityProfiles(cap).length > 0
  );
}

export function getSmartDetailsLabel(
  cap: Capability,
  photos: HubCollectionPhoto[],
  terms: OperationalTerm[]
): string {
  if (cap.detailsLabel?.trim()) return cap.detailsLabel.trim();

  const faqsCount = getValidCapabilityFaqs(cap).length;
  const profilesCount = getValidCapabilityProfiles(cap).length;
  const hasSecondary = terms.length > 0 || faqsCount > 0 || profilesCount > 0;

  if (photos.length > 0 && hasSecondary) return CAPABILITY_DEFAULTS.PHOTOS_DETAILS_LABEL;
  if (photos.length > 0) return CAPABILITY_DEFAULTS.VIEW_GALLERY_LABEL;
  if (profilesCount > 0) return CAPABILITY_DEFAULTS.BIOS_DETAILS_LABEL;
  if (faqsCount > 0) return CAPABILITY_DEFAULTS.FAQS_DETAILS_LABEL;
  return CAPABILITY_DEFAULTS.POLICIES_DETAILS_LABEL;
}

export function getSmartCtaLabel(cap: Capability, fallbackLabel: string): string {
  return cap.ctaLabel?.trim() || fallbackLabel || CAPABILITY_DEFAULTS.INQUIRE_BTN;
}

export function resolveCapabilityBookingLink(cap: Capability): { href: string; label: string } | null {
  const href = normalizeExternalUrl(cap.bookingUrl);
  if (!href) return null;
  return {
    href,
    label: cap.bookingLabel?.trim() || CAPABILITY_DEFAULTS.BOOK_ONLINE_BTN,
  };
}

export function buildCapabilityTopicConfigs(
  capabilities: Capability[],
  globalAlaCarte: Capability[] = []
): Record<string, TopicConfig> {
  const fallbackAddons = globalAlaCarte
    .filter((a) => a && a.title?.trim())
    .map((a) => ({ title: a.title, price: a.price }));

  const map: Record<string, TopicConfig> = {};

  for (const cap of capabilities) {
    if (!cap?.title?.trim() || cap.isAlaCarte) continue;
    const itemAddons = Array.isArray(cap.addons) && cap.addons.length > 0 ? cap.addons : fallbackAddons;

    map[cap.title] = {
      addons: itemAddons,
      addonSelectionMode: cap.addonSelectionMode || 'multiple',
      askTimeframe: cap.askTimeframe === true,
      timeframeMode: cap.timeframeMode,
    };
  }

  return map;
}