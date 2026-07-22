// src/utils/glossary.ts

// 1. Core Meta Setup
export const SITE_CONFIG = {
  businessName: "Meals by Megan",
  tagline: "Fresh, Local, Ready to Eat.",
  subtext: "Stop stressing over Sunday meal prep. We deliver chef-crafted, macro-friendly meals straight to your door every week.",
  contactEmail: "orders@mealsbymegan.com",
  primaryCTA: "Order This Week's Menu", 
  secondaryCTA: "See the Food",
  brandColor: "emerald-500",
  // Logo is used for Hero background/branding
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
  { id: "2", title: "Custom Macros", description: "Whether you are hitting the gym or managing dietary restrictions, we tailor the fuel to your goals." },
  { id: "3", title: "Family Style Trays", description: "Large-format bakes and proteins designed to feed the whole family on a busy Tuesday night." }
];

// 5. The Feature Breakdown (The "How It Works")
export interface BusinessFeature {
  id: string;
  text: string;
}

export const CORE_FEATURES: BusinessFeature[] = [
  { id: "1", text: "1. Pick Your Meals: New menus drop every Wednesday. Lock in your choices by Friday." },
  { id: "2", text: "2. We Prep & Cook: We source local ingredients and cook everything fresh over the weekend." },
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
// Add this to src/utils/glossary.ts
export const STOREFRONT_DEFAULTS = {
  ABOUT_HEADING: "About Us",
  CAPABILITIES_HEADING: "My Services",
  GALLERY_HEADING: "Featured Work",
  PRIMARY_CTA: "Learn More",
  SECONDARY_CTA: "Contact Us"
};