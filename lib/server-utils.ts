import { revalidatePath } from "next/cache"

export function revalidatePaths(...paths: string[]) {
  console.log('🔄 Revalidating paths:', paths)
  paths.forEach((path) => {
    try {
      revalidatePath(path)
      console.log('✅ Revalidated:', path)
    } catch (error) {
      console.error('❌ Failed to revalidate:', path, error)
    }
  })
}
