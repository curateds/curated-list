import { assert } from "std/testing/asserts.ts"
import extractLinks from "./extract-links.ts"

Deno.test(function testExtractLinks() {
  const text = `
  <li>
<p dir="auto"><a href="https://github.com/mbrn/material-table">material-table</a> - <a href="https://material-table.com/" rel="nofollow">demo/docs</a> - Built on Material UI, plus: grouping, tree data, expandable rows, export, inline editing</p>
</li>`
  const links = extractLinks(text)
  console.log(links.slice(0, 10))
  assert(
    links.length > 0,
    "extract links from the html.",
  )
})
