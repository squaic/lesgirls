import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const protectedPath =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/add") ||
    request.nextUrl.pathname.startsWith("/recommendations") ||
    request.nextUrl.pathname.startsWith("/profile");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Never let a missing/temporarily unavailable Supabase configuration crash
  // the Vercel routing layer. Public routes must remain reachable and protected
  // routes fall back to the login page.
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables in middleware");

    if (protectedPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      url.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(values) {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          values.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && protectedPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      url.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    return response;
  } catch (error) {
    // An auth/network failure must not surface as MIDDLEWARE_INVOCATION_FAILED.
    console.error("Supabase middleware auth check failed", error);

    if (protectedPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      url.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    return response;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
