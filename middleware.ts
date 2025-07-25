import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { checkSession } from './lib/api/serverApi';
import { parse } from 'cookie';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;
  const { pathname } = request.nextUrl;

  const isPrivate = privateRoutes.some(route => pathname.startsWith(route));
  const isPublic = publicRoutes.some(route => pathname.startsWith(route));

  const updateCookiesFromSetCookieHeader = (setCookie: string[] | string, response: NextResponse) => {
    const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

    for (const cookieStr of cookieArray) {
      const parsed = parse(cookieStr);
      const options = {
        expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
        path: parsed.Path || '/',
        maxAge: parsed['Max-Age'] ? Number(parsed['Max-Age']) : undefined,
      };

      if (parsed.accessToken) {
        response.cookies.set('accessToken', parsed.accessToken, options);
      }
      if (parsed.refreshToken) {
        response.cookies.set('refreshToken', parsed.refreshToken, options);
      }
    }
  };

  if (isPrivate) {
    if (!accessToken) {
      if (refreshToken) {
        const apiRes = await checkSession();
        const setCookie = apiRes.headers['set-cookie'];

        if (setCookie) {
          const response = NextResponse.next();
          updateCookiesFromSetCookieHeader(setCookie, response);
          return response;
        }
      }

      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  if (isPublic) {
    if (!accessToken) {
      if (refreshToken) {
        const apiRes = await checkSession();
        const setCookie = apiRes.headers['set-cookie'];

        if (setCookie) {
          const response = NextResponse.redirect(new URL('/', request.url));
          updateCookiesFromSetCookieHeader(setCookie, response);
          return response;
        }
      }

      return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/notes/:path*',
    '/sign-in',
    '/sign-up',
  ],
};
