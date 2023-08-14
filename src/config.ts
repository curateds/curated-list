import { yaml } from "../deps.ts"

export type Config = {
  sources: Record<string, { category: string }>
}

export default async function readConfig(): Promise<Config> {
  const configText = await Deno.readTextFile("config.yml")
  const config = yaml.parse(configText) as Config
  return config
}

export const FileName = {
  repository: "repositories.json",
}
