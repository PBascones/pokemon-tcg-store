import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Middleware para modo mantenimiento y autenticación
export function middleware(req: NextRequest) {
  const isMaintenanceMode = process.env.PUBLIC_MAINTENANCE_MODE === 'true'
  const isMaintenancePage = req.nextUrl.pathname === '/maintenance'
  
  // MODO MANTENIMIENTO: Bloquear TODO el acceso al sitio
  if (isMaintenanceMode && !isMaintenancePage) {
    return NextResponse.redirect(new URL('/maintenance', req.url))
  }
  
  // Si NO está en modo mantenimiento y alguien intenta acceder a /maintenance, redirigir al home
  if (!isMaintenanceMode && isMaintenancePage) {
    return NextResponse.redirect(new URL('/', req.url))
  }
  
  // Si NO está en modo mantenimiento, aplicar lógica normal de autenticación
  // Solo para rutas protegidas (admin, cuenta, checkout)
  if (!isMaintenanceMode) {
    const protectedPaths = ['/admin', '/cuenta', '/checkout']
    const isProtectedRoute = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))
    
    // Solo aplicar withAuth si es una ruta protegida
    if (isProtectedRoute) {
      return withAuth(
        function middleware(req) {
          const token = req.nextauth.token
          const isAdmin = token?.role === "ADMIN"
          const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")

          if (isAdminRoute && !isAdmin) {
            return NextResponse.redirect(new URL("/", req.url))
          }

          return NextResponse.next()
        },
        {
          callbacks: {
            authorized: ({ token }) => !!token,
          },
          pages: {
            signIn: "/auth/login",
          },
        }
      )(req as any, {} as any)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Matcher amplio que intercepta todas las rutas (excepto archivos estáticos)
     * 
     * ¿Por qué es necesario?
     * - En MODO MANTENIMIENTO: Necesita interceptar TODO (home, productos, admin, etc.)
     * - En MODO NORMAL: Solo aplica autenticación a rutas protegidas (/admin, /cuenta, /checkout)
     * 
     * Este matcher permite que el middleware verifique TODAS las solicitudes,
     * pero la lógica interna decide si aplicar bloqueo o autenticación según la ruta.
     * 
     * Excluye: archivos estáticos, imágenes (públicas y optimizadas), favicon, archivos de assets
     */
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
}
