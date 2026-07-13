import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  const PROTECTED_ROUTES = ['/history'];
  const AUTH_ROUTES = ['/signin', '/signup'];

  //  If not authenticated and trying to access protected route > 401
  if (!user && PROTECTED_ROUTES.some((route) => path.startsWith(route))) {
    return new NextResponse(
      `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>401 Unauthorized</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: #0a0a0a;
            color: #f5f5f5;
          }
          .container { text-align: center; }
          h1 { 
            font-size: 2.25rem; 
            font-weight: 700; 
            color: white; 
            margin-bottom: 1rem;
          }
          p { 
            color: #9ca3af; 
            margin-bottom: 1.5rem;
          }
          a {
            display: inline-block;
            padding: 0.125rem 0.75rem;
            border-radius: 0.25rem;
            border: 2px solid #2563eb;
            background: #2563eb;
            color: white;
            text-decoration: none;
            font-size: 0.875rem;
            transition: all 0.2s;
          }
          a:hover {
            border-color: #1d4ed8;
            background: #1d4ed8;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>401</h1>
          <p>Unauthorized</p>
          <a href="/">Go Home</a>
        </div>
      </body>
    </html>
    `,
      {
        status: 401, 
        headers: {
      'Content-Type': 'text/html',
      'WWW-Authenticate': 'Bearer realm="swagger-editor-app"',
    },
      },
    );
  }

  // If authenticated and trying to access auth routes > Redirect to home
  if (user && AUTH_ROUTES.includes(path)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
