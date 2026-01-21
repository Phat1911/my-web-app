import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt");

  if (!token) {
    return NextResponse.redirect(new URL("/log-in", req.url));
  } 
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
