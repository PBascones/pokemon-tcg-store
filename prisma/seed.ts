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

  // Crear categorías
  const categories = [
    {
      name: 'Cartas Base',
      slug: 'cartas-base',
      description: 'Cartas del set Base de Pokémon',
    },
    {
      name: 'Cartas EX',
      slug: 'cartas-ex',
      description: 'Cartas Pokémon EX de alta rareza',
    },
    {
      name: 'Cartas GX',
      slug: 'cartas-gx',
      description: 'Cartas Pokémon GX con ataques especiales',
    },
    {
      name: 'Cartas V',
      slug: 'cartas-v',
      description: 'Cartas Pokémon V de la era moderna',
    },
    {
      name: 'Cartas VMAX',
      slug: 'cartas-vmax',
      description: 'Cartas Pokémon VMAX Gigamax',
    },
    {
      name: 'Cartas Vintage',
      slug: 'cartas-vintage',
      description: 'Cartas antiguas y de colección',
    },
    {
      name: 'Sobres y Booster Boxes',
      slug: 'sobres-booster-boxes',
      description: 'Sobres sellados y cajas booster',
    },
    {
      name: 'Accesorios',
      slug: 'accesorios',
      description: 'Protectores, carpetas y accesorios',
    },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  console.log('✅ Categorías creadas')

  // Crear productos de ejemplo
  const baseCategory = await prisma.category.findUnique({
    where: { slug: 'cartas-v' },
  })

  if (baseCategory) {
    const products = [
      {
        name: 'Charizard V',
        slug: 'charizard-v',
        description: 'Carta ultra rara de Charizard V. Estado mint.',
        cardNumber: '019/073',
        set: 'Champion\'s Path',
        rarity: 'Ultra Rare',
        condition: 'NM (Near Mint)',
        language: 'Español',
        price: 15000,
        compareAtPrice: 18000,
        stock: 5,
        featured: true,
        isActive: true,
        categoryId: baseCategory.id,
      },
      {
        name: 'Pikachu VMAX',
        slug: 'pikachu-vmax',
        description: 'Pikachu VMAX de Vivid Voltage. Edición limitada.',
        cardNumber: '044/185',
        set: 'Vivid Voltage',
        rarity: 'Secret Rare',
        condition: 'NM (Near Mint)',
        language: 'Inglés',
        price: 25000,
        compareAtPrice: 30000,
        stock: 3,
        featured: true,
        isActive: true,
        categoryId: baseCategory.id,
      },
      {
        name: 'Mewtwo V',
        slug: 'mewtwo-v',
        description: 'Carta holográfica de Mewtwo V.',
        cardNumber: '069/189',
        set: 'Darkness Ablaze',
        rarity: 'Rare Holo V',
        condition: 'NM (Near Mint)',
        language: 'Español',
        price: 12000,
        stock: 8,
        featured: true,
        isActive: true,
        categoryId: baseCategory.id,
      },
      {
        name: 'Rayquaza VMAX',
        slug: 'rayquaza-vmax',
        description: 'Rayquaza VMAX de Evolving Skies.',
        cardNumber: '111/203',
        set: 'Evolving Skies',
        rarity: 'Ultra Rare',
        condition: 'NM (Near Mint)',
        language: 'Inglés',
        price: 35000,
        stock: 2,
        featured: true,
        isActive: true,
        categoryId: baseCategory.id,
      },
      {
        name: 'Umbreon VMAX',
        slug: 'umbreon-vmax',
        description: 'Umbreon VMAX Alternate Art. Carta premium.',
        cardNumber: '215/203',
        set: 'Evolving Skies',
        rarity: 'Secret Rare',
        condition: 'NM (Near Mint)',
        language: 'Inglés',
        price: 120000,
        stock: 1,
        featured: true,
        isActive: true,
        categoryId: baseCategory.id,
      },
      {
        name: 'Lucario V',
        slug: 'lucario-v',
        description: 'Lucario V de Astral Radiance.',
        cardNumber: '078/189',
        set: 'Astral Radiance',
        rarity: 'Rare Holo V',
        condition: 'NM (Near Mint)',
        language: 'Español',
        price: 8000,
        stock: 10,
        featured: false,
        isActive: true,
        categoryId: baseCategory.id,
      },
      {
        name: 'Giratina VSTAR',
        slug: 'giratina-vstar',
        description: 'Giratina VSTAR de Lost Origin.',
        cardNumber: '131/196',
        set: 'Lost Origin',
        rarity: 'Ultra Rare',
        condition: 'NM (Near Mint)',
        language: 'Inglés',
        price: 28000,
        compareAtPrice: 32000,
        stock: 4,
        featured: true,
        isActive: true,
        categoryId: baseCategory.id,
      },
      {
        name: 'Arceus VSTAR',
        slug: 'arceus-vstar',
        description: 'Arceus VSTAR de Brilliant Stars.',
        cardNumber: '123/172',
        set: 'Brilliant Stars',
        rarity: 'Ultra Rare',
        condition: 'NM (Near Mint)',
        language: 'Español',
        price: 18000,
        stock: 6,
        featured: false,
        isActive: true,
        categoryId: baseCategory.id,
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
