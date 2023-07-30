import { assert } from "std/testing/asserts.ts"
import extractLinks from "./extract-links.ts"

Deno.test(async function testExtractLinks() {
  const text = await Deno.readTextFile("cache/vinta-awesome-python.html")
  const links = extractLinks(text)
  console.log(links.slice(0, 10))
  assert(
    links.length > 0,
    "extract links from the html.",
  )
})
