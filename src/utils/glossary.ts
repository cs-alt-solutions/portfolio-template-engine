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