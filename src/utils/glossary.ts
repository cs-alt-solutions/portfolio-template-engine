// src/utils/glossary.ts

// 1. Core Meta Setup
export const SITE_CONFIG = {
  businessName: "Meals by Megan",
  tagline: "Fresh, Local, Ready to Eat.",
  subtext: "Stop stressing over Sunday meal prep. I deliver chef-crafted, macro-friendly meals straight to your door every week.",
  contactEmail: "orders@mealsbymegan.com",
  primaryCTA: "Order This Week's Menu", 
  secondaryCTA: "See the Food",
  brandColor: "emerald-500",
  heroImage: "/template-model/brand-logo.jpg", 
};

// 2. Layout Sandbox Preferences
export const LAYOUT_PREFERENCES = {
  heroStyle: "center-aligned", 
  capabilitiesStyle: "shadow-cards", 
  showCapabilities: true, 
  showProcessList: true,
};

// 3. Structured Narrative Block
export const ABOUT_DATA = {
  heading: "Real Food for Busy People",
  bio: "I started Meals by Megan because I saw how many local families were relying on fast food just to get through the week. My mission is simple: provide our community with locally-sourced, incredibly flavorful meals that require zero prep and zero cleanup. You get your time back, and your body gets the fuel it actually needs.",
  imageUrl: "/template-model/about-image.jpg",
  facebookUrl: "https://www.facebook.com/mealsbymegan",
  ctaText: "Follow the Journey"
};

// 4. Capabilities / Services Matrix
export interface CapabilityItem {
  id: string;
  title: string;
  description: string;
}

export const CAPABILITIES: CapabilityItem[] = [
  { id: "1", title: "Weekly Meal Prep", description: "5 to 15 meals a week, perfectly portioned and delivered fresh—never frozen." },
  { id: "2", title: "Custom Macros", description: "Whether you are hitting the gym or managing dietary restrictions, I tailor the fuel to your goals." },
  { id: "3", title: "Family Style Trays", description: "Large-format bakes and proteins designed to feed the whole family on a busy Tuesday night." }
];

// 5. The Feature Breakdown (The "How It Works")
export interface BusinessFeature {
  id: string;
  text: string;
}

export const CORE_FEATURES: BusinessFeature[] = [
  { id: "1", text: "1. Pick Your Meals: New menus drop every Wednesday. Lock in your choices by Friday." },
  { id: "2", text: "2. I Prep & Cook: I source local ingredients and cook everything fresh over the weekend." },
  { id: "3", text: "3. Monday Delivery: Your meals arrive in insulated cooler bags, ready to heat and eat." }
];

// 6. Portfolio / Gallery Engine
export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  size: 'large' | 'medium' | 'small';
}

export const GALLERY_ITEMS: PortfolioItem[] = [
  {
    id: "4",
    title: "From fresh fruit tartlets to chocolate covered strawberries and elegant dessert cups, every detail is designed to create a beautiful experience for your guests.",
    category: "Fresh Prep",
    imageUrl: "/template-model/gallery-1.jpg",
    size: "medium"
  },
  {
    id: "2",
    title: "Pan Seared Foie Gras",
    category: "High Protein",
    imageUrl: "/template-model/gallery-2.jpg",
    size: "medium"
  },
  {
    id: "3",
    title: "Grilled Pork chop topped with a roased red pepper garden salsa",
    category: "Meal Prep",
    imageUrl: "/template-model/gallery-3.jpg",
    size: "medium"
  },
  {
    id: "1",
    title: "Butter Chicken Over Rice, sauteed green beans, roasted sweet potatoes, and garlic naan.",
    category: "Meal Prep",
    imageUrl: "/template-model/gallery-4.jpg",
    size: "large"
  }
];

// 7. Storefront Defaults
export const STOREFRONT_DEFAULTS = {
  ABOUT_HEADING: "About Us",
  CAPABILITIES_HEADING: "My Services",
  GALLERY_HEADING: "Featured Work",
  PRIMARY_CTA: "Learn More",
  SECONDARY_CTA: "Contact Me"
};

// 8. Staging QA Audit Roadmap (Single Source of Truth)
export interface AuditStep {
  title: string;
  targetId: string;
  description: string;
  checks: string[];
}

export const AUDIT_ROADMAP: AuditStep[] = [
  {
    title: "First Impression & Hero",
    targetId: "hero",
    description: "First impressions are everything! Look at the very top of your site. I need your honest feedback—don't just pat me on the back! If something feels off, tell me so I can fix it.",
    checks: [
      "Read the main headline aloud—does it actually sound like your authentic brand voice?",
      "Look at the background photo—does it instantly set the right mood for your customers?",
      "Check the colors and overall layout—does this feel like a site you are proud to show off?"
    ]
  },
  {
    title: "Your Story & Background",
    targetId: "about",
    description: "This is where your customers get to know the real you. Check my wording closely! If I missed a key detail about your story or business, drop a note below so I can correct it.",
    checks: [
      "Read the personal bio carefully—are all the facts, names, and details 100% accurate?",
      "Look at your profile picture—is it sharp, clear, and representing you well?",
      "Click every single social media link—do they actually open up to your real pages?"
    ]
  },
  {
    title: "Services & Offerings",
    targetId: "portfolio",
    description: "Let's check your moneymakers! Your services and past work need to be spot on. Tell me if anything is missing, misspelled, or needs a different wording.",
    checks: [
      "Check the service titles and descriptions—does this clearly explain what you offer?",
      "Look through your featured work and photos—are these the exact projects you want highlighted?",
      "Scan for typos or missing services—is there anything else you want to add or remove?"
    ]
  },
  {
    title: "Final Review & Next Steps",
    targetId: "contact",
    description: "We made it to the finish line! Test out the contact form below, double-check your notes, and let me know if we are making adjustments or pulling the trigger on your live launch!",
    checks: [
      "Did you send a fake message through the contact form to make sure it hits your email inbox?",
      "Are you 100% happy with all the wording, photos, and layout across the entire site?",
      "I approve this build as-is and I am ready to lock in my $5/mo hosting to go live!"
    ]
  }
];
// 8. Upcoming Events Defaults
export const EVENTS_DEFAULTS = {
  EYEBROW_PREFIX: 'On The Calendar',
  EYEBROW_SUFFIX: 'Upcoming',
  HEADING: 'Upcoming Events',
  SUBTEXT_SUFFIX: 'in person—tap any date to save it to your calendar, pull up directions, or RSVP.',
  NEXT_UP_BADGE: 'Next Up',
  TODAY_BADGE: 'Happening Today',
  TOMORROW_BADGE: 'Tomorrow',
  ADD_TO_CALENDAR_BTN: 'Add to Calendar',
  GOOGLE_CAL_OPTION: 'Google Calendar',
  APPLE_CAL_OPTION: 'Apple Calendar',
  OUTLOOK_CAL_OPTION: 'Outlook / Other',
  DETAILS_BTN: 'Event Details',
  RSVP_BTN: 'RSVP / Inquire',
  INQUIRY_PREFIX: 'Event Inquiry:',
  CATEGORY_LABELS: {
    festival: 'Farm / Festival',
    appearance: 'Live Appearance',
    popup: 'Pop-Up Market',
    truck: 'Food Truck Stop',
    session: 'Mini-Sessions',
    live: 'Live Night',
    special: 'Special Event',
  } as Record<string, string>,
};

// 9. Department Hub Details Modal Defaults
export const HUB_DETAILS_DEFAULTS = {
  PHOTOS_DETAILS_BADGE: 'Photos & Details',
  STORY_GALLERY_BADGE: 'Story Gallery',
  BOOKING_DETAILS_BADGE: 'Booking Details',
  FAQS_ONLY_BADGE: 'Frequently Asked Questions',
  FAQS_HEADING: 'Frequently Asked Questions',
  POLICIES_HEADING: 'Booking Details & Policies',
  QUICK_INQUIRY_BTN: 'Quick Inquiry',
};
// 10. Universal Lead Modal Defaults
export const LEAD_MODAL_DEFAULTS = {
  EYEBROW: 'Direct Inquiry',
  SUBTEXT_PREFIX: 'Fill out the details below to connect directly with',
  TOPIC_LABEL: 'Topic *',
  OPTIONS_LABEL: 'Interested In (Optional)',
  TIMEFRAME_HEADING: 'Preferred Timing (Request Only)',
  TIMEFRAME_NOTE: 'Not a guaranteed booking — we will follow up to confirm availability.',
  PREFERRED_DATE_LABEL: 'Preferred Date / Timeframe',
  PREFERRED_DATE_PLACEHOLDER: 'e.g., Mid-December or Sat, Dec 14',
  BACKUP_DATE_LABEL: 'Backup Window (Optional)',
  BACKUP_DATE_PLACEHOLDER: 'e.g., Flexible on Sundays',
  NAME_LABEL: 'Your Name *',
  NAME_PLACEHOLDER: 'e.g., Jordan Smith',
  EMAIL_LABEL: 'Email Address *',
  EMAIL_PLACEHOLDER: 'jordan@example.com',
  PHONE_LABEL: 'Phone Number',
  PHONE_PLACEHOLDER: '(555) 000-0000',
  SUBMIT_BTN: 'Submit Request',
  SUBMITTING_BTN: 'Transmitting...',
  SUCCESS_HEADING: 'Request Received!',
  SUCCESS_BTN: 'Back to Website',
};
// Storefront Page Route Defaults
export const PAGE_DEFAULTS = {
  NOT_FOUND_TITLE: 'Not Found',
  FALLBACK_BUSINESS_NAME: 'Workspace',
  FALLBACK_TAGLINE: 'Custom Solutions',
  FALLBACK_TEAM_NAME: 'Our Team',
  FALLBACK_LOCATION_NAME: 'Our Location',
  FALLBACK_RIGHTS_HOLDER: 'All Rights Reserved',
  FALLBACK_GALLERY_HEADING: 'Featured Work',
  FALLBACK_ABOUT_HEADING: 'About Us',
  FALLBACK_CAPABILITIES_HEADING: 'Services',
  HUB_HERO_CTA: 'Explore Departments',
  HERO_CTA_PREFIX: 'View',
  LOGO_ALT: 'Brand Icon',
  POWERED_BY_LABEL: 'Powered by',
  AGENCY_NAME: 'Alternative Solutions',
  AGENCY_URL: 'https://alternativesolutions.io',
};

// Lookbook Flow Defaults
export const LOOKBOOK_DEFAULTS = {
  GALLERY_HEADING: 'Featured Work',
  COLLECTIONS_HEADING: 'Collections',
  NO_COVER_LABEL: 'No Cover',
  VIEW_GALLERY_LABEL: 'View Gallery',
  BOOK_PACKAGE_BTN: 'Book This Package',
  BOOK_CULINARY_BTN: 'Inquire / Preorder',
  BOOK_CTA_PREFIX: 'Book',
  DIRECT_BOOKING_OPTION: 'Direct Booking',
  ADDONS_BADGE: 'Flexible Upgrades',
  ADDONS_HEADING: 'Additional Add-ons',
  ADDONS_SUBTEXT: 'Customize your package with any of these standalone enhancements.',
  LOGISTICS_BTN: 'View Travel & Logistics',
  LOGISTICS_BADGE: 'Logistics & Terms',
  LOGISTICS_HEADING: 'Rules of Engagement',
  DEFAULT_BUSINESS_NAME: 'Our Team',
  DEFAULT_SLUG: 'platform-direct',
};
// Gallery Grid Defaults
export const GALLERY_DEFAULTS = {
  FALLBACK_HEADING: 'Featured Work',
  UNCATEGORIZED_LABEL: 'Featured Collection',
  MODAL_FALLBACK_TITLE: 'Gallery',
  PHOTO_SINGULAR: 'Photo',
  PHOTO_PLURAL: 'Photos',
  VIEW_SET_LABEL: 'View Collection',
};
export const CAPABILITY_DEFAULTS = {
  PHOTOS_DETAILS_LABEL: 'Photos & Details',
  VIEW_GALLERY_LABEL: 'View Gallery',
  FAQS_DETAILS_LABEL: 'FAQs & Details',
  BIOS_DETAILS_LABEL: 'Profiles & Details',
  POLICIES_DETAILS_LABEL: 'Policies & Details',
  BOOK_ONLINE_BTN: 'Book Online',
  INQUIRE_BTN: 'Inquire Now',
  DIRECT_INQUIRY_OPTION: 'Direct Inquiry',
  DEFAULT_BUSINESS_NAME: 'Our Team',
  DEFAULT_SLUG: 'platform-direct',
};