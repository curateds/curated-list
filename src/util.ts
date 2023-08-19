import { exists } from "std/fs/mod.ts"

/**
 *  Read the file content and parse as JSON, or return the provided fallback if file doesn't exist.
 */
export async function readJson(file: string, fallback = {}) {
  try {
    const content = await Deno.readTextFile(file)
    return JSON.parse(content)
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return fallback
    } else throw error
  }
}

export async function backupFile(file: string, oldFile: string) {
  if (await exists(file)) {
    await Deno.copyFile(file, oldFile)
    console.log(`Backup file ${file} to ${oldFile}`)
  }
}

export function currentDate(): string {
  const date = new Date()
  return `${date.getUTCFullYear()}/${
    date.getUTCMonth() + 1
  }/${date.getUTCDate()}`
}
