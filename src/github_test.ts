import { assert } from "std/testing/asserts.ts"
import * as Github from "./github.ts"

Deno.test(async function fetchReadMe() {
  const repo = "vinta/awesome-python"
  const response = await Github.fetchReadMeWithCache(repo)
  assert(
    response.indexOf("<article") > 0,
    "the response should contains html <article> tag.",
  )
})

Deno.test(async function queryRepositories() {
  const repositories = ["lilac/fun", "in-fun/KubeScript"]
  const data = await Github.queryRepositories(repositories)
  console.log(data)
  for (const repo of repositories) {
    const { nameWithOwner } = data[repo]
    assert(nameWithOwner)
    assert(nameWithOwner === repo)
  }
})
