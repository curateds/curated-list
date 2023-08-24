import { assert, assertEquals } from "std/testing/asserts.ts"
import extractLinks, { extractDescription } from "./extract-links.ts"
import { cheerio } from "../deps.ts"

Deno.test("should extract <li> links", () => {
  const text = `
  <li>
<p dir="auto"><a href="https://github.com/mbrn/material-table">material-table</a> - <a href="https://material-table.com/" rel="nofollow">demo/docs</a> - Built on Material UI, plus: grouping, tree data, expandable rows, export, inline editing</p>
</li>`
  const links = extractLinks(text)
  console.log(links.slice(0, 10))
  assert(
    links.length === 1,
    "extract links from the html.",
  )
})

Deno.test("should extract <h2> <h3> <h4> links", () => {
  const text = `
  <h2>
    <a href="https://github.com/denoland/deno">Deno</a> - A secure runtime for JavaScript and TypeScript
  </h2>
  <h3>
    <a href="https://deno.land">Deno website</a>
  </h3>
  <h4 dir="auto">
  <a href="#cover">Book Cover Image</a>
  <a href="https://www.golang-book.com/" rel="nofollow">An Introduction to Programming in Go</a> <em>Free</em>
  </h4>
  `
  const links = extractLinks(text)
  console.log(links)
  assertEquals(links.length, 3)
})

Deno.test("should not extract local links", () => {
  const text = `
  <li>
  <p dir="auto"><a href="/about">About</a></p>
  </li>`

  const links = extractLinks(text)

  assertEquals(links.length, 0)
})

Deno.test("should extract description", () => {
  const html = `
  <li><a href="https://github.com/crypto101/book">Crypto 101</a> (<a href="https://www.crypto101.io/" rel="nofollow">Site</a>, cc-nc) - the introductory book on cryptography</li>`
  const text = cheerio.load(html)("li").text()
  const description = extractDescription(text)
  assertEquals(description, "the introductory book on cryptography")
})

Deno.test("should only extract name from the first link", () => {
  const html = `
  <li><a href="https://github.com/crypto101/book">Crypto 101</a> (<a href="https://www.crypto101.io/" rel="nofollow">Site</a>, cc-nc) - the introductory book on cryptography</li>`
  const link = extractLinks(html)[0]
  assertEquals(link.name, "Crypto 101")
})
