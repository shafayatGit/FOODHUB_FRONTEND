import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const Role = {
  CUSTOMER: "CUSTOMER",
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN",
} as const

export type RoleType = (typeof Role)[keyof typeof Role]

const CUSTOMER_PATTERNS = [/^\/dashboard\/?$/, /^\/cart\/?$/, /^\/checkout\/?$/, /^\/orders(\/.*)?$/, /^\/profile\/?$/]
const PROVIDER_PATTERNS = [/^\/provider(\/.*)?$/]
const ADMIN_PATTERNS = [/^\/admin(\/.*)?$/]

function normalizePath(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/"
}

function getSessionToken(request: NextRequest) {
  return request.cookies.get("better-auth.session_token")?.value ?? null
}

function getRoleFromCookie(request: NextRequest): RoleType | null {
  const role = request.cookies.get("role")?.value?.toUpperCase() ?? null
  if (role === Role.CUSTOMER || role === Role.PROVIDER || role === Role.ADMIN) {
    return role
  }
  return null
}

function matches(pathname: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(pathname))
}

function roleDefaultRedirect(role: RoleType | null) {
  switch (role) {
    case Role.ADMIN:
      return "/admin"
    case Role.PROVIDER:
      return "/provider/dashboard"
    case Role.CUSTOMER:
      return "/dashboard"
    default:
      return "/login"
  }
}

function allowAccessForRole(role: RoleType | null, pathname: string) {
  if (matches(pathname, CUSTOMER_PATTERNS)) {
    return role === Role.CUSTOMER
  }

  if (matches(pathname, PROVIDER_PATTERNS)) {
    return role === Role.PROVIDER
  }

  if (matches(pathname, ADMIN_PATTERNS)) {
    return role === Role.ADMIN
  }

  return true
}

export function proxy(request: NextRequest) {
  const pathname = normalizePath(request.nextUrl.pathname)
  const sessionToken = getSessionToken(request)
  const role = getRoleFromCookie(request)

  const isLoginOrRegister = pathname === "/login" || pathname === "/register"
  const isProtectedRoute = matches(pathname, CUSTOMER_PATTERNS) || matches(pathname, PROVIDER_PATTERNS) || matches(pathname, ADMIN_PATTERNS)

  if (isLoginOrRegister && sessionToken) {
    return NextResponse.redirect(new URL(roleDefaultRedirect(role), request.url))
  }

  if (isProtectedRoute) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (!allowAccessForRole(role, pathname)) {
      return NextResponse.redirect(new URL(roleDefaultRedirect(role), request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/",
    "/home",
    "/meals/:path*",
    "/providers/:path*",
    "/login",
    "/register",
    "/dashboard",
    "/cart",
    "/checkout",
    "/orders/:path*",
    "/profile",
    "/provider/:path*",
    "/admin/:path*",
  ],
}
