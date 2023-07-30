import * as Github from "./github.ts"
import extractLinks from "./extract-links.ts"

export async function indexRepo(repo: string) {
  // Given a repository name with author ex: vinta/awesome-python
  const response = await Github.fetchReadMeWithCache(repo)
  const links = extractLinks(response)
  return links
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const repo = "ripienaar/free-for-dev"
  const links = await indexRepo(repo)
  console.log(`Extracted ${links.length} links`)
  const text = JSON.stringify(links, null, 2)
  const name = Github.nameOfRepo(repo)
  Deno.mkdirSync("data", { recursive: true })
  Deno.writeTextFileSync(`data/${name}.json`, text)
}
