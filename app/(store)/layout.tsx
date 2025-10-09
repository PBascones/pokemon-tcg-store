import { Navbar } from '@/components/store/navbar'
import { Footer } from '@/components/store/footer'
import { WhatsAppButton } from '@/components/store/whatsapp-button'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
