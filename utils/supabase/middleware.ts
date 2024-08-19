import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

let cachedRoles: { id: string; name: string }[] | null = null;
const rolesCacheExpiration = 7 * 60 * 60 * 1000;
let lastFetchTime = 0;

export async function updateSession(request: NextRequest) {
  const currentTime = Date.now();

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  if (pathname === '/') {
    return NextResponse.next();
  }

  if (!user && pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (pathname === '/dashboard') {
    return NextResponse.next();
  }

  const authPages = [
    '/register/institute',
    '/login',
    '/login/student',
    '/login/institute-coordinator',
    '/login/department-coordinator',
    '/login/college-mentor',
    '/login/company-mentor',
    '/forgot-password',
    '/resend-email-verification',
  ];

  if (authPages.includes(pathname)) {
    if (user) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!cachedRoles || currentTime - lastFetchTime > rolesCacheExpiration) {
    const { data: roles, error } = await supabase.from('roles').select('*');
    if (error) return NextResponse.error();
    cachedRoles = roles;
    lastFetchTime = currentTime;
  }

  const userRoles = new Set(user?.user_metadata?.role_ids || []);
  const roleMap = cachedRoles.reduce((acc, { name, id }) => {
    acc[`/dashboard/${name}`] = id;
    return acc;
  }, {} as Record<string, string>);

  const isAuthorized = Object.entries(roleMap).some(
    ([path, role_id]) => pathname.startsWith(path) && userRoles.has(role_id)
  );

  if (!isAuthorized) {
    const url = request.nextUrl.clone();
    url.pathname = '/error';
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
