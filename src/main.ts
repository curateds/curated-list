import * as Github from "./github.ts"
import extractLinks from "./extract-links.ts"
import { yaml } from "../deps.ts"

export async function indexRepo(repo: string) {
  // Given a repository name with author ex: vinta/awesome-python
  const response = await Github.fetchReadMeWithCache(repo)
  const links = extractLinks(response)
  return links
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const configText = await Deno.readTextFile("config.yml")
  const config = yaml.parse(configText) as Config
  const sources = Object.keys(config.sources)
  synchronizeSources(sources, "data")
  for (const source of sources) {
    synchronizeRepo(source, "data/raw")
  }
}

type Config = {
  sources: Record<string, { category: string }>
}

async function synchronizeSources(sources: string[], prefix: string) {
  const repositories = await Github.queryRepositories(sources)
  const text = JSON.stringify(repositories, null, 2)
  await Deno.mkdir(prefix, { recursive: true })
  await Deno.writeTextFile(`${prefix}/repositories.json`, text)
}

async function synchronizeRepo(repo: string, prefix: string) {
  const links = await indexRepo(repo)
  console.log(`Extracted ${links.length} links`)
  const text = JSON.stringify(links, null, 2)
  const name = Github.nameOfRepo(repo)
  Deno.mkdirSync(prefix, { recursive: true })
  Deno.writeTextFileSync(`${prefix}/${name}.json`, text)
}
