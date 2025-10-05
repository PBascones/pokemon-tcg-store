'use client'

import Link from 'next/link'
import { ShoppingCart, Search, User, Menu, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/stores/cart-store'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            PokéStore
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/productos" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Productos
            </Link>
            <Link href="/categorias" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Categorías
            </Link>
            <Link href="/ofertas" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Ofertas
            </Link>
            <Link href="/nosotros" className="text-gray-700 hover:text-blue-600 transition font-medium">
              Nosotros
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar cartas..."
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-600" />
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    Hola, {session.user?.name || 'Usuario'}
                  </span>
                  {(session.user as any).role === 'ADMIN' && (
                    <Link href="/admin">
                      <Button variant="outline" size="sm">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    title="Cerrar sesión"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="ml-2 hidden sm:inline">Salir</span>
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/auth/login" className="text-gray-900">
                <Button variant="outline" size="sm" className="text-gray-400">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Iniciar Sesión</span>
                  <span className="sm:hidden">Login</span>
                </Button>
              </Link>
            )}
            
            <Link href="/carrito" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Buscar cartas..."
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 placeholder:text-gray-500"
              />
              <Link href="/productos" className="text-gray-700 hover:text-blue-600 font-medium">
                Productos
              </Link>
              <Link href="/categorias" className="text-gray-700 hover:text-blue-600 font-medium">
                Categorías
              </Link>
              <Link href="/ofertas" className="text-gray-700 hover:text-blue-600 font-medium">
                Ofertas
              </Link>
              <Link href="/nosotros" className="text-gray-700 hover:text-blue-600 font-medium">
                Nosotros
              </Link>
              <div className="border-t pt-4">
                {session ? (
                  <>
                    <p className="text-sm text-gray-600 mb-2">
                      Hola, {session.user?.name}
                    </p>
                    {(session.user as any).role === 'ADMIN' && (
                      <Link href="/admin" className="block py-2 text-gray-700 hover:text-blue-600 font-medium">
                        Panel Admin
                      </Link>
                    )}
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="text-red-600 hover:text-red-700 py-2 font-medium"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 font-medium">
                    Iniciar Sesión
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
