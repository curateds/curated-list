import { assert } from "std/assert/assert.ts"
import * as hex from "std/encoding/hex.ts"

const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

export function encode(s: string): string {
  const arrayBuffer = textEncoder.encode(s)
  const hexEncoded = hex.encode(arrayBuffer)
  return "_" + textDecoder.decode(hexEncoded)
}

export function decode(s: string): string {
  assert(s.charAt(0) == "_")
  const hexEncoded = textEncoder.encode(s.slice(1))
  const arrayBuffer = hex.decode(hexEncoded)
  return textDecoder.decode(arrayBuffer)
}
