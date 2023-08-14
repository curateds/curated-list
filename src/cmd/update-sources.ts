import * as Github from "../github.ts"
import { retry } from "../../deps.ts"
import readConfig, { FileName } from "../config.ts"

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  await main()
}

export default async function main(prefix = "data") {
  const config = await readConfig()
  const sources = Object.keys(config.sources)
  console.log(`Update ${sources.length} sources to directory ${prefix}`)
  return await synchronizeSources(sources, prefix)
}

async function synchronizeSources(
  sources: string[],
  prefix: string,
): Promise<string> {
  const repositories = await retry.retryAsync(
    () => Github.queryRepositories(sources),
    { delay: 1000 },
  )
  const text = JSON.stringify(repositories, null, 2)
  const file = `${prefix}/${FileName.repository}`
  await Deno.mkdir(prefix, { recursive: true })
  await Deno.writeTextFile(file, text)
  return file
}
