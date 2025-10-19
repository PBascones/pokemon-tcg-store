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

  // Crear productos de sobres (Booster Packs)
  const products = [
    // Scarlet & Violet Series
    {
      name: 'Scarlet & Violet Base Set - Booster Pack',
      slug: 'sv-base-booster',
      description: 'Sobre del set base de Scarlet & Violet. Incluye 10 cartas con posibilidad de obtener cartas ex, Full Art y Secret Rare.',
      set: 'Scarlet & Violet Base',
      language: 'Inglés',
      price: 5500,
      compareAtPrice: 6500,
      stock: 50,
      featured: true,
      isActive: true,
      expansionId: createdExpansions['scarlet-violet'].id,
    },
    {
      name: 'Paldea Evolved - Booster Pack',
      slug: 'paldea-evolved-booster',
      description: 'Sobre de Paldea Evolved. Descubrí nuevos Pokémon de la región de Paldea.',
      set: 'Paldea Evolved',
      language: 'Inglés',
      price: 6000,
      compareAtPrice: 7000,
      stock: 35,
      featured: true,
      isActive: true,
      expansionId: createdExpansions['scarlet-violet'].id,
    },
    {
      name: 'Obsidian Flames - Booster Pack',
      slug: 'obsidian-flames-booster',
      description: 'Sobre de Obsidian Flames con increíbles cartas ex y Tera Pokémon.',
      set: 'Obsidian Flames',
      language: 'Inglés',
      price: 5800,
      stock: 40,
      featured: true,
      isActive: true,
      expansionId: createdExpansions['scarlet-violet'].id,
    },
    {
      name: 'Paradox Rift - Booster Pack',
      slug: 'paradox-rift-booster',
      description: 'Sobre de Paradox Rift. Incluye Pokémon Paradoja y cartas ex exclusivas.',
      set: 'Paradox Rift',
      language: 'Inglés',
      price: 6200,
      compareAtPrice: 7200,
      stock: 30,
      featured: true,
      isActive: true,
      expansionId: createdExpansions['scarlet-violet'].id,
    },

    // Sword & Shield Series
    {
      name: 'Evolving Skies - Booster Pack',
      slug: 'evolving-skies-booster',
      description: 'Sobre de Evolving Skies. Uno de los sets más populares con increíbles Alternate Arts de Eeveelutions.',
      set: 'Evolving Skies',
      language: 'Inglés',
      price: 8500,
      compareAtPrice: 10000,
      stock: 25,
      featured: true,
      isActive: true,
      expansionId: createdExpansions['sword-shield'].id,
    },
    {
      name: 'Lost Origin - Booster Pack',
      slug: 'lost-origin-booster',
      description: 'Sobre de Lost Origin con mecánica Lost Zone y cartas VSTAR.',
      set: 'Lost Origin',
      language: 'Inglés',
      price: 6500,
      stock: 35,
      featured: true,
      isActive: true,
      expansionId: createdExpansions['sword-shield'].id,
    },
    {
      name: 'Brilliant Stars - Booster Pack',
      slug: 'brilliant-stars-booster',
      description: 'Sobre de Brilliant Stars con Arceus VSTAR y cartas de alta demanda.',
      set: 'Brilliant Stars',
      language: 'Inglés',
      price: 7000,
      stock: 28,
      featured: false,
      isActive: true,
      expansionId: createdExpansions['sword-shield'].id,
    },
    {
      name: 'Fusion Strike - Booster Pack',
      slug: 'fusion-strike-booster',
      description: 'Sobre de Fusion Strike con nuevos Pokémon Fusion Strike.',
      set: 'Fusion Strike',
      language: 'Inglés',
      price: 5200,
      stock: 45,
      featured: false,
      isActive: true,
      expansionId: createdExpansions['sword-shield'].id,
    },
    {
      name: 'Chilling Reign - Booster Pack',
      slug: 'chilling-reign-booster',
      description: 'Sobre de Chilling Reign con Calyrex y legendarios de Galar.',
      set: 'Chilling Reign',
      language: 'Inglés',
      price: 5500,
      stock: 32,
      featured: false,
      isActive: true,
      expansionId: createdExpansions['sword-shield'].id,
    },

    // Sun & Moon Series
    {
      name: 'Cosmic Eclipse - Booster Pack',
      slug: 'cosmic-eclipse-booster',
      description: 'Sobre de Cosmic Eclipse. Último set de la era Sun & Moon con cartas TAG TEAM.',
      set: 'Cosmic Eclipse',
      language: 'Inglés',
      price: 9000,
      compareAtPrice: 11000,
      stock: 15,
      featured: true,
      isActive: true,
      expansionId: createdExpansions['sun-moon'].id,
    },
    {
      name: 'Hidden Fates - Booster Pack',
      slug: 'hidden-fates-booster',
      description: 'Sobre de Hidden Fates. Set especial con Shiny Vault. Muy buscado por coleccionistas.',
      set: 'Hidden Fates',
      language: 'Inglés',
      price: 12000,
      compareAtPrice: 15000,
      stock: 8,
      featured: true,
      isActive: true,
      expansionId: createdExpansions['sun-moon'].id,
    },
    {
      name: 'Team Up - Booster Pack',
      slug: 'team-up-booster',
      description: 'Sobre de Team Up con cartas TAG TEAM GX.',
      set: 'Team Up',
      language: 'Inglés',
      price: 7500,
      stock: 20,
      featured: false,
      isActive: true,
      expansionId: createdExpansions['sun-moon'].id,
    },

    // Sets Especiales
    {
      name: 'Crown Zenith - Booster Pack',
      slug: 'crown-zenith-booster',
      description: 'Sobre de Crown Zenith. Set especial con Galarian Gallery.',
      set: 'Crown Zenith',
      language: 'Inglés',
      price: 7800,
      stock: 25,
      featured: true,
      isActive: true,
      expansionId: createdExpansions['sets-especiales'].id,
    },
    {
      name: 'Shining Fates - Booster Pack',
      slug: 'shining-fates-booster',
      description: 'Sobre de Shining Fates con Shiny Vault y Charizard VMAX.',
      set: 'Shining Fates',
      language: 'Inglés',
      price: 10000,
      compareAtPrice: 12000,
      stock: 12,
      featured: true,
      isActive: true,
      expansionId: createdExpansions['sets-especiales'].id,
    },

    // XY Series (vintage)
    {
      name: 'XY Evolutions - Booster Pack',
      slug: 'xy-evolutions-booster',
      description: 'Sobre de XY Evolutions. Reimaginación del set Base original.',
      set: 'XY Evolutions',
      language: 'Inglés',
      price: 8000,
      stock: 18,
      featured: false,
      isActive: true,
      expansionId: createdExpansions['xy-series'].id,
    },
  ]

  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: {
        ...product,
        images: {
          create: [
            {
              url: '/placeholder.png',
              alt: product.name,
              order: 0,
            },
          ],
        },
      },
    })
    console.log(`✅ Producto creado: ${createdProduct.name}`)
  }

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
