import * as Github from "../github.ts"
import extractLinks from "../extract-links.ts"
import readConfig from "../config.ts"

export async function indexRepo(repo: string) {
  // Given a repository name with author ex: vinta/awesome-python
  const response = await Github.fetchReadMeWithCache(repo)
  const links = extractLinks(response)
  return links
}

export const directory = "data/raw"

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const config = await readConfig()
  const sources = Object.keys(config.sources)
  let count = 0
  for (const source of sources) {
    const links = await synchronizeRepo(source, directory)
    count += links.length
  }
  console.log(`Indexed ${count} links from ${sources.length} repositories`)
}

export async function synchronizeRepo(repo: string, prefix: string) {
  const links = await indexRepo(repo)
  console.log(`Extracted ${links.length} links from ${repo}`)
  const text = JSON.stringify(links, null, 2)
  const name = Github.nameOfRepo(repo)
  await Deno.mkdir(prefix, { recursive: true })
  await Deno.writeTextFile(`${prefix}/${name}.json`, text)
  return links
}
