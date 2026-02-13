import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Check if the path is in /admin but not /admin/login
    if (path.startsWith('/admin') && path !== '/admin/login') {
        const isAdmin = request.cookies.get('isAdmin')?.value === 'true';

        if (!isAdmin) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
