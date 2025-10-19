import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SetForm } from '@/components/admin/set-form'

interface EditSetPageProps {
  params: Promise<{ id: string }>
}

export default async function EditSetPage({ params }: EditSetPageProps) {
  const { id } = await params

  const [set, expansions] = await Promise.all([
    prisma.set.findUnique({
      where: { id },
    }),
    prisma.expansion.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ])

  if (!set) {
    notFound()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Editar Set</h1>
        <p className="text-gray-600">
          Modificá los datos del set "{set.name}"
        </p>
      </div>

      <SetForm set={set} expansions={expansions} />
    </div>
  )
}
