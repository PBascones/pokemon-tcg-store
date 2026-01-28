import Image from 'next/image'

export default function MaintenancePage() {
  return (
    <div className="fixed inset-0 w-full h-full">
      <Image
        src="/images/matenaince.png"
        alt="Sitio en Mantenimiento"
        fill
        className="object-cover"
        priority
        unoptimized
      />
    </div>
  )
}
