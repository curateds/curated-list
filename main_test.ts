import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.192.0/testing/asserts.ts"
import { indexRepo } from "./main.ts"

Deno.test(function addTest() {
  assertEquals(2 + 3, 5)
})

Deno.test(async function indexRepoTest() {
  const repo = "ripienaar/free-for-dev"
  const links = await indexRepo(repo)
  assert(links.length > 0, "links should not be empty")
  assert(
    links.every((link) => link.name && link.url),
    "each link should have name, url",
  )
})
