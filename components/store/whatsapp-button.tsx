'use client'

import { MessageCircle } from 'lucide-react'
import Image from 'next/image'


export function WhatsAppButton() {
  const message = '¡Hola! Me gustaría hacer una consulta sobre los productos de Poke Addiction.'
  const handleClick = () => {
    const url = `https://wa.me/${process.env.NEXT_PUBLIC_WSP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group cursor-pointer"
      aria-label="Contactar por WhatsApp"
    >
      <Image
        src="/images/pokewhatsapp.png"
        alt="WhatsApp"
        width={40}
        height={40}
        className="object-contain rounded-md"
        priority
      />
      {/* Tooltip */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        ¿Tenés alguna duda? ¡Escribinos!
      </span>
    </button>
  )
}

