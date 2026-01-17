import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import {
  adminRoutes,
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  userRoutes,
} from './routes'
import { Role } from './prisma/generated/enums'

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const role = session?.user.role
  const typedrole: Role = role as Role

  const { nextUrl } = request
  const isLoggedIn = !!session
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  // const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isAdminRoute = adminRoutes.includes(nextUrl.pathname)
  const isUserRoute = userRoutes.includes(nextUrl.pathname)

  if (isApiAuthRoute) return
  if (isAuthRoute) {
    //TO-DO: adicionar redirect de /login apenas para a mai
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT[typedrole], nextUrl))
    }
    return NextResponse.next()
  }

  // Redireciona para login se o usuário não está autenticado e a rota não é pública
  // if (!isLoggedIn && !isPublicRoute)
  //   return Response.redirect(new URL("/auth/login", nextUrl));

  //TO-DO: adicionar redirect de /user para /user/dashboard

  // Redireciona para 404 se a rota é de admin e o usuário não tem permissão adequada
  if (isAdminRoute && role !== Role.ADMIN) return Response.redirect(new URL('/404', nextUrl))

  if (isUserRoute && role !== Role.USER) return Response.redirect(new URL('/404', nextUrl))

  return NextResponse.next()
}

export const config = {
  // Apply middleware to specific routes
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
