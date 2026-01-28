export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

// Deshabilitar metadata para evitar cargar recursos innecesarios
export const metadata = {
  title: 'Sitio en Mantenimiento - Poke Addiction',
  description: 'Estamos trabajando en mejoras. Volveremos pronto.',
}
