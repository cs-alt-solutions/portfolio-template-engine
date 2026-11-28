/* src/components/portfolio/content-engine/layouts/menu/menuHelpers.ts */
import { Capability, GalleryItem } from '../../types';

export interface UnifiedMenuItem {
  type: 'photo' | 'blank';
  id: string;
  title: string;
  price: string;
  desc: string;
  imageUrl?: string;
  focalPoint?: { x: number; y: number };
  isRaw?: boolean;
  addons?: { name: string; price: string }[];
}

export const slugifyMenuCategory = (text: string) =>
  (text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');

export const parseMenuItemData = (rawText: string = '') => {
  const match = rawText.match(/(.+?)(?:\s*[-|:—]*\s*)(\$[\d.]+)$/);
  if (match) return { text: match[1].trim(), price: match[2] };
  return { text: rawText.trim(), price: null };
};

export const formatVariantPrice = (price: string) => {
  const clean = price.trim();
  if (!clean) return '';
  if (clean.match(/^[+-]/)) {
    const sign = clean[0];
    const num = clean.slice(1).trim();
    return `${sign}${num.startsWith('$') ? '' : '$'}${num}`;
  }
  return clean.startsWith('$') ? clean : `$${clean}`;
};

export function buildUnifiedMenuItems(
  section: Capability,
  galleryItems: GalleryItem[]
): UnifiedMenuItem[] {
  const unifiedItems: UnifiedMenuItem[] = [];
  const target = (section.title || '').trim().toLowerCase();

  const attachedGallery = (galleryItems || []).filter(
    (item) =>
      item &&
      item.isVisible !== false &&
      (item.category || '').trim().toLowerCase() === target
  );

  attachedGallery.forEach((img, idx) => {
    const isPhoto = Boolean(img.imageUrl && img.imageUrl.trim() !== '');
    const parsedTitle = parseMenuItemData(img.title || '');
    const displayName = parsedTitle.text;

    let displayPrice = '';
    if (img.price && String(img.price).trim() !== '') {
      displayPrice = String(img.price).trim();
    } else if (parsedTitle.price) {
      displayPrice = parsedTitle.price;
    }

    let displayDesc = img.description || '';
    if (!displayPrice && displayDesc) {
      const descParse = parseMenuItemData(displayDesc);
      if (descParse.price) {
        displayPrice = descParse.price;
        displayDesc = descParse.text;
      }
    }

    if (displayPrice && !displayPrice.startsWith('$')) {
      displayPrice = `$${displayPrice}`;
    }

    unifiedItems.push({
      type: isPhoto ? 'photo' : 'blank',
      id: img.id || `menu-img-${idx}`,
      title: displayName,
      price: displayPrice,
      desc: displayDesc,
      imageUrl: img.imageUrl,
      focalPoint: img.focalPoint,
      isRaw: img.isRaw,
      addons: img.addons,
    });
  });

  (section.bullets || []).forEach((bullet, bIdx) => {
    if (!bullet?.trim()) return;
    const { text: itemName, price: itemPrice } = parseMenuItemData(bullet);
    unifiedItems.push({
      type: 'blank',
      id: `bullet-${bIdx}`,
      title: itemName,
      price: itemPrice || '',
      desc: '',
    });
  });

  return unifiedItems;
}