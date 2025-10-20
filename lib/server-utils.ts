import { revalidatePath } from "next/cache"

export function revalidatePaths(...paths: string[]) {
  paths.forEach((path) => {
    try {
      revalidatePath(path)
    } catch (error) {
      console.error('❌ Failed to revalidate:', path, error)
    }
  })
}
