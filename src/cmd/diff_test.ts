import { assert } from "std/assert/assert.ts"
import { linksDiff } from "./diff.ts"
import { assertEquals } from "std/assert/assert_equals.ts"
import { assertArrayIncludes } from "std/assert/assert_array_includes.ts"

Deno.test(function testLinksDiff() {
  const x = [
    { url: "https://deno.land", name: "deno" },
    { url: "https://github.com", name: "github" },
  ]

  const y = [
    { url: "https://deno.land", name: "deno" },
    { url: "https://github.com", name: "github", description: "Git hub" },
    { url: "https://rust-lang.org", name: "rust lang" },
  ]

  const diff = linksDiff(x, y)

  assertEquals(diff.length, 2)
  assert(diff.includes(y[1]))
  assertArrayIncludes(diff, y.slice(1))
})

Deno.test("linksDiff returns correct diff when there is undefined", () => {
  const x = [
    { url: "https://deno.land", name: "deno" },
    { url: "https://github.com", name: "github" },
  ]
  const y = [
    { url: "https://deno.land", name: "deno", description: undefined },
    { url: "https://github.com", name: "github", description: undefined },
  ]
  const diff = linksDiff(x, y)
  assert(diff.length === 0)
})
