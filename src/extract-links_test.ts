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

Deno.test("should not extract empty link", () => {
  const text = `
  <li>
  <p dir="auto"><a href="https://github.com/sindresorhus/awesome"><img src="https://camo.githubusercontent.com/abb97269de2982c379cbc128bba93ba724d8822bfbe082737772bd4feb59cb54/68747470733a2f2f63646e2e7261776769742e636f6d2f73696e647265736f726875732f617765736f6d652f643733303566333864323966656437386661383536353265336136336531353464643865383832392f6d656469612f62616467652e737667" alt="Awesome" data-canonical-src="https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg" style="max-width: 100%;"></a></p>
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

Deno.test("should strip quotes from the description", () => {
  const html = `
  <li><a href="https://www.lavender.ai">Lavender</a> - “Lavender is an AI email assistant that helps you write better emails faster, double replies, and save time.”</li>`
  const links = extractLinks(html)
  assertEquals(links.length, 1)
  assertEquals(
    links[0].description,
    "Lavender is an AI email assistant that helps you write better emails faster, double replies, and save time.",
  )

  const html2 = `
  <li><a href="https://en.wikipedia.org/wiki/Blockchain" rel="nofollow">Blockchain</a> - "A blockchain is a growing list of records, called blocks, which are linked using cryptography."</li>`
  const links2 = extractLinks(html2)
  assertEquals(links2.length, 1)
  assertEquals(
    links2[0].description,
    "A blockchain is a growing list of records, called blocks, which are linked using cryptography.",
  )
})

Deno.test("should not strip middle quotes from the description", () => {
  const html = `
  <li><a href="https://www.lavender.ai">Lavender</a> - “Lavender is an AI email assistant that helps you write better emails faster, "double replies", and save time.”</li>`
  const links = extractLinks(html)
  assertEquals(links.length, 1)
  assertEquals(
    links[0].description,
    'Lavender is an AI email assistant that helps you write better emails faster, "double replies", and save time.',
  )
})
