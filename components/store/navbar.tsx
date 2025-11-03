'use client'

import Link from 'next/link'
import Image from 'next/image'
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
    <nav className="bg-primary-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left cluster: Logo + Desktop nav */}
          <div className="flex items-center gap-6 min-w-0">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.jpeg"
                alt="Poke Addiction"
                width={40}
                height={40}
                className="object-contain rounded-md"
                priority
              />
              <span className="hidden sm:inline text-xl font-bold whitespace-nowrap">
                Poke Addiction
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6 font-medium">
              <Link href="/productos" className="transition hover:text-gray-300">
                Productos
              </Link>
              {/* <Link href="" className="transition hover:text-gray-300">
                Expansiones
              </Link>
              <Link href="" className="transition hover:text-gray-300">
                Ofertas
              </Link> */}
              <Link href="/nosotros" className="transition hover:text-gray-300">
                Nosotros
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-6">
            {/* <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full px-4 py-2 rounded-lg border-2 border-white focus:outline-none focus:ring-2"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-white" />
            </div> */}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4">

          <Link href="/carrito" className="relative">
            <Button variant="ghost" size="icon" className="text-white hover:text-primary-500">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
            {session ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-sm hidden sm:inline">
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
                    className="text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="ml-2 hidden sm:inline">Salir</span>
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Iniciar Sesión</span>
                  <span className="sm:hidden">Login</span>
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:text-primary-500"
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
              {/* <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-white placeholder:text-white"
              /> */}
              <Link href="/productos" className="font-medium hover:font-bold">
                Productos
              </Link>
              {/* <Link href="" className="font-medium hover:font-bold">
                Expansiones
              </Link>
              <Link href="/ofertas" className="font-medium hover:font-bold">
                Ofertas
              </Link> */}
              <Link href="/nosotros" className="font-medium hover:font-bold">
                Nosotros
              </Link>
              <div className="border-t pt-4">
                {session ? (
                  <>
                    <p className="text-sm text-gray-600 mb-2">
                      Hola, {session.user?.name}
                    </p>
                    {(session.user as any).role === 'ADMIN' && (
                      <Link href="/admin" className="block py-2 text-gray-700 hover:text-primary-600 font-medium">
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
                  <Link href="/auth/login" className="font-medium hover:font-bold">
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
