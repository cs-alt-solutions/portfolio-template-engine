/* src/middleware.ts */
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // 1. Identify your core platform/Vercel domains
  const isPlatformDomain = 
    hostname.includes('vercel.app') || 
    hostname.includes('localhost') || 
    hostname.includes('alternativesolutions.io');

  // If they are hitting the main directory, let them through immediately
  if (isPlatformDomain) {
    return NextResponse.next();
  }

  // 2. CUSTOM DOMAIN ROUTING
  // Initialize the standard, edge-friendly Supabase client (No SSR cookies needed!)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Strip 'www.' so the database lookup matches exactly
  const cleanHostname = hostname.replace(/^www\./, '');

  // Ask the database: "Does anyone own this domain?"
  const { data: storeData } = await supabase
    .from('storefronts')
    .select('slug')
    .eq('custom_domain', cleanHostname)
    .single();

  if (storeData?.slug) {
    // Prevent trailing slash double-ups
    const cleanPath = url.pathname === '/' ? '' : url.pathname;
    
    // Found it! Seamlessly rewrite to their specific /[slug] route under the hood
    return NextResponse.rewrite(
      new URL(`/${storeData.slug}${cleanPath}`, request.url)
    );
  }

  // If no domain is found, pass them through (or you could render a 404)
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static assets
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};