import { assert } from "std/testing/asserts.ts"
import { indexRepo } from "./update-lists.ts"

Deno.test(async function indexRepoTest() {
  const repo = "ripienaar/free-for-dev"
  const links = await indexRepo(repo)
  assert(links.length > 0, "links should not be empty")
  assert(
    links.every((link) => link.name && link.url),
    "each link should have name, url",
  )
})
