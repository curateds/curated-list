import { assert } from "std/assert/assert.ts"
import { decode, encode } from "./encoding.ts"

Deno.test(function encodeTest() {
  const text = encode("in-fun/kube")
  assert(text == "_696e2d66756e2f6b756265")
})

Deno.test(function decodeTest() {
  const text = "_696e2d66756e2f6b756265"
  const decoded = decode(text)
  assert(decoded == "in-fun/kube")
})
