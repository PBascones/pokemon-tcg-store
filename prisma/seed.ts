import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Crear usuario administrador
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pokestore.com' },
    update: {},
    create: {
      email: 'admin@pokestore.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Usuario administrador creado:', admin.email)

  // Crear usuario de prueba
  const testUser = await prisma.user.upsert({
    where: { email: 'cliente@test.com' },
    update: {},
    create: {
      email: 'cliente@test.com',
      name: 'Cliente Test',
      password: await bcrypt.hash('test123', 10),
      role: 'USER',
    },
  })

  console.log('✅ Usuario de prueba creado:', testUser.email)

  // Crear expansiones (Sets/Expansiones de Pokémon)
  const expansions = [
    {
      name: 'Scarlet & Violet',
      slug: 'scarlet-violet',
      description: 'Serie más reciente de Pokémon TCG (2023-2024)',
    },
    {
      name: 'Sword & Shield',
      slug: 'sword-shield',
      description: 'Serie Sword & Shield (2020-2023)',
    },
    {
      name: 'Sun & Moon',
      slug: 'sun-moon',
      description: 'Serie Sun & Moon (2017-2020)',
    },
    {
      name: 'XY Series',
      slug: 'xy-series',
      description: 'Serie XY (2014-2017)',
    },
    {
      name: 'Black & White',
      slug: 'black-white',
      description: 'Serie Black & White (2011-2014)',
    },
    {
      name: 'Sets Especiales',
      slug: 'sets-especiales',
      description: 'Sets especiales y colecciones limitadas',
    },
  ]

  const createdExpansions: { [key: string]: any } = {}

  for (const exp of expansions) {
    const expansion = await prisma.expansion.upsert({
      where: { slug: exp.slug },
      update: {},
      create: exp,
    })
    createdExpansions[exp.slug] = expansion
  }

  console.log('✅ Expansiones creadas')

  // Crear Sets (Subcategorías de Expansiones)
  const sets = [
    // Scarlet & Violet Sets
    {
      name: 'Scarlet & Violet Base',
      slug: 'sv-base',
      description: 'Set base de la serie Scarlet & Violet',
      expansionId: createdExpansions['scarlet-violet'].id,
    },
    {
      name: 'Paldea Evolved',
      slug: 'paldea-evolved',
      description: 'Segunda expansión de Scarlet & Violet',
      expansionId: createdExpansions['scarlet-violet'].id,
    },
    {
      name: 'Obsidian Flames',
      slug: 'obsidian-flames',
      description: 'Tercera expansión de Scarlet & Violet',
      expansionId: createdExpansions['scarlet-violet'].id,
    },
    {
      name: 'Paradox Rift',
      slug: 'paradox-rift',
      description: 'Cuarta expansión de Scarlet & Violet',
      expansionId: createdExpansions['scarlet-violet'].id,
    },

    // Sword & Shield Sets
    {
      name: 'Evolving Skies',
      slug: 'evolving-skies',
      description: 'Set popular de Sword & Shield con Eeveelutions',
      expansionId: createdExpansions['sword-shield'].id,
    },
    {
      name: 'Lost Origin',
      slug: 'lost-origin',
      description: 'Set con mecánica Lost Box',
      expansionId: createdExpansions['sword-shield'].id,
    },
    {
      name: 'Brilliant Stars',
      slug: 'brilliant-stars',
      description: 'Set con cartas VSTAR',
      expansionId: createdExpansions['sword-shield'].id,
    },
    {
      name: 'Fusion Strike',
      slug: 'fusion-strike',
      description: 'Set con mecánica Fusion Strike',
      expansionId: createdExpansions['sword-shield'].id,
    },
    {
      name: 'Chilling Reign',
      slug: 'chilling-reign',
      description: 'Set con Ice Rider y Shadow Rider Calyrex',
      expansionId: createdExpansions['sword-shield'].id,
    },

    // Sun & Moon Sets
    {
      name: 'Cosmic Eclipse',
      slug: 'cosmic-eclipse',
      description: 'Último set principal de Sun & Moon',
      expansionId: createdExpansions['sun-moon'].id,
    },
    {
      name: 'Team Up',
      slug: 'team-up',
      description: 'Set con cartas TAG TEAM',
      expansionId: createdExpansions['sun-moon'].id,
    },

    // Sets Especiales
    {
      name: 'Hidden Fates',
      slug: 'hidden-fates',
      description: 'Set especial con Shiny Vault',
      expansionId: createdExpansions['sets-especiales'].id,
    },
    {
      name: 'Crown Zenith',
      slug: 'crown-zenith',
      description: 'Set especial de cierre de Sword & Shield',
      expansionId: createdExpansions['sets-especiales'].id,
    },
    {
      name: 'Shining Fates',
      slug: 'shining-fates',
      description: 'Set especial con cartas Shiny',
      expansionId: createdExpansions['sets-especiales'].id,
    },

    // XY Series
    {
      name: 'XY Evolutions',
      slug: 'xy-evolutions',
      description: 'Homenaje al set Base original',
      expansionId: createdExpansions['xy-series'].id,
    },
  ]

  const createdSets: { [key: string]: any } = {}

  for (const setData of sets) {
    const set = await prisma.set.upsert({
      where: { slug: setData.slug },
      update: {},
      create: setData,
    })
    createdSets[setData.slug] = set
  }

  console.log('✅ Sets creados')

  console.log('🎉 Seed completado exitosamente!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
