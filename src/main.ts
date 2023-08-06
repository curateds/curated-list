import * as Github from "./github.ts"
import { yaml } from "../deps.ts"

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const config = await readConfig()
  const sources = Object.keys(config.sources)
  synchronizeSources(sources, "data")
}

type Config = {
  sources: Record<string, { category: string }>
}

export async function readConfig(): Promise<Config> {
  const configText = await Deno.readTextFile("config.yml")
  const config = yaml.parse(configText) as Config
  return config
}

async function synchronizeSources(sources: string[], prefix: string) {
  const repositories = await Github.queryRepositories(sources)
  const text = JSON.stringify(repositories, null, 2)
  await Deno.mkdir(prefix, { recursive: true })
  await Deno.writeTextFile(`${prefix}/repositories.json`, text)
}
