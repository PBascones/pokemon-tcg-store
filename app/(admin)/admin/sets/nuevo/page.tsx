import { prisma } from '@/lib/prisma'
import { SetForm } from '@/components/admin/set-form'

export default async function NewSetPage() {
  const expansions = await prisma.expansion.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Nuevo Set</h1>
        <p className="text-gray-600">
          Creá un nuevo set para organizar los productos por expansión
        </p>
      </div>

      <SetForm expansions={expansions} />
    </div>
  )
}
