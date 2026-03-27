// export { default } from "next-auth/middleware";

// export const config = {
//   matcher: ["/dashboard"],
// };

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/', request.url))
}
 
export const config = {
  matcher: ["/notes/:path*", "/dashboard/:path*"],
}