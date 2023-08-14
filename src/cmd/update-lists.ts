import * as Github from "../github.ts"
import extractLinks from "../extract-links.ts"
import { FileName } from "../config.ts"
import { readJson } from "../util.ts"

export async function indexRepo(repo: string) {
  // Given a repository name with author ex: vinta/awesome-python
  const response = await Github.fetchReadMeWithCache(repo)
  const links = extractLinks(response)
  return links
}

export const directory = "data/raw"

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const dict: Record<string, Github.Repository> = await readJson(
    `data/${FileName.repository}`,
  )
  let count = 0
  const repositores = Object.values(dict)
  for (const repo of repositores) {
    const links = await synchronizeRepo(repo, directory)
    count += links.length
  }
  console.log(`Indexed ${count} links from ${repositores.length} repositories`)
}

export async function synchronizeRepo(repo: Github.Repository, prefix: string) {
  const repoName = repo.nameWithOwner
  const links = await indexRepo(repoName)
  console.log(`Extracted ${links.length} links from ${repoName}`)
  const text = JSON.stringify(links, null, 2)
  const name = Github.nameOfRepo(repoName)
  await Deno.mkdir(prefix, { recursive: true })
  await Deno.writeTextFile(`${prefix}/${name}.json`, text)
  return links
}
