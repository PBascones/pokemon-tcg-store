import { Navbar } from '@/components/store/navbar'
import { Footer } from '@/components/store/footer'
import { WhatsAppButton } from '@/components/store/whatsapp-button'
import { ExchangeRateProvider } from '@/contexts/exchange-rate-context'
import { getUSDPriceForSSR } from '@/lib/currency-cache'

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Obtener tipo de cambio UNA SOLA VEZ para toda la app (cacheado por Next.js por 30 min)
  const exchangeRate = await getUSDPriceForSSR()

  return (
    <ExchangeRateProvider exchangeRate={exchangeRate}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </ExchangeRateProvider>
  )
}
