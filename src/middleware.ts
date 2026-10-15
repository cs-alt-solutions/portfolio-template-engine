/* src/middleware.ts */
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // 1. Identify your core platform/Vercel domains
  // If traffic hits here, we don't need to rewrite a custom domain
  const isPlatformDomain = 
    hostname.includes('vercel.app') || 
    hostname.includes('localhost') || 
    hostname.includes('alternativesolutions.io');

  let supabaseResponse = NextResponse.next({
    request: { headers: request.headers },
  });

  if (isPlatformDomain) {
    return supabaseResponse;
  }

  // 2. CUSTOM DOMAIN ROUTING
  // Initialize Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          supabaseResponse = NextResponse.next({ request: { headers: request.headers } });
          supabaseResponse.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          supabaseResponse = NextResponse.next({ request: { headers: request.headers } });
          supabaseResponse.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Strip 'www.' so the database lookup matches 'blazenbloomstudios.com' exactly
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
      new URL(`/${storeData.slug}${cleanPath}`, request.url),
      { request: { headers: request.headers } }
    );
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - files with extensions (like .svg, .png, .jpg, etc.)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};