export async function readJson(file: string) {
  const content = await Deno.readTextFile(file)
  return JSON.parse(content)
}

export async function backupFile(file: string, oldFile: string) {
  await Deno.copyFile(file, oldFile)
  console.log(`Backup file ${file} to ${oldFile}`)
}

export function currentDate(): string {
  const date = new Date()
  return `${date.getUTCFullYear()}/${
    date.getUTCMonth() + 1
  }/${date.getUTCDate()}`
}
